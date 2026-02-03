/**
 * @fileoverview
 * Handler for single asset downloads. Returns signed URL and metadata.
 */

import { z } from "zod";

import OakError from "@/errors/OakError";
import type {
  GCSHelpers,
  SingleFileResourceOption,
} from "@/node-lib/curriculum-resources-downloads";
import type { LessonAssets } from "@/node-lib/curriculum-api-2023/queries/curriculumResourcesDownloads/lessonAssets.schema";
import type { AdditionalAsset } from "@/node-lib/curriculum-api-2023/queries/curriculumResourcesDownloads/additionalAssets.schema";
import {
  SINGLE_FILE_SELECTION_MAP,
  getResourceHelpers,
} from "@/node-lib/curriculum-resources-downloads";

export type AssetParams = {
  lesson: LessonAssets;
  resource: SingleFileResourceOption;
  additionalAsset: AdditionalAsset | null;
};

export type AssetDependencies = {
  gcsHelpers: GCSHelpers;
};

export type AssetResult = {
  url: string;
  filename: string;
  fileSize: string;
  contentType: string;
};

// Currently to be utilised when writing pdfs to google drive on the classroom
const EXTENSION_TO_CONTENT_TYPE: Record<string, string> = {
  pdf: "application/pdf",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

function getContentTypeForExtension(ext: string): string {
  return (
    EXTENSION_TO_CONTENT_TYPE[ext.toLowerCase()] || "application/octet-stream"
  );
}

export default async function assetHandler(
  params: AssetParams,
  deps: AssetDependencies,
): Promise<AssetResult> {
  const { gcsHelpers } = deps;
  const { lesson, resource, additionalAsset } = params;

  let gcsFilePath: string;
  let gcsBucketName: string;
  let filename: string;
  let ext: string;

  if (resource === "additional-files") {
    // Handle additional files
    if (!additionalAsset) {
      throw new OakError({
        code: "downloads/additional-file-not-found",
        meta: { lessonSlug: lesson.slug, resource },
      });
    }

    // Validate additional file belongs to lesson
    const belongsToLesson = lesson.tpc_downloadablefiles?.some(
      (file) => file.asset_id === additionalAsset.asset_id,
    );
    if (!belongsToLesson) {
      throw new OakError({
        code: "downloads/additional-file-not-found",
        meta: {
          lessonSlug: lesson.slug,
          assetId: additionalAsset.asset_id,
          reason: "Additional file does not belong to this lesson",
        },
      });
    }

    // Extract file info from additional asset
    const assetType = Object.keys(additionalAsset.asset_object)[0];
    if (!assetType) {
      throw new OakError({
        code: "downloads/additional-file-invalid",
        meta: {
          lessonSlug: lesson.slug,
          assetId: additionalAsset.asset_id,
          reason: "Additional file has no valid file type",
        },
      });
    }
    const fileLocation = additionalAsset.asset_object[assetType];

    if (!fileLocation?.bucket_path || !fileLocation?.bucket_name) {
      throw new OakError({
        code: "downloads/additional-file-invalid",
        meta: {
          lessonSlug: lesson.slug,
          assetId: additionalAsset.asset_id,
          reason: "Additional file has no valid file location",
        },
      });
    }

    gcsFilePath = fileLocation.bucket_path;
    gcsBucketName = fileLocation.bucket_name;
    ext = assetType ?? "bin";
    filename = additionalAsset.title
      ? `${additionalAsset.title}.${ext}`
      : `${additionalAsset.asset_id}.${ext}`;
  } else {
    // Handle standard resources
    const { getResourceInfoByFileType, getAvailableResourceOptions } =
      getResourceHelpers();

    // Check if resource is available for this lesson
    const availableOptions = getAvailableResourceOptions(lesson);

    if (!availableOptions.includes(resource)) {
      throw new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          message: `Resource '${resource}' is not available for this lesson`,
          path: ["resource"],
        },
      ]);
    }

    // Get resource info from the selection map
    const selectionInfo = SINGLE_FILE_SELECTION_MAP[resource];
    const resourceInfo = getResourceInfoByFileType(
      lesson,
      selectionInfo.fileType,
    );

    if (!resourceInfo) {
      throw new OakError({
        code: "downloads/resource-not-found",
        meta: { lessonSlug: lesson.slug, resource },
      });
    }

    if (!resourceInfo.isPublished) {
      throw new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          message: `Resource '${resource}' is not available for this lesson`,
          path: ["resource"],
        },
      ]);
    }

    if (!resourceInfo.gcsFilePath || !resourceInfo.gcsBucketName) {
      throw new OakError({
        code: "downloads/file-not-found",
        meta: { lessonSlug: lesson.slug, resource },
      });
    }

    gcsFilePath = resourceInfo.gcsFilePath;
    gcsBucketName = resourceInfo.gcsBucketName;
    filename = selectionInfo.filename;
    ext = selectionInfo.ext;
  }

  // Check file exists and get size in a single GCS call
  const { exists, fileSize: size } = await gcsHelpers.checkFileExistsAndGetSize(
    {
      gcsFilePath,
      gcsBucketName,
    },
  );

  if (!exists) {
    console.error(`File not found in GCS for lesson ${lesson.slug}`, {
      resource,
      gcsFilePath,
      gcsBucketName,
    });
    throw new OakError({
      code: "downloads/file-not-found",
      meta: { lessonSlug: lesson.slug, resource, gcsFilePath },
    });
  }

  const fileSize = size || "Unknown";

  // Generate signed URL - not proxied as asset was not downladable
  const url = await gcsHelpers.getSignedUrl({
    gcsFilePath,
    gcsBucketName,
    shouldProxy: false,
  });

  // Determine content type
  const contentType = getContentTypeForExtension(ext);

  return {
    url,
    filename,
    fileSize,
    contentType,
  };
}
