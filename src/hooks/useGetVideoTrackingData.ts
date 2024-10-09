import { PupilExperienceLessonActivityValueType } from "@/browser-lib/avo/Avo";
import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

export const useGetVideoTrackingData = () => {
  const { sectionResults } = useLessonEngineContext();

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

  return {
    getVideoTrackingData,
  };
};
