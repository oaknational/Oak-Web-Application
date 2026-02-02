/**
 * @fileoverview
 * Resource helpers for extracting file information from lesson assets.
 * Used by the lesson asset download and check-files endpoints.
 */

import type {
  ResourceDefinition,
  ResourceError,
  ResourceFileType,
  ResourceSelectionOption,
  ResourceSelectionOptionsType,
} from "../types/resource.types";
import { SELECTION_TO_FILES_MAP } from "../types/resource.types";

import type { AdditionalAsset } from "@/node-lib/curriculum-api-2023/queries/curriculumResourcesDownloads/additionalAssets.schema";
import type { LessonAssets } from "@/node-lib/curriculum-api-2023/queries/curriculumResourcesDownloads/lessonAssets.schema";
import truthy from "@/utils/truthy";

/**
 * Validates that a date string can be parsed into a valid Date object
 */
function dateStringIsValid(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.valueOf());
}

/**
 * Represents a validated downloadable resource
 */
export type ValidResource = {
  isPublished: boolean;
  gcsFilePath: string;
  gcsBucketName: string;
  pathInZip: string;
  updatedAt: string;
  ext: string;
  fileSize: string;
  type: ResourceFileType;
  lesson: LessonAssets;
  isValid: true;
  errors: ResourceError[];
};
/**
 * Non-downloadable resource
 */
export type InvalidResource = {
  isPublished: boolean;
  gcsFilePath: string | null | undefined;
  gcsBucketName: string | null | undefined;
  pathInZip: string | null | undefined;
  updatedAt: string | null;
  ext: string;
  fileSize: string;
  type: ResourceFileType;
  lesson: LessonAssets;
  isValid: false | null;
  errors: ResourceError[];
};

export type Resource = ValidResource | InvalidResource;

