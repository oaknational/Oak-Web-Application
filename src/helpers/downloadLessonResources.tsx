import createAndClickHiddenDownloadLink from "./createAndClickHiddenDownloadLink";
import checkIfDownloadResourcesExist from "./checkIfDownloadResourcesExist";

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

  if (!process.env.VERCEL_API_URL) {
    throw new TypeError("process.env.VERCEL_API_URL must be defined");
  }

  const downloadEnpoint = `${process.env.VERCEL_API_URL}/api/downloads/lesson/${lessonSlug}?selection=${selection}`;

  const downloadResourcesExist = await checkIfDownloadResourcesExist(
    lessonSlug,
    selection
  );
  const res = downloadResourcesExist && (await fetch(downloadEnpoint));
  const { data, error } = await res.json();

  if (!res.ok && error) {
    throw new Error(error);
  } else if (!res.ok) {
    throw new Error("API error");
  }

  createAndClickHiddenDownloadLink(data.url);
  return data;
};

export default downloadLessonResources;
