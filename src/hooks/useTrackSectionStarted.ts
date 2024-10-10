import { useGetQuizTrackingData } from "./useGetQuizTrackingData";
import { useGetVideoTrackingData } from "./useGetVideoTrackingData";

import {
  LessonSection,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";
import { usePupilAnalytics } from "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics";

export const useTrackSectionStarted = () => {
  const { sectionResults } = useLessonEngineContext();
  const { track } = usePupilAnalytics();
  const { getQuizTrackingData } = useGetQuizTrackingData();
  const { getVideoTrackingData } = useGetVideoTrackingData();

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
  };
};