export function getResourceHelpers() {
  const resourceDefinitions: ResourceDefinition[] = [
    {
      getGCSFilePath: (lesson) =>
        lesson.quiz_starter?.quiz_object?.quiz?.pdf?.bucket_path,
      getGCSBucketName: (lesson) =>
        lesson.quiz_starter?.quiz_object?.quiz?.pdf?.bucket_name,
      getUpdatedAt: (lesson) => lesson.quiz_starter?.updated_at ?? null,
      getIsPublished: (lesson) => Boolean(lesson.quiz_starter),
      getPathInZip: () => `starter-quiz-questions.pdf`,
      ext: "pdf",
      fileSize: "1 MB",
      type: "quiz-starter-questions--pdf",
    },
    {
      getGCSFilePath: (lesson) =>
        lesson.quiz_starter?.quiz_object?.quiz_answers?.pdf?.bucket_path,
      getGCSBucketName: (lesson) =>
        lesson.quiz_starter?.quiz_object?.quiz_answers?.pdf?.bucket_name,
      getUpdatedAt: (lesson) => lesson.quiz_starter?.updated_at ?? null,
      getIsPublished: (lesson) => Boolean(lesson.quiz_starter),
      getPathInZip: () => `starter-quiz-answers.pdf`,
      ext: "pdf",
      fileSize: "1 MB",
      type: "quiz-starter-answers--pdf",
    },
    {
      getGCSFilePath: (lesson) =>
        lesson.quiz_exit?.quiz_object?.quiz?.pdf?.bucket_path,
      getGCSBucketName: (lesson) =>
        lesson.quiz_exit?.quiz_object?.quiz?.pdf?.bucket_name,
      getUpdatedAt: (lesson) => lesson.quiz_exit?.updated_at ?? null,
      getIsPublished: (lesson) => Boolean(lesson.quiz_exit),
      getPathInZip: () => `exit-quiz-questions.pdf`,
      ext: "pdf",
      fileSize: "1 MB",
      type: "quiz-exit-questions--pdf",
    },
    {
      getGCSFilePath: (lesson) =>
        lesson.quiz_exit?.quiz_object?.quiz_answers?.pdf?.bucket_path,
      getGCSBucketName: (lesson) =>
        lesson.quiz_exit?.quiz_object?.quiz_answers?.pdf?.bucket_name,
      getUpdatedAt: (lesson) => lesson.quiz_exit?.updated_at ?? null,
      getIsPublished: (lesson) => Boolean(lesson.quiz_exit),
      getPathInZip: () => `exit-quiz-answers.pdf`,
      ext: "pdf",
      fileSize: "1 MB",
      type: "quiz-exit-answers--pdf",
    },
    {
      getGCSFilePath: (lesson) =>
        lesson.asset_slidedeck?.asset_object?.powerpoint?.bucket_path,
      getGCSBucketName: (lesson) =>
        lesson.asset_slidedeck?.asset_object?.powerpoint?.bucket_name,
      getUpdatedAt: (lesson) => lesson.asset_slidedeck?.updated_at ?? null,
      getIsPublished: (lesson) => Boolean(lesson.asset_slidedeck),
      getPathInZip: () => `slide-deck.pptx`,
      ext: "pptx",
      fileSize: "1 MB",
      type: "slidedeck--pptx",
    },
    {
      getGCSFilePath: (lesson) =>
        lesson.asset_worksheet?.asset_object?.pdf?.bucket_path,
      getGCSBucketName: (lesson) =>
        lesson.asset_worksheet?.asset_object?.pdf?.bucket_name,
      getUpdatedAt: (lesson) => lesson.asset_worksheet?.updated_at ?? null,
      getIsPublished: (lesson) => Boolean(lesson.asset_worksheet),
      getPathInZip: () => `worksheet-questions.pdf`,
      ext: "pdf",
      fileSize: "1 MB",
      type: "worksheet-questions--pdf",
    },
    {
      getGCSFilePath: (lesson) =>
        lesson.asset_worksheet_answers?.asset_object?.pdf?.bucket_path,
      getGCSBucketName: (lesson) =>
        lesson.asset_worksheet_answers?.asset_object?.pdf?.bucket_name,
      getUpdatedAt: (lesson) =>
        lesson.asset_worksheet_answers?.updated_at ?? null,
      getIsPublished: (lesson) => Boolean(lesson.asset_worksheet_answers),
      getPathInZip: () => `worksheet-answers.pdf`,
      ext: "pdf",
      fileSize: "1 MB",
      type: "worksheet-answers--pdf",
    },
    {
      getGCSFilePath: (lesson) =>
        lesson.asset_worksheet?.asset_object?.powerpoint?.bucket_path,
      getGCSBucketName: (lesson) =>
        lesson.asset_worksheet?.asset_object?.powerpoint?.bucket_name,
      getUpdatedAt: (lesson) => lesson.asset_worksheet?.updated_at ?? null,
      getIsPublished: (lesson) => Boolean(lesson.asset_worksheet),
      getPathInZip: () => `worksheet-questions.pptx`,
      ext: "pptx",
      fileSize: "1 MB",
      type: "worksheet-questions--pptx",
    },
    {
      getGCSFilePath: (lesson) =>
        lesson.asset_worksheet_answers?.asset_object?.powerpoint?.bucket_path,
      getGCSBucketName: (lesson) =>
        lesson.asset_worksheet_answers?.asset_object?.powerpoint?.bucket_name,
      getUpdatedAt: (lesson) =>
        lesson.asset_worksheet_answers?.updated_at ?? null,
      getIsPublished: (lesson) => Boolean(lesson.asset_worksheet_answers),
      getPathInZip: () => `worksheet-answers.pptx`,
      ext: "pptx",
      fileSize: "1 MB",
      type: "worksheet-answers--pptx",
    },
    {
      getGCSFilePath: (lesson) =>
        lesson.asset_supplementary_asset?.asset_object?.pdf?.bucket_path,
      getGCSBucketName: (lesson) =>
        lesson.asset_supplementary_asset?.asset_object?.pdf?.bucket_name,
      getUpdatedAt: (lesson) =>
        lesson.asset_supplementary_asset?.updated_at ?? null,
      getIsPublished: (lesson) => Boolean(lesson.asset_supplementary_asset),
      getPathInZip: () => `additional-materials.pdf`,
      ext: "pdf",
      fileSize: "1 MB",
      type: "supplementary-asset--pdf",
    },
    {
      getGCSFilePath: (lesson) =>
        lesson.asset_supplementary_asset?.asset_object?.word?.bucket_path,
      getGCSBucketName: (lesson) =>
        lesson.asset_supplementary_asset?.asset_object?.word?.bucket_name,
      getUpdatedAt: (lesson) =>
        lesson.asset_supplementary_asset?.updated_at ?? null,
      getIsPublished: (lesson) => Boolean(lesson.asset_supplementary_asset),
      getPathInZip: () => `additional-materials.docx`,
      ext: "docx",
      fileSize: "1 MB",
      type: "supplementary-asset--docx",
    },
    {
      getGCSFilePath: (lesson) =>
        lesson.asset_lesson_guide?.asset_object?.pdf?.bucket_path,
      getGCSBucketName: (lesson) =>
        lesson.asset_lesson_guide?.asset_object?.pdf?.bucket_name,
      getUpdatedAt: (lesson) => lesson.asset_lesson_guide?.updated_at ?? null,
      getIsPublished: (lesson) => Boolean(lesson.asset_lesson_guide),
      getPathInZip: () => `lesson-guide.pdf`,
      ext: "pdf",
      fileSize: "1 MB",
      type: "lesson-guide--pdf",
    },
    {
      getGCSFilePath: (lesson) =>
        lesson.asset_lesson_guide?.asset_object?.word?.bucket_path,
      getGCSBucketName: (lesson) =>
        lesson.asset_lesson_guide?.asset_object?.word?.bucket_name,
      getUpdatedAt: (lesson) => lesson.asset_lesson_guide?.updated_at ?? null,
      getIsPublished: (lesson) => Boolean(lesson.asset_lesson_guide),
      getPathInZip: () => `lesson-guide.docx`,
      ext: "docx",
      fileSize: "1 MB",
      type: "lesson-guide--docx",
    },
  ];

  /**
   * Get available resource selection options for a lesson
   */
  function getAvailableResourceOptions(lesson: LessonAssets): string[] {
    const availableOptions: string[] = [];

    // Map resource types to selection options
    const typeToOptionMap: Record<ResourceFileType, string> = {
      "quiz-starter-questions--pdf": "intro-quiz-questions",
      "quiz-starter-answers--pdf": "intro-quiz-answers",
      "quiz-exit-questions--pdf": "exit-quiz-questions",
      "quiz-exit-answers--pdf": "exit-quiz-answers",
      "slidedeck--pptx": "presentation",
      "worksheet-questions--pdf": "worksheet-pdf-questions",
      "worksheet-answers--pdf": "worksheet-pdf-answers",
      "worksheet-questions--pptx": "worksheet-pptx-questions",
      "worksheet-answers--pptx": "worksheet-pptx-answers",
      "supplementary-asset--pdf": "supplementary-pdf",
      "supplementary-asset--docx": "supplementary-docx",
      "lesson-guide--pdf": "lesson-guide-pdf",
      "lesson-guide--docx": "lesson-guide-docx",
      "additional-files": "additional-files",
    };

    for (const resourceDef of resourceDefinitions) {
      if (resourceDef.getIsPublished(lesson)) {
        const option = typeToOptionMap[resourceDef.type];
        if (option && !availableOptions.includes(option)) {
          availableOptions.push(option);
        }
      }
    }

    // Check for additional downloadable files
    if (lesson.tpc_downloadablefiles?.length) {
      availableOptions.push("additional-files");
    }

    return availableOptions;
  }

  /**
   * Get resource info by file type for single-asset downloads.
   * Returns GCS path, bucket, filename and extension for a specific resource.
   */
  function getResourceInfoByFileType(
    lesson: LessonAssets,
    fileType: ResourceFileType,
  ): {
    gcsFilePath: string | null | undefined;
    gcsBucketName: string | null | undefined;
    filename: string;
    ext: string;
    isPublished: boolean;
  } | null {
    const resourceDef = resourceDefinitions.find(
      (def) => def.type === fileType,
    );

    if (!resourceDef) {
      return null;
    }

    return {
      gcsFilePath: resourceDef.getGCSFilePath(lesson),
      gcsBucketName: resourceDef.getGCSBucketName(lesson),
      filename: resourceDef.getPathInZip(),
      ext: resourceDef.ext,
      isPublished: resourceDef.getIsPublished(lesson),
    };
  }

  /**
   * Validates a resource and returns it with validation status
   */
  function validateResource(resource: Resource): Resource {
    const errors: ResourceError[] = [];

    if (!resource.isPublished) {
      return {
        ...resource,
        errors: [],
        isValid: false,
      };
    }

    if (!resource.gcsFilePath) {
      errors.push({ message: "resource has no file path" });
    }
    if (!resource.updatedAt) {
      errors.push({ message: "resource has no updatedAt" });
    } else if (!dateStringIsValid(resource.updatedAt)) {
      errors.push({ message: "resource has invalid updatedAt" });
    }

    if (errors.length > 0) {
      return {
        ...resource,
        errors,
        isValid: false,
      } as InvalidResource;
    }

    return {
      ...resource,
      errors: [],
      isValid: true,
    } as ValidResource;
  }

  /**
   * Creates a Resource from a ResourceDefinition
   */
  function getResourceFromDefinition(
    lesson: LessonAssets,
    resourceDef: ResourceDefinition,
  ): Resource {
    const isPublished = resourceDef.getIsPublished(lesson);
    const gcsFilePath = resourceDef.getGCSFilePath(lesson);
    const gcsBucketName = resourceDef.getGCSBucketName(lesson);
    const updatedAt = resourceDef.getUpdatedAt(lesson);
    if (!isPublished) {
      return {
        lesson,
        isPublished,
        gcsFilePath,
        gcsBucketName,
        updatedAt: updatedAt ?? null,
        pathInZip: resourceDef.getPathInZip(),
        ext: resourceDef.ext,
        type: resourceDef.type,
        fileSize: "1 MB",
        isValid: false,
        errors: [],
      };
    }

    return validateResource({
      lesson,
      isPublished,
      gcsFilePath,
      gcsBucketName,
      pathInZip: resourceDef.getPathInZip(),
      ext: resourceDef.ext,
      type: resourceDef.type,
      updatedAt: updatedAt ?? null,
      isValid: false,
      errors: [],
      fileSize: "1 MB",
    } as Resource);
  }

  /**
   * Creates a Resource from an additional asset
   */
  function getResourceFromAdditionalAsset(
    lesson: LessonAssets,
    asset: AdditionalAsset,
  ): Resource | undefined {
    const assetType =
      asset?.asset_object && Object.keys(asset?.asset_object)[0];

    if (assetType) {
      const fileLocation = asset.asset_object[assetType];
      return validateResource({
        lesson,
        isPublished: true,
        fileSize: "1 MB",
        gcsFilePath: fileLocation?.bucket_path,
        gcsBucketName: fileLocation?.bucket_name,
        pathInZip: asset?.title
          ? `${asset?.title}.${assetType}`
          : `${asset?.asset_id}.${assetType}`,
        ext: assetType,
        type: "additional-files" as ResourceFileType,
        updatedAt: asset?.updated_at ?? null,
        isValid: false,
        errors: [],
      });
    }

    return undefined;
  }

  /**
   * Get available resource selection options for a lesson (for ZIP downloads).
   * Some options are bundled (e.g. worksheet-pdf bundles questions and answers).
   */
  function getAvailableResourceSelectionOptions({
    lesson,
    additionalFiles,
  }: {
    lesson: LessonAssets;
    additionalFiles: string[] | undefined;
  }): ResourceSelectionOption[] {
    const availableResourceSelectionOptions = resourceDefinitions
      .filter((resourceDef) => Boolean(resourceDef.getIsPublished(lesson)))
      .map((resourceDef) =>
        Object.entries(SELECTION_TO_FILES_MAP)
          .filter(([, files]) => {
            return files.includes(resourceDef.type);
          })
          .map(([selection]) => selection as ResourceSelectionOption),
      )
      .flat();

    // Check if additional files passed in the request belong to the lesson
    const additionalFilesBelongToLesson =
      additionalFiles?.every((additionalFileId) =>
        lesson.tpc_downloadablefiles?.some(
          (file) => file.asset_id.toString() === additionalFileId,
        ),
      ) ?? true;

    if (lesson.tpc_downloadablefiles?.length && additionalFilesBelongToLesson) {
      availableResourceSelectionOptions.push("additional-files");
    }

    // Remove duplicates (e.g., worksheet-pdf appears twice for questions and answers)
    return [...new Set(availableResourceSelectionOptions)];
  }

  /**
   * Returns a list of validated resources based on the lesson and selection.
   * Used for ZIP file generation.
   */
  function getSelectedResourceList({
    lesson,
    selection,
    additionalFilesAssets,
  }: {
    lesson: LessonAssets;
    selection: ResourceSelectionOptionsType;
    additionalFilesAssets: AdditionalAsset[];
  }): Resource[] {
    const resourceList = resourceDefinitions.map((resourceDef) =>
      getResourceFromDefinition(lesson, resourceDef),
    );

    const additionalFilesResources = additionalFilesAssets
      .map((asset) => asset && getResourceFromAdditionalAsset(lesson, asset))
      .filter(truthy);

    const selectedResources = selection
      .map((option) => SELECTION_TO_FILES_MAP[option])
      .flat()
      .map((resourceType) => resourceList.find((r) => r.type === resourceType))
      .filter(truthy);

    return selection.includes("additional-files")
      ? selectedResources.concat(additionalFilesResources)
      : selectedResources;
  }

  /**
   * Get the latest updatedAt timestamp from all resources.
   * Used for generating deterministic ZIP filenames for caching.
   */
  function getLatestAssetsUpdatedAt(
    lesson: LessonAssets,
    additionalAssets: AdditionalAsset[],
  ): string | null {
    const timestamps: (string | null | undefined)[] = [];

    for (const resourceDef of resourceDefinitions) {
      if (resourceDef.getIsPublished(lesson)) {
        timestamps.push(resourceDef.getUpdatedAt(lesson));
      }
    }

    for (const asset of additionalAssets) {
      timestamps.push(asset.updated_at);
    }

    const validTimestamps = timestamps
      .filter(
        (ts): ts is string => typeof ts === "string" && dateStringIsValid(ts),
      )
      .map((ts) => new Date(ts).getTime());

    if (validTimestamps.length === 0) {
      return null;
    }

    const latestTimestamp = Math.max(...validTimestamps);
    return new Date(latestTimestamp).toISOString();
  }

  return {
    getAvailableResourceOptions,
    getResourceInfoByFileType,
    getAvailableResourceSelectionOptions,
    getSelectedResourceList,
    getLatestAssetsUpdatedAt,
    validateResource,
  };
}

export type ResourceHelpers = ReturnType<typeof getResourceHelpers>;
