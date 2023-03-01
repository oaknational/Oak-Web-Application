import { useEffect, useState } from "react";

import type { ResourcesToDownloadType } from "../downloads.types";
import getDownloadResourcesExistence from "../helpers/getDownloadResourcesExistence";

type UseDownloadExistenceCheckProps = {
  lessonSlug: string;
  resourcesToCheck: ResourcesToDownloadType;
  onComplete: (existenceResources: ResourcesToDownloadType) => void;
};

const useDownloadExistenceCheck = (props: UseDownloadExistenceCheckProps) => {
  const [hasCheckedFiles, setHasCheckedFiles] = useState(false);
  const { resourcesToCheck, onComplete, lessonSlug } = props;

  useEffect(() => {
    // check if lesson download resources exist and if not update the state
    const resourceTypesAsString = Object.keys(resourcesToCheck).join(",");

    (async () => {
      if (hasCheckedFiles) {
        return;
      }
      setHasCheckedFiles(true);
      try {
        const { resources: resourceExistence } =
          await getDownloadResourcesExistence(
            lessonSlug,
            resourceTypesAsString
          );

        const resourcesExistenceAsArray = resourceExistence
          ? Object.entries(resourceExistence as ResourcesToDownloadType)
          : [];

        const filteredResourcesExistenceAsArray = resourcesExistenceAsArray
          .filter(([, value]) => value === true)
          .map(([key]) => [key, false]);

        const filteredResourcesExistence = Object.fromEntries(
          filteredResourcesExistenceAsArray
        );

        onComplete(filteredResourcesExistence as ResourcesToDownloadType);
      } catch (error) {
        console.log(error);
        // @todo: add Bugsnag reporting
        // Bugsnag.notify(error);
      }
    })();
  }, [lessonSlug, hasCheckedFiles, resourcesToCheck, onComplete]);
};

export default useDownloadExistenceCheck;
