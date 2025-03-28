import { useEffect, useState } from "react";

import type { ResourcesToDownloadArrayType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { getLessonDownloadResourcesExistence } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter";

const reportError = errorReporter("useDownloadExistenceCheck");

type UseDownloadExistenceCheckProps = {
  lessonSlug: string;
  resourcesToCheck: ResourcesToDownloadArrayType;
  additionalFilesIdsToCheck: number[] | null;
  onComplete: (existenceResources: ResourcesToDownloadArrayType) => void;
  isLegacyDownload: boolean;
};

const useLessonDownloadExistenceCheck = (
  props: UseDownloadExistenceCheckProps,
) => {
  const [hasCheckedFiles, setHasCheckedFiles] = useState(false);
  const {
    resourcesToCheck,
    additionalFilesIdsToCheck,
    onComplete,
    lessonSlug,
    isLegacyDownload,
  } = props;

  useEffect(() => {
    // check if lesson download resources exist and if not update the state
    const resourceTypesAsString = resourcesToCheck.join(",");
    const additionalFilesIdsAsString = additionalFilesIdsToCheck?.join(",");

    (async () => {
      if (hasCheckedFiles) {
        return;
      }
      setHasCheckedFiles(true);
      try {
        const { resources: resourceExistence } =
          await getLessonDownloadResourcesExistence({
            lessonSlug,
            resourceTypesString: resourceTypesAsString,
            additionalFilesIdsString: additionalFilesIdsAsString,
            isLegacyDownload,
          });

        const resourcesExistenceAsArray: {
          item: string;
          exists: boolean;
        }[] = resourceExistence.map((r) => {
          const [k, v] = r;
          return {
            item: k,
            exists: v.exists,
          };
        });

        const filteredResourcesExistenceAsArray = resourcesExistenceAsArray
          .map((r) => {
            if (r.exists) return r.item;
          })
          .filter((resource) => resource !== undefined);

        onComplete(
          filteredResourcesExistenceAsArray as ResourcesToDownloadArrayType,
        );
      } catch (error) {
        const oakError = new OakError({
          code: "downloads/failed-to-fetch",
          originalError: error,
        });
        reportError(oakError);
      }
    })();
  }, [
    lessonSlug,
    hasCheckedFiles,
    resourcesToCheck,
    additionalFilesIdsToCheck,
    onComplete,
    isLegacyDownload,
  ]);
};

export default useLessonDownloadExistenceCheck;
