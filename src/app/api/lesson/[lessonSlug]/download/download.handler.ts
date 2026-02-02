/**
 * @fileoverview
 * Handler for lesson ZIP downloads.
 * Creates ZIP files from selected resources and caches them in GCS.
 */

import { notFound } from "@hapi/boom";

import type {
  GCSHelpers,
  ZipHelpers,
  ZipFile,
  ResourceSelectionOptionsType,
  ValidResource,
} from "@/node-lib/curriculum-resources-downloads";
import type { LessonAssets } from "@/node-lib/curriculum-api-2023/queries/curriculumResourcesDownloads/lessonAssets.schema";
import type { AdditionalAsset } from "@/node-lib/curriculum-api-2023/queries/curriculumResourcesDownloads/additionalAssets.schema";
import {
  getResourceHelpers,
  getHashedZipName,
  validateSelection,
} from "@/node-lib/curriculum-resources-downloads";

export type DownloadParams = {
  lesson: LessonAssets;
  selection: ResourceSelectionOptionsType;
  additionalFilesIds: number[];
  additionalFilesAssets: AdditionalAsset[];
};

export type DownloadDependencies = {
  gcsHelpers: GCSHelpers;
  zipHelpers: ZipHelpers;
  gcsBucketNameForZips: string;
  gcsDirForLessonZips: string;
};

export type DownloadResult = {
  url: string;
  invalidResources: string[];
};

export default async function downloadHandler(
  params: DownloadParams,
  deps: DownloadDependencies,
): Promise<DownloadResult> {
  const { gcsHelpers, zipHelpers, gcsBucketNameForZips, gcsDirForLessonZips } =
    deps;
  const { lesson, selection, additionalFilesIds, additionalFilesAssets } =
    params;
  const lessonSlug = lesson.slug;

  const resourceHelpers = getResourceHelpers();

  // Get available selection options
  const availableSelectionOptions =
    resourceHelpers.getAvailableResourceSelectionOptions({
      lesson,
      additionalFiles: additionalFilesIds.map(String),
    });

  if (availableSelectionOptions.length === 0) {
    throw notFound("No resources found", { lessonSlug });
  }

  validateSelection({ selection, availableSelectionOptions });

  const selectedResourceList = resourceHelpers.getSelectedResourceList({
    lesson,
    selection,
    additionalFilesAssets,
  });

  // Split into valid and invalid resources
  const validResources = selectedResourceList.filter(
    (resource): resource is ValidResource => resource.isValid === true,
  );
  const invalidResourceTypes = selectedResourceList
    .filter((resource) => !resource.isValid)
    .map((r) => r.type);

  // Ensure we have valid resources
  if (validResources.length === 0) {
    if (
      selection.includes("additional-files") &&
      additionalFilesAssets.length === 0
    ) {
      throw notFound(
        "Specify additional files to download with &additionalFiles=[assetid],[anotherAssetId] parameter in the url or if you did verify whether requested files belong to the lesson",
        { lessonSlug, selection },
      );
    }

    throw notFound("No (valid) resources found for selection", {
      lessonSlug,
      selection,
    });
  }

  // Log invalid resources (except worksheet-answers which may legitimately not exist)
  if (invalidResourceTypes.length > 0) {
    const nonWorksheetAnswerInvalid = invalidResourceTypes.filter(
      (type) => !type.startsWith("worksheet-answers"),
    );
    if (nonWorksheetAnswerInvalid.length > 0) {
      console.warn(
        `Some resources could not be downloaded for lesson ${lessonSlug}`,
        { invalidResourceTypes: nonWorksheetAnswerInvalid },
      );
    }
  }

  // Get latest asset timestamp for deterministic filename
  const assetsUpdatedAt = resourceHelpers.getLatestAssetsUpdatedAt(
    lesson,
    additionalFilesAssets,
  );

  if (!assetsUpdatedAt) {
    throw notFound("Could not determine assets updated timestamp", {
      lessonSlug,
    });
  }

  // Generate deterministic ZIP filename
  const zipFileName = getHashedZipName({
    slug: lessonSlug,
    selection: [...selection],
    assetsUpdatedAt,
  });

  const zipFilePath = `${gcsDirForLessonZips}/${zipFileName}`;

  // Check if ZIP already exists in cache
  const zipExists = await gcsHelpers.checkFileExistsInBucket({
    gcsFilePath: zipFilePath,
    gcsBucketName: gcsBucketNameForZips,
  });

  if (zipExists) {
    // Return cached ZIP
    const url = await gcsHelpers.getSignedUrl({
      gcsFilePath: zipFilePath,
      gcsBucketName: gcsBucketNameForZips,
      shouldProxy: true,
    });

    return { url, invalidResources: invalidResourceTypes };
  }

  // Download all files and create ZIP
  const filesForZip: ZipFile[] = await Promise.all(
    validResources.map(async (resource) => {
      const buffer = await gcsHelpers.fetchResourceAsBuffer({
        gcsFilePath: resource.gcsFilePath,
        gcsBucketName: resource.gcsBucketName,
      });

      return {
        pathInZip: resource.pathInZip,
        buffer,
      };
    }),
  );

  // Create ZIP
  const zipBuffer = await zipHelpers.createZipFromFiles(filesForZip);

  // Upload ZIP to GCS
  await gcsHelpers.uploadBuffer({
    gcsFilePath: zipFilePath,
    gcsBucketName: gcsBucketNameForZips,
    buffer: zipBuffer,
    contentType: "application/zip",
  });

  // Return signed URL for the new ZIP
  const url = await gcsHelpers.getSignedUrl({
    gcsFilePath: zipFilePath,
    gcsBucketName: gcsBucketNameForZips,
    shouldProxy: true,
  });

  return { url, invalidResources: invalidResourceTypes };
}
