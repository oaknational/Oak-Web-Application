import type { ResourcesToDownloadArrayType } from "../downloads.types";

import createAndClickHiddenDownloadLink from "./createAndClickHiddenDownloadLink";
import createDownloadResourcesLink from "./createDownloadResourcesLink";

const downloadLessonResources = async (
  lessonSlug: string,
  selectedResourceTypes: ResourcesToDownloadArrayType,
  isLegacyDownload: boolean,
) => {
  if (selectedResourceTypes?.length === 0) {
    console.log("no resources to download");
    return;
  }

  const selection = selectedResourceTypes.join(",");

  const downloadResourcesLink = await createDownloadResourcesLink(
    lessonSlug,
    selection,
    isLegacyDownload,
  );

  if (downloadResourcesLink) {
    createAndClickHiddenDownloadLink(downloadResourcesLink);
  }

  return;
};

export default downloadLessonResources;
