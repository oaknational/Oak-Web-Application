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

export type LessonSectionResults = LessonEngineState["sections"];

export type LessonEngineContextType = {
  currentSection: LessonSection;
  sectionResults: LessonSectionResults;
  isLessonComplete: boolean;
  completeActivity: (section: LessonReviewSection) => void;
  updateCurrentSection: (section: LessonSection) => void;
  proceedToNextSection: () => void;
  updateSectionResult: (vals: QuizResult | VideoResult | IntroResult) => void;
  updateWorksheetDownloaded: (result: IntroResult) => void;
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

    const getActivityTrackingData = (section: LessonReviewSection) => ({
      pupilExperienceLessonActivity: section,
    });

    const getQuizTrackingData = (section: "starter-quiz" | "exit-quiz") => ({
      pupilExperienceLessonActivity: section,
      pupilQuizGrade: state.sections[section]?.grade || 0,
      pupilQuizNumQuestions: state.sections[section]?.numQuestions || 0,
      // FIXME: these are still wrong. The full results should be sent
      hintQuestion: "",
      hintQuestionResult: "",
      hintUsed: "",
    });

    const getVideoTrackingData = (section: "video") => ({
      pupilExperienceLessonActivity: section,
      pupilVideoDurationSeconds: state.sections["video"]?.duration || 0,
      isMuted: state.sections["video"]?.muted || false,
      signedOpened: state.sections["video"]?.signedOpened || false,
      pupilVideoTimeElapsedSeconds: state.sections["video"]?.timeElapsed || 0,
      pupilVideoPlayed: state.sections["video"]?.played || false,
      transcriptOpened: state.sections["video"]?.transcriptOpened || false,
    });

    const completeActivity = (section: LessonReviewSection) => {
      trackLessonStarted();
      if (track.lessonActivityCompleted) {
        track.lessonActivityCompleted(getActivityTrackingData(section));
      }
      if (section === "intro" && track.lessonActivityCompletedIntroduction) {
        track.lessonActivityCompletedIntroduction(
          getActivityTrackingData(section),
        );
      }
      if (
        section === "starter-quiz" &&
        track.lessonActivityCompletedStarterQuiz &&
        state.sections["starter-quiz"] !== undefined
      ) {
        track.lessonActivityCompletedStarterQuiz(getQuizTrackingData(section));
      }
      if (section === "video" && state.sections["video"] !== undefined) {
        track.lessonActivityCompletedLessonVideo(getVideoTrackingData(section));
      }
      if (
        section === "exit-quiz" &&
        state.sections["exit-quiz"] !== undefined
      ) {
        track.lessonActivityCompletedExitQuiz(getQuizTrackingData(section));
      }
      if (
        state.lessonReviewSections.every(
          (s) => state.sections[s]?.isComplete || s === section, // the current section will only be marked as complete on the next render
        )
      ) {
        if (track.lessonCompleted) {
          track.lessonCompleted({});
        }

        // this is the only transition that doesn't happen via the other methods
        // so we need to ensure tracking happens
        trackSectionStarted("review");
      }
      dispatch({ type: "completeActivity", section });
    };

    const trackSectionStarted = (section: LessonSection) => {
      trackLessonStarted();

      if (
        section === "intro" &&
        track.lessonActivityStartedIntroduction &&
        !state.sections["intro"]?.isComplete
      ) {
        track.lessonActivityStartedIntroduction(
          getActivityTrackingData(section),
        );
      } else if (
        section === "starter-quiz" &&
        track.lessonActivityStartedStarterQuiz &&
        !state.sections["starter-quiz"]?.isComplete
      ) {
        track.lessonActivityStartedStarterQuiz({
          ...getQuizTrackingData(section),
          hintAvailable: true,
        });
      } else if (
        section === "exit-quiz" &&
        track.lessonActivityStartedExitQuiz &&
        !state.sections["exit-quiz"]?.isComplete
      ) {
        track.lessonActivityStartedExitQuiz({
          ...getQuizTrackingData(section),
          hintAvailable: true,
        });
      } else if (
        section === "video" &&
        track.lessonActivityStartedLessonVideo &&
        !state.sections["video"]?.isComplete
      ) {
        track.lessonActivityStartedLessonVideo(getVideoTrackingData(section));
      }
    };

    const updateCurrentSection = (section: LessonSection) => {
      if (
        isLessonReviewSection(state.currentSection) &&
        !state.sections[state.currentSection]?.isComplete
      ) {
        if (track.lessonActivityAbandoned) {
          track.lessonActivityAbandoned(
            getActivityTrackingData(state.currentSection),
          );
        }
      }

      trackSectionStarted(section);

      dispatch({ type: "setCurrentSection", section });
    };

    const proceedToNextSection = () => {
      trackLessonStarted();
      dispatch({ type: "proceedToNextSection" });
      const nextSection =
        state.lessonReviewSections.find(
          (section) => !state.sections[section]?.isComplete,
        ) ?? "review";
      trackSectionStarted(nextSection);
    };

    const updateSectionResult = (
      result: QuizResult | VideoResult | IntroResult,
    ) => {
      trackLessonStarted();
      dispatch({ type: "updateSectionResult", result });
    };

    const updateWorksheetDownloaded = (result: IntroResult) => {
      if (result.worksheetDownloaded) {
        track.lessonActivityDownloadedWorksheet({});
      }
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
          completeActivity,
          updateCurrentSection,
          proceedToNextSection,
          updateSectionResult,
          lessonReviewSections: state.lessonReviewSections,
          lessonStarted: state.lessonStarted,
          updateWorksheetDownloaded,
        }}
      >
        {children}
      </LessonEngineContext.Provider>
    );
  },
);
