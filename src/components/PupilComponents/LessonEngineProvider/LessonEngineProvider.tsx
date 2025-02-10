import {
  ReactNode,
  createContext,
  useContext,
  memo,
  useReducer,
  Reducer,
  useEffect,
} from "react";

import {
  useLessonPopStateHandler,
  useNavigateToSection,
} from "../pupilUtils/lessonNavigation";
import { QuestionState } from "../QuizUtils/questionTypes";

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
  return allLessonReviewSections.includes(section as LessonReviewSection);
}

export type QuizResult = {
  grade: number;
  numQuestions: number;
  questionResults?: QuestionState[];
};

export type VideoResult = {
  played: boolean;
  duration: number;
  timeElapsed: number;
  muted: boolean;
  signedOpened: boolean;
  transcriptOpened: boolean;
};
export type IntroResult = Partial<{
  worksheetAvailable: boolean;
  worksheetDownloaded: boolean;
  filesDownloaded?: boolean;
  additionalFilesAvailable?: boolean;
}>;

type LessonEngineAction =
  | {
      type: "setCurrentSection";
      section: LessonSection;
    }
  | {
      type: "completeActivity";
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
  sections: Partial<{
    "starter-quiz": { isComplete: boolean } & QuizResult;
    "exit-quiz": { isComplete: boolean } & QuizResult;
    video: { isComplete: boolean } & VideoResult;
    intro: { isComplete: boolean } & IntroResult;
  }>;
  lessonStarted: boolean;
  timeStamp: { section: LessonSection; time: number };
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
        timeStamp: {
          section: action.section,
          time: new Date().getTime(),
        },
      };
    case "completeActivity": {
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
        timeStamp: {
          section: currentState.currentSection,
          time: new Date().getTime(),
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
        timeStamp: {
          section: nextSection,
          time: new Date().getTime(),
        },
      };
    }
    case "updateSectionResult": {
      if (!isLessonReviewSection(currentState.currentSection)) {
        throw new Error(
          `Cannot update result for non-review section '${currentState.currentSection}'`,
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

export type LessonSectionResults = LessonEngineState["sections"];

export type LessonEngineContextType = {
  currentSection: LessonSection;
  sectionResults: LessonSectionResults;
  timeStamp: { section: LessonSection; time: number };
  isLessonComplete: boolean;
  completeActivity: (section: LessonReviewSection) => void;
  updateCurrentSection: (section: LessonSection) => void;
  proceedToNextSection: () => void;
  updateSectionResult: (vals: QuizResult | VideoResult | IntroResult) => void;
  updateWorksheetDownloaded: (result: IntroResult) => void;
  updateAdditionalFilesDownloaded: (result: IntroResult) => void;
  lessonReviewSections: Readonly<LessonReviewSection[]>;
  lessonStarted: boolean;
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
  initialSection: LessonSection;
};

export const LessonEngineProvider = memo(
  ({
    children,
    initialLessonReviewSections,
    initialSection,
  }: LessonEngineProviderProps) => {
    const [state, dispatch] = useReducer<
      Reducer<LessonEngineState, LessonEngineAction>
    >(lessonEngineReducer, {
      lessonReviewSections: initialLessonReviewSections,
      currentSection: initialSection,
      lessonStarted: false,
      sections: {},
      timeStamp: {
        section: initialSection,
        time: new Date().getTime(),
      },
    });
    const navigateToSection = useNavigateToSection();

    // Sync the currentSection when the user navigates back/forward
    useLessonPopStateHandler((section) => {
      dispatch({ type: "setCurrentSection", section });
    });

    // Update the URL when `currentSection` changes
    useEffect(() => {
      navigateToSection(state.currentSection);
    }, [navigateToSection, state.currentSection]);

    const { track } = usePupilAnalytics();

    const trackLessonStarted = () => {
      if (!state.lessonStarted && track.lessonStarted) {
        track.lessonStarted({});
      }
    };

    const completeActivity = (section: LessonReviewSection) => {
      if (state.sections[section]?.isComplete) {
        console.warn(`Section '${section}' is already complete`);
        return;
      }

      trackLessonStarted();
      if (
        state.lessonReviewSections.every(
          (s) => state.sections[s]?.isComplete || s === section, // the current section will only be marked as complete on the next render
        )
      ) {
        if (track.lessonCompleted) {
          track.lessonCompleted({});
        }
      }
      dispatch({ type: "completeActivity", section });
    };

    const updateCurrentSection = (section: LessonSection) => {
      trackLessonStarted();
      dispatch({ type: "setCurrentSection", section });
    };

    const proceedToNextSection = () => {
      dispatch({ type: "proceedToNextSection" });
      trackLessonStarted();
    };

    const updateSectionResult = (
      result: QuizResult | VideoResult | IntroResult,
    ) => {
      trackLessonStarted();
      dispatch({ type: "updateSectionResult", result });
    };

    const updateWorksheetDownloaded = (result: IntroResult) => {
      dispatch({ type: "updateSectionResult", result });
    };

    const updateAdditionalFilesDownloaded = (result: IntroResult) => {
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
          timeStamp: state.timeStamp,
          isLessonComplete,
          completeActivity,
          updateCurrentSection,
          proceedToNextSection,
          updateSectionResult,
          lessonReviewSections: state.lessonReviewSections,
          lessonStarted: state.lessonStarted,
          updateWorksheetDownloaded,
          updateAdditionalFilesDownloaded,
        }}
      >
        {children}
      </LessonEngineContext.Provider>
    );
  },
);
