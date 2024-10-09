import { PupilExperienceLessonActivityValueType } from "@/browser-lib/avo/Avo";
import {
  LessonSection,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";
import { usePupilAnalytics } from "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics";

export const useTrackSectionStarted = () => {
  const { sectionResults } = useLessonEngineContext();
  const { track } = usePupilAnalytics();

  const getQuizTrackingData = (section: "starter-quiz" | "exit-quiz") => ({
    pupilExperienceLessonActivity: section,
    pupilQuizGrade: sectionResults[section]?.grade || 0,
    pupilQuizNumQuestions: sectionResults[section]?.numQuestions || 0,
    // FIXME: these are still wrong. The full results should be sent
    hintQuestion: "",
    hintQuestionResult: "",
    hintUsed: "",
  });

  const getVideoTrackingData = () => ({
    pupilExperienceLessonActivity:
      "video" as PupilExperienceLessonActivityValueType,
    pupilVideoDurationSeconds: sectionResults.video?.duration || 0,
    isMuted: sectionResults.video?.muted || false,
    signedOpened: sectionResults.video?.signedOpened || false,
    pupilVideoTimeElapsedSeconds: sectionResults.video?.timeElapsed || 0,
    pupilVideoPlayed: sectionResults.video?.played || false,
    transcriptOpened: sectionResults.video?.transcriptOpened || false,
  });

  const trackSectionStarted = (section: LessonSection) => {
    if (
      section === "intro" &&
      track.lessonActivityStartedIntroduction &&
      !sectionResults["intro"]?.isComplete
    ) {
      track.lessonActivityStartedIntroduction({
        pupilExperienceLessonActivity: section,
      });
    } else if (
      section === "starter-quiz" &&
      track.lessonActivityStartedStarterQuiz &&
      !sectionResults["starter-quiz"]?.isComplete
    ) {
      track.lessonActivityStartedStarterQuiz({
        ...getQuizTrackingData(section),
        hintAvailable: true,
      });
    } else if (
      section === "exit-quiz" &&
      track.lessonActivityStartedExitQuiz &&
      !sectionResults["exit-quiz"]?.isComplete
    ) {
      track.lessonActivityStartedExitQuiz({
        ...getQuizTrackingData(section),
        hintAvailable: true,
      });
    } else if (
      section === "video" &&
      track.lessonActivityStartedLessonVideo &&
      !sectionResults["video"]?.isComplete
    ) {
      track.lessonActivityStartedLessonVideo(getVideoTrackingData());
    }
  };
  return {
    trackSectionStarted,
    getQuizTrackingData,
    getVideoTrackingData,
  };
};
