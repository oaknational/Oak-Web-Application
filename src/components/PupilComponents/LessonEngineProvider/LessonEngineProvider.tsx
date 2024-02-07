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
export type LessonReviewSection = (typeof lessonReviewSections)[number];

export const isLessonSection = (
  currentSection: string,
): currentSection is LessonSection => {
  return lessonSections.includes(currentSection as LessonSection);
};

export function isLessonReviewSection(
  section: string,
): section is LessonReviewSection {
  return lessonSections.includes(section as LessonReviewSection);
}

type QuizResult = { grade: number; numQuestions: number };
type LessonSectionState = {
  isComplete: boolean;
} & Partial<QuizResult>;
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
  sections: Partial<Record<LessonReviewSection, LessonSectionState>>;
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
            ...currentState.sections[action.section],
            isComplete: true,
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
    case "updateQuizResult": {
      if (!isLessonReviewSection(currentState.currentSection)) {
        throw new Error(
          `Cannot update quiz result for non-review section '${currentState.currentSection}'`,
        );
      }

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
    }
    default:
      return currentState;
  }
};

export type LessonEngineContextType = {
  currentSection: LessonSection;
  sectionResults: LessonEngineState["sections"];
  isLessonComplete: boolean;
  completeSection: (section: LessonReviewSection) => void;
  updateCurrentSection: (section: LessonSection) => void;
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
  const completeSection = (section: LessonReviewSection) => {
    dispatch({ type: "completeSection", section });
  };
  const updateCurrentSection = (section: LessonSection) =>
    dispatch({ type: "setCurrentSection", section });
  const proceedToNextSection = () => dispatch({ type: "proceedToNextSection" });
  const updateQuizResult = (result: QuizResult) => {
    dispatch({ type: "updateQuizResult", result });
  };
  const isLessonComplete = lessonReviewSections.every(
    (section) => state.sections[section]?.isComplete,
  );

  return (
    <LessonEngineContext.Provider
      value={{
        currentSection: state.currentSection,
        sectionResults: state.sections,
        isLessonComplete,
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
