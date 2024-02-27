import {
  ReactNode,
  createContext,
  useContext,
  memo,
  useReducer,
  Reducer,
} from "react";

import { usePupilAnalytics } from "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics";

export const lessonSections = [
  "overview",
  "intro",
  "starter-quiz",
  "video",
  "exit-quiz",
  "review",
] as const;

export const allLessonReviewSections = [
  "intro",
  "starter-quiz",
  "video",
  "exit-quiz",
] as const;

export type LessonSection = (typeof lessonSections)[number];
export type LessonReviewSection = (typeof allLessonReviewSections)[number];

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

export type QuizResult = { grade: number; numQuestions: number };
export type VideoResult = {
  played: boolean;
  duration: number;
  timeElapsed: number;
};
export type IntroResult = {
  worksheetAvailable: boolean;
  worksheetDownloaded: boolean;
};

type LessonSectionState = {
  isComplete: boolean;
} & Partial<QuizResult> &
  Partial<VideoResult> &
  Partial<IntroResult>;

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
      type: "updateSectionResult";
      result: QuizResult | VideoResult | IntroResult;
    }
  | {
      type: "proceedToNextSection";
    };

type LessonEngineState = {
  currentSection: LessonSection;
  lessonReviewSections: Readonly<LessonReviewSection[]>;
  sections: Partial<Record<LessonReviewSection, LessonSectionState>>;
  lessonStarted: boolean;
};

const lessonEngineReducer: Reducer<LessonEngineState, LessonEngineAction> = (
  currentState,
  action,
) => {
  switch (action.type) {
    case "setCurrentSection":
      return {
        ...currentState,
        currentSection: action.section,
        lessonStarted: true,
      };
    case "completeSection": {
      const newState = {
        ...currentState,
        lessonStarted: true,
        sections: {
          ...currentState.sections,
          [action.section]: {
            ...currentState.sections[action.section],
            isComplete: true,
          },
        },
      };

      // redirect the user according to what sections have been completed
      newState.currentSection = currentState.lessonReviewSections.every(
        (section) => newState.sections[section]?.isComplete,
      )
        ? "review"
        : "overview";

      return newState;
    }
    case "proceedToNextSection": {
      // Go to the lesson review when the lesson is complete
      const nextSection =
        currentState.lessonReviewSections.find(
          (section) => !currentState.sections[section]?.isComplete,
        ) ?? "review";

      return {
        ...currentState,
        currentSection: nextSection,
        lessonStarted: true,
      };
    }
    case "updateSectionResult": {
      if (!isLessonReviewSection(currentState.currentSection)) {
        throw new Error(
          `Cannot update quiz result for non-review section '${currentState.currentSection}'`,
        );
      }

      return {
        ...currentState,
        lessonStarted: true,
        sections: {
          ...currentState.sections,
          [currentState.currentSection]: {
            ...currentState.sections[currentState.currentSection],
            ...action.result,
            isComplete: false,
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
  updateSectionResult: (vals: QuizResult | VideoResult | IntroResult) => void;
  lessonReviewSections: Readonly<LessonReviewSection[]>;
} | null;

export const LessonEngineContext = createContext<LessonEngineContextType>(null);

export const useLessonEngineContext = () => {
  const context = useContext(LessonEngineContext);
  if (!context) {
    throw new Error("`LessonEngineProvider` is not available");
  }
  return context;
};

export type LessonEngineProviderProps = {
  children: ReactNode;
  initialLessonReviewSections: Readonly<LessonReviewSection[]>;
};

export const LessonEngineProvider = memo(
  ({ children, initialLessonReviewSections }: LessonEngineProviderProps) => {
    const [state, dispatch] = useReducer(lessonEngineReducer, {
      lessonReviewSections: initialLessonReviewSections,
      currentSection: "overview",
      lessonStarted: false,
      sections: {},
    });

    const { track } = usePupilAnalytics();

    const trackLessonStarted = () => {
      if (!state.lessonStarted && track.lessonStarted) {
        track.lessonStarted({});
      }
    };

    const completeSection = (section: LessonReviewSection) => {
      trackLessonStarted();
      if (track.lessonSectionCompleted) {
        track.lessonSectionCompleted({
          pupilExperienceLessonSection: section,
          pupilQuizGrade: state.sections[section]?.grade,
          pupilQuizNumQuestions: state.sections[section]?.numQuestions,
          pupilVideoPlayed: state.sections[section]?.played,
          pupilVideoDurationSeconds: state.sections[section]?.duration,
          pupilVideoTimeEllapsedSeconds: state.sections[section]?.timeElapsed,
          pupilWorksheetAvailable: state.sections[section]?.worksheetAvailable,
          pupilWorksheetDownloaded:
            state.sections[section]?.worksheetDownloaded,
        });
      }
      if (
        state.lessonReviewSections.every(
          (section) => state.sections[section]?.isComplete,
        )
      ) {
        if (track.lessonCompleted) {
          track.lessonCompleted({});
        }
      }
      dispatch({ type: "completeSection", section });
    };

    const trackSectionStarted = (section: LessonSection) => {
      trackLessonStarted();
      if (isLessonReviewSection(section)) {
        track.lessonSectionStarted({
          pupilExperienceLessonSection: section,
        });
      }
    };

    const updateCurrentSection = (section: LessonSection) => {
      trackLessonStarted();
      trackSectionStarted(section);
      dispatch({ type: "setCurrentSection", section });
    };

    const proceedToNextSection = () => {
      trackLessonStarted();
      trackSectionStarted(state.currentSection);
      dispatch({ type: "proceedToNextSection" });
    };
    const updateSectionResult = (
      result: QuizResult | VideoResult | IntroResult,
    ) => {
      trackLessonStarted();
      dispatch({ type: "updateSectionResult", result });
    };

    const isLessonComplete = state.lessonReviewSections.every(
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
          updateSectionResult,
          lessonReviewSections: state.lessonReviewSections,
        }}
      >
        {children}
      </LessonEngineContext.Provider>
    );
  },
);
