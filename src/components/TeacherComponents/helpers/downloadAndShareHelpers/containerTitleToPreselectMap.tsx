import { CombinedDownloadsShareType } from "@/components/TeacherComponents/types/downloadAndShare.types";

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
