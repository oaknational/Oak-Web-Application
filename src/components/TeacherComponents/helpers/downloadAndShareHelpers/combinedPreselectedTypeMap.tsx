import { CombinedPreselectedTypeMap } from "@/components/TeacherComponents/types/downloadAndShare.types";

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
  // "additional file": { downloadType: ["additional-file"] },
  all: { downloadType: "all", shareType: "all" },
  video: { shareType: ["video"] },
};
