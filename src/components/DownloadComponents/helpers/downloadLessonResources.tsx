import type { ResourcesToDownloadArrayType } from "../downloads.types";

import createAndClickHiddenDownloadLink from "./createAndClickHiddenDownloadLink";
import createDownloadResourcesLink from "./createDownloadResourcesLink";

import { ViewType } from "@/common-lib/urls";

const downloadLessonResources = async (
  lessonSlug: string,
  selectedResourceTypes: ResourcesToDownloadArrayType,
  viewType: ViewType
) => {
  if (selectedResourceTypes?.length === 0) {
    console.log("no resources to download");
    return;
  }

  const selection = selectedResourceTypes.join(",");

  const downloadResourcesLink = await createDownloadResourcesLink(
    lessonSlug,
    selection,
    viewType
  );

  if (downloadResourcesLink) {
    createAndClickHiddenDownloadLink(downloadResourcesLink);
  }

  return;
};

export default downloadLessonResources;
