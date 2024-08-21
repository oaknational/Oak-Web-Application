import createDownloadResourcesLink from "./createDownloadResourcesLink";
import createAndClickHiddenDownloadLink from "./createAndClickHiddenDownloadLink";

import type { ResourcesToDownloadArrayType } from "@/components/TeacherComponents/types/downloadAndShare.types";

const downloadLessonResources = async (
  lessonSlug: string,
  selectedResourceTypes: ResourcesToDownloadArrayType,
  isLegacyDownload: boolean,
  authToken?: string | null,
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
    authToken,
  );

  if (downloadResourcesLink) {
    createAndClickHiddenDownloadLink(downloadResourcesLink);
  }
};

export default downloadLessonResources;
