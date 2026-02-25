import { createLessonDownloadLink } from "./createDownloadLink";
import createAndClickHiddenDownloadLink, {
  isInIframe,
} from "./createAndClickHiddenDownloadLink";

import type { DownloadResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";

function buildClassroomDownloadPageUrl({
  lessonSlug,
  selection,
  additionalFilesIdsSelection,
}: {
  lessonSlug: string;
  selection: string;
  additionalFilesIdsSelection?: string;
}): string {
  const params = new URLSearchParams();
  params.set("selection", selection);
  if (additionalFilesIdsSelection) {
    params.set("additionalFiles", additionalFilesIdsSelection);
  }
  return `/classroom/download/${lessonSlug}?${params.toString()}`;
}

const downloadLessonResources = async ({
  lessonSlug,
  selectedResourceTypes,
  selectedAdditionalFilesIds,
  isLegacyDownload,
  authToken,
}: {
  lessonSlug: string;
  selectedResourceTypes: (DownloadResourceType | "worksheet-pdf-questions")[]; // FIXME: a new solution is required for types which are shared across different journeys . Also should the downloads schemas be added to oak-curriculum schema?
  selectedAdditionalFilesIds?: number[];
  isLegacyDownload: boolean;
  authToken?: string | null;
}) => {
  if (selectedResourceTypes?.length === 0) {
    console.log("no resources to download");
    return;
  }

  const selection = selectedResourceTypes.join(",");
  const additionalFilesIdsSelection = selectedAdditionalFilesIds?.join(",");

  if (isInIframe()) {
    const downloadPageUrl = buildClassroomDownloadPageUrl({
      lessonSlug,
      selection,
      additionalFilesIdsSelection,
    });
    globalThis.open(downloadPageUrl, "_blank");
    return;
  }

  const downloadResourcesLink = await createLessonDownloadLink({
    lessonSlug,
    selection,
    additionalFilesIdsSelection,
    isLegacyDownload,
    authToken,
  });

  if (downloadResourcesLink) {
    createAndClickHiddenDownloadLink(downloadResourcesLink);
  }
};

export default downloadLessonResources;
