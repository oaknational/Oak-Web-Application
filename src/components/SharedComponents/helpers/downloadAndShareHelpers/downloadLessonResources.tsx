import { createLessonDownloadLink } from "./createDownloadLink";
import createAndClickHiddenDownloadLink from "./createAndClickHiddenDownloadLink";

import type { DownloadResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";

const downloadLessonResources = async ({
  lessonSlug,
  selectedResourceTypes,
  selectedAdditionalFilesIds,
  isLegacyDownload,
  authFlagEnabled,
  authToken,
}: {
  lessonSlug: string;
  selectedResourceTypes: (DownloadResourceType | "worksheet-pdf-questions")[]; // FIXME: a new solution is required for types which are shared across different journeys . Also should the downloads schemas be added to oak-curriculum schema?
  selectedAdditionalFilesIds?: number[];
  isLegacyDownload: boolean;
  authFlagEnabled?: boolean;
  authToken?: string | null;
}) => {
  if (selectedResourceTypes?.length === 0) {
    console.log("no resources to download");
    return;
  }

  const selection = selectedResourceTypes.join(",");
  const additionalFilesIdsSelection = selectedAdditionalFilesIds?.join(",");

  const downloadResourcesLink = await createLessonDownloadLink({
    lessonSlug,
    selection,
    additionalFilesIdsSelection,
    isLegacyDownload,
    authFlagEnabled,
    authToken,
  });

  if (downloadResourcesLink) {
    createAndClickHiddenDownloadLink(downloadResourcesLink);
  }
};

export default downloadLessonResources;
