/**
 * @fileoverview
 * Handler for lesson ZIP downloads.
 * Creates ZIP files from selected resources and caches them in GCS.
 */

import { Readable } from "stream";

import OakError from "@/errors/OakError";
import type {
  GCSHelpers,
  ZipHelpers,
  FileForZip,
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
};

export type DownloadResult = {
  url: string;
  invalidResources: string[];
};

/**
 * Converts a ValidResource into a FileForZip with a stream getter
 */
function resourceToFileForZip(
  resource: ValidResource,
  gcsHelpers: GCSHelpers,
): FileForZip {
  return {
    gcsFilePath: resource.gcsFilePath,
    pathInZip: resource.pathInZip,
    resourceType: resource.type,
    getFileReadStream: async (): Promise<Readable> => {
      const stream = await gcsHelpers.fetchResourceFromGCS(resource);
      return Readable.fromWeb(stream);
    },
  };
}

export default async function downloadHandler(
  params: DownloadParams,
  deps: DownloadDependencies,
): Promise<DownloadResult> {
  const { gcsHelpers, zipHelpers, gcsBucketNameForZips } = deps;
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
    throw new OakError({
      code: "downloads/resource-not-found",
      meta: { lessonSlug },
    });
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
      throw new OakError({
        code: "downloads/no-valid-resources",
        meta: {
          lessonSlug,
          selection,
          hint: "Specify additional files to download with &additionalFiles=[assetid],[anotherAssetId] parameter in the url or verify whether requested files belong to the lesson",
        },
      });
    }

    throw new OakError({
      code: "downloads/no-valid-resources",
      meta: { lessonSlug, selection },
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
    throw new OakError({
      code: "downloads/missing-timestamp",
      meta: { lessonSlug },
    });
  }

  // Generate deterministic ZIP filename
  const zipFileName = getHashedZipName({
    slug: lessonSlug,
    selection: [...selection],
    assetsUpdatedAt,
  });

  const zipFilePath = zipHelpers.getZipFilePath({ fileName: zipFileName });

  // Convert valid resources to FileForZip objects
  const fileList: FileForZip[] = validResources.map((resource) =>
    resourceToFileForZip(resource, gcsHelpers),
  );

  // Get or create the ZIP file and return signed URL
  const url = await zipHelpers.getOrCreateZip({
    zipFilePath,
    fileList,
    zipFileWriteStream: gcsHelpers.getFileWriteStream({
      gcsFilePath: zipFilePath,
      gcsBucketName: gcsBucketNameForZips,
    }),
    checkIfZipFileExists: (path: string) =>
      gcsHelpers.checkFileExistsInBucket({
        gcsFilePath: path,
        gcsBucketName: gcsBucketNameForZips,
      }),
    getSignedUrlForZip: (path: string) =>
      gcsHelpers.getSignedUrl({
        gcsFilePath: path,
        gcsBucketName: gcsBucketNameForZips,
        shouldProxy: true,
      }),
  });

  return { url, invalidResources: invalidResourceTypes };
}
