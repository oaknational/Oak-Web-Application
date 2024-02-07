import {
  ReactNode,
  createContext,
  useContext,
  memo,
  useReducer,
  Reducer,
} from "react";

export const lessonSections = [
  "overview",
  "intro",
  "starter-quiz",
  "video",
  "exit-quiz",
  "review",
] as const;

export const lessonReviewSections = [
  "intro",
  "starter-quiz",
  "video",
  "exit-quiz",
] as const;

export type LessonSection = (typeof lessonSections)[number];

type LessonReviewSection = (typeof lessonReviewSections)[number];

export const isLessonSection = (
  currentSection: string,
): currentSection is LessonSection => {
  return lessonSections.includes(currentSection as LessonSection);
};

type QuizResult = { grade: number; numQuestions: number };
type LessonSectionState = { isComplete: boolean } & QuizResult;
type LessonEngineAction =
  | {
      type: "setCurrentSection";
      section: LessonSection;
    }
  | {
      type: "completeSection";
      section: LessonReviewSection;
    }
  | {
      type: "updateQuizResult";
      result: QuizResult;
    }
  | {
      type: "proceedToNextSection";
    };
type LessonEngineState = {
  currentSection: LessonSection;
  sections: Partial<Record<LessonSection, LessonSectionState>>;
};

const lessonEngineReducer: Reducer<LessonEngineState, LessonEngineAction> = (
  currentState,
  action,
) => {
  switch (action.type) {
    case "setCurrentSection":
      return { ...currentState, currentSection: action.section };
    case "completeSection": {
      const newState = {
        ...currentState,
        sections: {
          ...currentState.sections,
          [action.section]: {
            isComplete: true,
            ...currentState.sections[action.section],
          },
        },
      };

      // redirect the user according to what sections have been completed
      newState.currentSection = lessonReviewSections.every(
        (section) => newState.sections[section]?.isComplete,
      )
        ? "review"
        : "overview";

      return newState;
    }
    case "proceedToNextSection": {
      const nextSection =
        lessonReviewSections.find(
          (section) => !currentState.sections[section]?.isComplete,
        ) ?? lessonSections[0];

      return { ...currentState, currentSection: nextSection };
    }
    case "updateQuizResult":
      return {
        ...currentState,
        sections: {
          ...currentState.sections,
          [currentState.currentSection]: {
            ...currentState.sections[currentState.currentSection],
            ...action.result,
          },
        },
      };
    default:
      return currentState;
  }
};

export type LessonEngineContextType = {
  currentSection: LessonSection;
  completedSections: LessonReviewSection[];
  sectionResults: LessonEngineState["sections"];
  getIsComplete: (section: LessonReviewSection) => boolean;
  completeSection: (section: LessonReviewSection) => void;
  updateCurrentSection: (section: LessonReviewSection) => void;
  proceedToNextSection: () => void;
  updateQuizResult: (vals: QuizResult) => void;
} | null;

export const LessonEngineContext = createContext<LessonEngineContextType>(null);

export const useLessonEngineContext = () => {
  const context = useContext(LessonEngineContext);
  if (!context) {
    throw new Error("`LessonEngineProvider` is not available");
  }
  return context;
};

export const LessonEngineProvider = memo((props: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(lessonEngineReducer, {
    currentSection: "overview",
    sections: {},
  });
  const getIsComplete = (section: LessonReviewSection): boolean =>
    state.sections[section]?.isComplete ?? false;
  const completeSection = (section: LessonReviewSection) => {
    dispatch({ type: "completeSection", section });
  };
  const updateCurrentSection = (section: LessonSection) =>
    dispatch({ type: "setCurrentSection", section });
  const proceedToNextSection = () => dispatch({ type: "proceedToNextSection" });
  const updateQuizResult = (result: QuizResult) => {
    dispatch({ type: "updateQuizResult", result });
  };
  const completedSections = lessonReviewSections.filter(
    (section) => state.sections[section]?.isComplete,
  );

  return (
    <LessonEngineContext.Provider
      value={{
        currentSection: state.currentSection,
        completedSections,
        sectionResults: state.sections,
        getIsComplete,
        completeSection,
        updateCurrentSection,
        proceedToNextSection,
        updateQuizResult,
      }}
    >
      {props.children}
    </LessonEngineContext.Provider>
  );
});
