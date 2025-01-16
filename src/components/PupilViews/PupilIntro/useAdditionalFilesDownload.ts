import { useState } from "react";

import downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";
import errorReporter from "@/common-lib/error-reporter";

type AdditionalFilesDownload = {
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
): AdditionalFilesDownload {
  const [isAdditionalFilesDownloading, setIsAdditionalFilesDownloading] =
    useState(false);
  const startAdditionalFilesDownload = async () => {
    if (isAdditionalFilesDownloading) {
      return;
    }
    setIsAdditionalFilesDownloading(true);

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

    setIsAdditionalFilesDownloading(false);
  };

  return { startAdditionalFilesDownload, isAdditionalFilesDownloading };
}
