import { useState } from "react";

import downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";
import errorReporter from "@/common-lib/error-reporter";

type WorksheetDownload = {
  startDownload: () => Promise<void>;
  isDownloading: boolean;
};

const reportError = errorReporter("useWorksheetDownload");

/**
 * Allows the worksheet for a lesson to be downloaded.
 */
export function useWorksheetDownload(
  lessonSlug: string,
  isLegacyDownload: boolean,
): WorksheetDownload {
  const [isDownloading, setIsDownloading] = useState(false);
  const startDownload = async () => {
    if (isDownloading) {
      return;
    }
    setIsDownloading(true);

    try {
      await downloadLessonResources({
        lessonSlug,
        selectedResourceTypes: ["worksheet-pdf-questions"],
        isLegacyDownload,
      });
    } catch (error) {
      window.alert("Whoops, the download failed. You could try again.");
      reportError(error);
    }

    setIsDownloading(false);
  };

  return { startDownload, isDownloading };
}
