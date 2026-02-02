/**
 * @fileoverview
 * Handler for checking file existence for lesson resources.
 * Returns existence status and file metadata for each selected resource.
 */

import { notFound } from "@hapi/boom";

import type {
  GCSHelpers,
  ResourceSelectionOptionsType,
  ResourceSelectionOption,
} from "@/node-lib/curriculum-resources-downloads";
import {
  getResourceHelpers,
  SELECTION_TO_FILES_MAP,
  validateSelection,
} from "@/node-lib/curriculum-resources-downloads";
import type { LessonAssets } from "@/node-lib/curriculum-api-2023/queries/curriculumResourcesDownloads/lessonAssets.schema";
import type { AdditionalAsset } from "@/node-lib/curriculum-api-2023/queries/curriculumResourcesDownloads/additionalAssets.schema";

export type CheckFilesParams = {
  lesson: LessonAssets;
  selection: ResourceSelectionOptionsType;
  additionalFiles: string[] | undefined;
  additionalFilesAssets: AdditionalAsset[];
};

export type CheckFilesDependencies = {
  gcsHelpers: GCSHelpers;
};

type ResourceCheckResult = {
  exists: boolean;
  errors?: { message: string; resourceType?: string }[];
  fileSize?: string;
  ext?: string;
};

export type CheckFilesResult = [ResourceSelectionOption, ResourceCheckResult][];

export default async function checkFilesHandler(
  params: CheckFilesParams,
  deps: CheckFilesDependencies,
): Promise<CheckFilesResult> {
  const { gcsHelpers } = deps;
  const { lesson, selection, additionalFiles, additionalFilesAssets } = params;
  if (!lesson) {
    throw notFound("Lesson not found");
  }

  const resourceHelpers = getResourceHelpers();

  const availableSelectionOptions =
    resourceHelpers.getAvailableResourceSelectionOptions({
      lesson,
      additionalFiles,
    });

  // Throw Zod error if selection includes unavailable options
  validateSelection({ selection, availableSelectionOptions });

  // Get list of resources for selected options
  const selectedResourceList = resourceHelpers.getSelectedResourceList({
    lesson,
    selection,
    additionalFilesAssets,
  });

  // Check file existence and get file sizes
  const withFileExistence = await Promise.all(
    selectedResourceList.map(async (resource) => {
      if (!resource.gcsFilePath || !resource.gcsBucketName) {
        return {
          ...resource,
          exists: false,
        };
      }
      const exists = await gcsHelpers.checkFileExistsInBucket({
        gcsFilePath: resource.gcsFilePath,
        gcsBucketName: resource.gcsBucketName,
      });
      const fileSize = await gcsHelpers.getFileSize({
        gcsFilePath: resource.gcsFilePath,
        gcsBucketName: resource.gcsBucketName,
      });
      return {
        ...resource,
        exists,
        fileSize,
      };
    }),
  );

  // Log errors for resources with issues
  selectedResourceList.forEach((resource) => {
    if (resource.errors.length > 0) {
      console.warn(
        `Issue found with resource ${resource.type} while checking files for lesson ${lesson.slug}`,
        resource,
      );
    }
  });

  // Map selection options to their check results
  return selection.map((option) => {
    const resources = withFileExistence.filter((r) =>
      SELECTION_TO_FILES_MAP[option].includes(r.type),
    );

    const noResourcesAreValid = resources.every((r) => !r.isValid);
    const errors = resources
      .map((r) =>
        r.errors.map((error) => ({
          message: error.message,
          resourceType: r.type,
        })),
      )
      .flat();

    if (noResourcesAreValid) {
      return [option, { exists: false, errors }];
    }

    return [
      option,
      {
        exists: true,
        errors,
        fileSize: resources[0]?.fileSize ?? undefined,
        ext: resources[0]?.ext,
      },
    ];
  });
}
