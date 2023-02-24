import createAndClickHiddenDownloadLink from "./createAndClickHiddenDownloadLink";
import createDownloadResourcesLink from "./createDownloadResourcesLink";

type ResourceTypes = {
  [key: string]: boolean;
};

const downloadLessonResources = async (
  lessonSlug: string,
  resourceTypes: ResourceTypes
) => {
  if (Object.keys(resourceTypes)?.length === 0) {
    console.log("no resources to download");
    return;
  }

  const resourceTypesAsArray = Object.entries(resourceTypes);
  const selectedResourceTypesAsArray = resourceTypesAsArray
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  const selection = selectedResourceTypesAsArray.join(",");

  const downloadResourcesLink = await createDownloadResourcesLink(
    lessonSlug,
    selection
  );

  if (downloadResourcesLink) {
    createAndClickHiddenDownloadLink(downloadResourcesLink);
  }

  return;
};

export default downloadLessonResources;
