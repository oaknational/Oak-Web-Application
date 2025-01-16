import { useState } from "react";

import downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";
import errorReporter from "@/common-lib/error-reporter";

type AdditionalFIlesDownload = {
  startAdditionalFilesDownload: () => Promise<void>;
  isAdditionalFilesDownloading: boolean;
};

const reportError = errorReporter("useAdditionalFilesDownload");

/**
 * Allows the additional files for a lesson to be downloaded.
 *
 * NOTE: because additional files hasnt been added to curriculum-downloads-api yet, we are using the worksheet-pdf-questions as a placeholder
 */
export function useAdditionalFilesDownload(
  lessonSlug: string,
): AdditionalFIlesDownload {
  const [isAdditionalFilesDownloading, setIsDownloading] = useState(false);
  const startAdditionalFilesDownload = async () => {
    if (isAdditionalFilesDownloading) {
      return;
    }
    setIsDownloading(true);

    try {
      await downloadLessonResources(
        lessonSlug,
        ["worksheet-pdf-questions"],
        false,
      );
    } catch (error) {
      window.alert("Whoops, the download failed. You could try again.");
      reportError(error);
    }

    setIsDownloading(false);
  };

  return { startAdditionalFilesDownload, isAdditionalFilesDownloading };
}
