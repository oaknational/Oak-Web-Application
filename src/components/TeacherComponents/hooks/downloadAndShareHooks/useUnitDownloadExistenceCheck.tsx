import { useEffect, useState } from "react";

import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter";
import { getUnitDownloadFileExistence } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";

const reportError = errorReporter("useDownloadExistenceCheck");

const useUnitDownloadExistenceCheck = (unitProgrammeSlug: string) => {
  const [hasCheckedFiles, setHasCheckedFiles] = useState(false);
  const [exists, setExists] = useState<boolean | undefined>(undefined);
  const [fileSize, setFileSize] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (hasCheckedFiles) {
        return;
      }
      setHasCheckedFiles(true);
      try {
        const { exists, fileSize } =
          await getUnitDownloadFileExistence(unitProgrammeSlug);

        setExists(exists);
        setFileSize(fileSize);
      } catch (error) {
        const oakError = new OakError({
          code: "downloads/failed-to-fetch",
          originalError: error,
        });
        reportError(oakError);
      }
    })();
  }, [unitProgrammeSlug, hasCheckedFiles]);

  return {
    exists,
    fileSize,
    hasCheckedFiles,
  };
};

export default useUnitDownloadExistenceCheck;
