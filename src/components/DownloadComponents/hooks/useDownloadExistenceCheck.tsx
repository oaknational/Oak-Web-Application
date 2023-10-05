import { useEffect, useState } from "react";

import type {
  ResourcesToDownloadArrayType,
  DownloadResourceType,
} from "../downloads.types";
import getDownloadResourcesExistence from "../helpers/getDownloadResourcesExistence";

import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter";

const reportError = errorReporter("useDownloadExistenceCheck");

type UseDownloadExistenceCheckProps = {
  lessonSlug: string;
  resourcesToCheck: ResourcesToDownloadArrayType;
  onComplete: (existenceResources: ResourcesToDownloadArrayType) => void;
  isLegacyDownload: boolean;
};

const useDownloadExistenceCheck = (props: UseDownloadExistenceCheckProps) => {
  const [hasCheckedFiles, setHasCheckedFiles] = useState(false);
  const { resourcesToCheck, onComplete, lessonSlug, isLegacyDownload } = props;

  useEffect(() => {
    // check if lesson download resources exist and if not update the state
    const resourceTypesAsString = resourcesToCheck.join(",");

    (async () => {
      if (hasCheckedFiles) {
        return;
      }
      setHasCheckedFiles(true);
      try {
        const { resources: resourceExistence } =
          await getDownloadResourcesExistence(
            lessonSlug,
            resourceTypesAsString,
            isLegacyDownload,
          );

        const resourcesExistenceAsArray: {
          item: DownloadResourceType;
          exists: boolean;
        }[] = resourceExistence.map((r: unknown[]) => {
          const k = r[0] as DownloadResourceType;
          const v = r[1] as Record<string, unknown>;
          return {
            item: k,
            exists: v.exists as boolean,
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
    onComplete,
    isLegacyDownload,
  ]);
};

export default useDownloadExistenceCheck;
