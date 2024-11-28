import createDownloadResourcesLink from "./createDownloadResourcesLink";
import createAndClickHiddenDownloadLink from "./createAndClickHiddenDownloadLink";

import type { DownloadResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";

const downloadLessonResources = async (
  lessonSlug: string,
  selectedResourceTypes: (DownloadResourceType | "worksheet-pdf-questions")[], // FIXME: a new solution is required for types which are shared across different journeys . Also should the downloads schemas be added to oak-curriculum schema?
  isLegacyDownload: boolean,
  authFlagEnabled?: boolean,
  authToken?: string | null,
) => {
  if (selectedResourceTypes?.length === 0) {
    console.log("no resources to download");
    return;
  }

  const selection = selectedResourceTypes.join(",");

  const downloadResourcesLink = await createDownloadResourcesLink({
    downloadSlug: lessonSlug,
    selection,
    isLegacyDownload,
    authFlagEnabled,
    authToken,
  });

  if (downloadResourcesLink) {
    createAndClickHiddenDownloadLink(downloadResourcesLink);
  }
};

export default downloadLessonResources;
