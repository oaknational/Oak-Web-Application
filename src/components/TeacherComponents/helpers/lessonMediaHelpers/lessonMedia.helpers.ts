import type {
  MediaClip,
  MediaClipListCamelCase,
} from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";

export const getPlaybackId = (currentClip: MediaClip) => {
  if (currentClip && currentClip.videoObject) {
    const signed = currentClip.videoObject.playbackIds?.find((p) => {
      return p?.policy === "signed";
    });
    return signed?.id;
  }
  return "";
};

export const joinTranscript = (currentClip: MediaClip) => {
  return currentClip.transcriptSentences?.join(" ");
};

export const getPlayingState = (
  currentClipMediaId: string | undefined,
  mediaId: string,
  playedVideosList?: string[],
) => {
  if (mediaId === currentClipMediaId) {
    return "playing";
  } else if (playedVideosList?.includes(mediaId)) {
    return "played";
  } else {
    return "standard";
  }
};

export const getInitialCurrentClip = (
  listOfAllClips: (MediaClip & { learningCycle: string })[],
  videoQueryParam?: string | string[] | undefined,
) => {
  if (videoQueryParam) {
    return listOfAllClips.find((clip) => clip.mediaId === videoQueryParam);
  } else {
    return listOfAllClips[0];
  }
};

type LearningCycleVideosTitleMap = {
  isMFL: boolean;
  isPELesson: boolean;
  learningCycleVideos: MediaClipListCamelCase | null;
  lessonOutlines: { lessonOutline: string }[] | null;
};

export const createLearningCycleVideosTitleMap = ({
  isMFL,
  isPELesson,
  learningCycleVideos,
  lessonOutlines,
}: LearningCycleVideosTitleMap) => {
  const learningCyclesArray = learningCycleVideos
    ? Object.keys(learningCycleVideos)
    : [];

  const learningCycleVideosTitleMap: { [key: string]: string | undefined } = {};

  learningCyclesArray.forEach((learningCycle) => {
    const firstVideo = learningCycleVideos?.[learningCycle]?.[0];
    const customTitle = firstVideo?.customTitle;

    // if it is PE lesson and there is a customTitle on the first video use that
    if (isPELesson && customTitle) {
      learningCycleVideosTitleMap[learningCycle] = customTitle;
      // if it is PE lesson with no custom title then the first video of each learning cycle is the title
    } else if (isPELesson) {
      learningCycleVideosTitleMap[learningCycle] =
        firstVideo?.mediaObject?.displayName;
      // for the rest of subjects we hardcode the title for 'intro' learning cycle because there is no lesson outline for it
      // intro is called 'Keywords' for MFL and 'Intro' for the rest of the subjects
    } else if (learningCycle === "intro") {
      learningCycleVideosTitleMap[learningCycle] = isMFL ? "Keywords" : "Intro";
      // for the remaining learning cycles we use the lesson outline as the title
    } else {
      // the last letter of learning cycle is the number of the learning cycle
      const learningCycleNumber: number = Number(learningCycle.slice(-1));
      // lessonOutlineIndex is the learning cycle number - 1 because it is 0 indexed
      const lessonOutlineIndex = learningCycleNumber - 1;
      learningCycleVideosTitleMap[learningCycle] =
        lessonOutlines?.[lessonOutlineIndex]?.lessonOutline;
    }
  });

  return learningCycleVideosTitleMap;
};
