import { useEffect, useState } from "react";

import type {
  ResourcesToDownloadArrayType,
  DownloadResourceType,
} from "../downloads.types";
import getDownloadResourcesExistence from "../helpers/getDownloadResourcesExistence";

type UseDownloadExistenceCheckProps = {
  lessonSlug: string;
  resourcesToCheck: ResourcesToDownloadArrayType;
  onComplete: (existenceResources: ResourcesToDownloadArrayType) => void;
};

const useDownloadExistenceCheck = (props: UseDownloadExistenceCheckProps) => {
  const [hasCheckedFiles, setHasCheckedFiles] = useState(false);
  const { resourcesToCheck, onComplete, lessonSlug } = props;

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
        console.log(error);
        // @todo: add Bugsnag reporting
        // Bugsnag.notify(error);
      }
    })();
  }, [lessonSlug, hasCheckedFiles, resourcesToCheck, onComplete]);
};

export default useDownloadExistenceCheck;
