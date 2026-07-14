import { IntroResult } from "@/context/PupilLessonProgress";

export const getIntroWorksheetInitResult = ({
  worksheetDownloaded,
  hasWorksheet,
}: {
  worksheetDownloaded?: boolean;
  hasWorksheet: boolean;
}): IntroResult => ({
  worksheetDownloaded: worksheetDownloaded || false,
  worksheetAvailable: hasWorksheet,
});
