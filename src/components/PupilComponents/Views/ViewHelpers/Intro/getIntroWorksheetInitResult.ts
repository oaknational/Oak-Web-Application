import { IntroResult } from "@/components/PupilComponents/LessonEngineProvider";

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
