import { useEffect, useState } from "react";

import type {
  ResourcesToDownloadArrayType,
  DownloadResourceType,
} from "../downloads.types";
import getDownloadResourcesExistence from "../helpers/getDownloadResourcesExistence";

import { ViewType } from "@/common-lib/urls";
import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter";

const reportError = errorReporter("useDownloadExistenceCheck");

type UseDownloadExistenceCheckProps = {
  lessonSlug: string;
  resourcesToCheck: ResourcesToDownloadArrayType;
  onComplete: (existenceResources: ResourcesToDownloadArrayType) => void;
  viewType: ViewType;
};

const useDownloadExistenceCheck = (props: UseDownloadExistenceCheckProps) => {
  const [hasCheckedFiles, setHasCheckedFiles] = useState(false);
  const { resourcesToCheck, onComplete, lessonSlug, viewType } = props;

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
            viewType,
          );

        const resourcesExistenceAsArray = resourceExistence
          ? Object.entries(
              resourceExistence as Partial<
                Record<DownloadResourceType, boolean>
              >,
            )
          : [];

        const filteredResourcesExistenceAsArray = resourcesExistenceAsArray
          .map(([key, value]) => {
            if (value === true) return key;
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
  }, [lessonSlug, hasCheckedFiles, resourcesToCheck, onComplete, viewType]);
};

export default useDownloadExistenceCheck;
