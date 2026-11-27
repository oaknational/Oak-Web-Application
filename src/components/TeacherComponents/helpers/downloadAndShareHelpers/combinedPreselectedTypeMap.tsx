import { CombinedPreselectedTypeMap } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { getLessonDownloadTypes } from "@/common-lib/lessonDownloads";

export const combinedPreselectedTypeMap: CombinedPreselectedTypeMap = {
  "slide deck": { downloadType: getLessonDownloadTypes("slide-deck") },
  intro: { downloadType: getLessonDownloadTypes("intro") },
  "cycle-1": { downloadType: getLessonDownloadTypes("cycle-1") },
  "cycle-2": { downloadType: getLessonDownloadTypes("cycle-2") },
  "cycle-3": { downloadType: getLessonDownloadTypes("cycle-3") },
  "cycle-4": { downloadType: getLessonDownloadTypes("cycle-4") },
  "starter quiz": {
    downloadType: getLessonDownloadTypes("starter-quiz"),
    shareType: ["starter-quiz"],
  },
  "exit quiz": {
    downloadType: getLessonDownloadTypes("exit-quiz"),
    shareType: ["exit-quiz"],
  },
  worksheet: {
    downloadType: getLessonDownloadTypes("worksheet"),
  },
  "additional material": {
    downloadType: getLessonDownloadTypes("additional-material"),
  },
  "lesson guide": {
    downloadType: getLessonDownloadTypes("lesson-guide"),
  },
  "additional files": {
    downloadType: getLessonDownloadTypes("additional-files"),
  },
  all: { downloadType: "all", shareType: "all" },
  video: { shareType: ["video"] },
};
