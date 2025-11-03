import { useState, useEffect } from "react";

import { getWorksheetInfo } from "./getWorksheetInfo";

import { WorksheetInfo } from "@/components/PupilViews/PupilIntro";

export const useWorksheetInfoState = (
  hasWorksheetAssetObject: boolean | null,
  lessonSlug: string,
) => {
  const [worksheetInfo, setWorksheetInfo] = useState<WorksheetInfo | null>(
    null,
  );

  const populateWorksheetInfo = async (lessonSlug: string) => {
    const worksheetInfo = (await getWorksheetInfo(lessonSlug)) || [];
    setWorksheetInfo(worksheetInfo);
  };

  useEffect(() => {
    if (hasWorksheetAssetObject) {
      populateWorksheetInfo(lessonSlug);
    }
  }, [hasWorksheetAssetObject, lessonSlug]);

  return {
    worksheetInfo,
  };
};
