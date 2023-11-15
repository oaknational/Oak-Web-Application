import {
  preselectedDownloadType,
  preselectedShareType,
} from "./downloadAndShare.schema";
import {
  CombinedDownloadsShareType,
  CombinedPreselectedTypeMap,
  PreselectedDownloadType,
  PreselectedShareType,
} from "./downloadAndShare.types";

export const isPreselectedDownloadType = (
  preselected: PreselectedDownloadType | PreselectedShareType | null,
): preselected is PreselectedDownloadType => {
  return preselectedDownloadType.safeParse(preselected).success;
};

export const isPreselectedShareType = (
  preselected: PreselectedDownloadType | PreselectedShareType | null,
): preselected is PreselectedShareType => {
  return preselectedShareType.safeParse(preselected).success;
};

export const containerTitleToPreselectMap: CombinedDownloadsShareType = {
  "Slide deck": { downloadType: "slide deck", shareType: null },
  "Exit quiz": { downloadType: "exit quiz", shareType: "exit quiz" },
  "Starter quiz": { downloadType: "starter quiz", shareType: "starter quiz" },
  "Lesson overview": { downloadType: null, shareType: null },
  "Lesson details": { downloadType: null, shareType: null },
  "Additional material": {
    downloadType: "additional material",
    shareType: null,
  },
  Worksheet: { downloadType: "worksheet", shareType: "worksheet" },
  Transcript: { downloadType: null, shareType: null },
  Video: { downloadType: null, shareType: "video" },
};

export const combinedPreselectedTypeMap: CombinedPreselectedTypeMap = {
  "slide deck": { downloadType: ["presentation"] },
  "starter quiz": {
    downloadType: ["intro-quiz-questions", "intro-quiz-answers"],
    shareType: ["intro-quiz-questions"],
  },
  "exit quiz": {
    downloadType: ["exit-quiz-questions", "exit-quiz-answers"],
    shareType: ["exit-quiz-questions"],
  },
  worksheet: {
    downloadType: ["worksheet-pdf", "worksheet-pptx"],
    shareType: ["worksheet-pdf"],
  },
  "additional material": {
    downloadType: ["supplementary-pdf", "supplementary-docx"],
  },
  all: { downloadType: "all", shareType: "all" },
  video: { shareType: ["video"] },
};
