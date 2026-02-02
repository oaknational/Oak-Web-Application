import { z } from "zod";

import type { LessonAssets } from "../schemas/lessonAssets.schema";

/**
 * Resource file types available for download
 */
const RESOURCE_FILE_TYPES = [
  "quiz-starter-questions--pdf",
  "quiz-starter-answers--pdf",
  "quiz-exit-questions--pdf",
  "quiz-exit-answers--pdf",
  "slidedeck--pptx",
  "worksheet-questions--pdf",
  "worksheet-answers--pdf",
  "worksheet-questions--pptx",
  "worksheet-answers--pptx",
  "supplementary-asset--pdf",
  "supplementary-asset--docx",
  "lesson-guide--docx",
  "lesson-guide--pdf",
  "additional-files",
] as const;

export type ResourceFileType = (typeof RESOURCE_FILE_TYPES)[number];

/**
 * Resource options that map to exactly ONE file.
 * Used for single-asset downloads (no zipping).
 */
export const SINGLE_FILE_RESOURCE_OPTIONS = [
  "intro-quiz-questions",
  "intro-quiz-answers",
  "exit-quiz-questions",
  "exit-quiz-answers",
  "presentation",
  "worksheet-pdf-questions",
  "worksheet-pdf-answers",
  "worksheet-pptx-questions",
  "worksheet-pptx-answers",
  "supplementary-pdf",
  "supplementary-docx",
  "lesson-guide-docx",
  "lesson-guide-pdf",
  "additional-files",
] as const;

export type SingleFileResourceOption =
  (typeof SINGLE_FILE_RESOURCE_OPTIONS)[number];

/**
 * Maps single-file selections to their file type and metadata.
 * Used for individual asset downloads.
 */
export const SINGLE_FILE_SELECTION_MAP: Record<
  Exclude<SingleFileResourceOption, "additional-files">,
  { fileType: ResourceFileType; filename: string; ext: string }
> = {
  "intro-quiz-questions": {
    fileType: "quiz-starter-questions--pdf",
    filename: "starter-quiz-questions.pdf",
    ext: "pdf",
  },
  "intro-quiz-answers": {
    fileType: "quiz-starter-answers--pdf",
    filename: "starter-quiz-answers.pdf",
    ext: "pdf",
  },
  "exit-quiz-questions": {
    fileType: "quiz-exit-questions--pdf",
    filename: "exit-quiz-questions.pdf",
    ext: "pdf",
  },
  "exit-quiz-answers": {
    fileType: "quiz-exit-answers--pdf",
    filename: "exit-quiz-answers.pdf",
    ext: "pdf",
  },
  presentation: {
    fileType: "slidedeck--pptx",
    filename: "slide-deck.pptx",
    ext: "pptx",
  },
  "worksheet-pdf-questions": {
    fileType: "worksheet-questions--pdf",
    filename: "worksheet-questions.pdf",
    ext: "pdf",
  },
  "worksheet-pdf-answers": {
    fileType: "worksheet-answers--pdf",
    filename: "worksheet-answers.pdf",
    ext: "pdf",
  },
  "worksheet-pptx-questions": {
    fileType: "worksheet-questions--pptx",
    filename: "worksheet-questions.pptx",
    ext: "pptx",
  },
  "worksheet-pptx-answers": {
    fileType: "worksheet-answers--pptx",
    filename: "worksheet-answers.pptx",
    ext: "pptx",
  },
  "supplementary-pdf": {
    fileType: "supplementary-asset--pdf",
    filename: "additional-materials.pdf",
    ext: "pdf",
  },
  "supplementary-docx": {
    fileType: "supplementary-asset--docx",
    filename: "additional-materials.docx",
    ext: "docx",
  },
  "lesson-guide-docx": {
    fileType: "lesson-guide--docx",
    filename: "lesson-guide.docx",
    ext: "docx",
  },
  "lesson-guide-pdf": {
    fileType: "lesson-guide--pdf",
    filename: "lesson-guide.pdf",
    ext: "pdf",
  },
};

/**
 * Resource definition for extracting file info from a lesson
 */
export type ResourceDefinition = {
  getGCSFilePath: (lesson: LessonAssets) => string | null | undefined;
  getGCSBucketName: (lesson: LessonAssets) => string | null | undefined;
  getUpdatedAt: (lesson: LessonAssets) => string | null | undefined;
  getIsPublished: (lesson: LessonAssets) => boolean;
  getPathInZip: () => string;
  ext: string;
  fileSize: string;
  type: ResourceFileType;
};

export type ResourceError = {
  message: string;
};

/**
 * Zod schema for validating asset search params
 */
export const AssetSearchParamsSchema = z
  .object({
    resource: z.enum(SINGLE_FILE_RESOURCE_OPTIONS, {
      required_error: "Query parameter 'resource' is required",
      invalid_type_error: `Must be one of: ${SINGLE_FILE_RESOURCE_OPTIONS.join(", ")}`,
    }),
    assetId: z
      .string()
      .optional()
      .refine((val) => val === undefined || /^\d+$/.test(val), {
        message: "assetId must be a numeric string",
      }),
  })
  .refine(
    (data) => {
      // assetId is required when resource is "additional-files"
      if (data.resource === "additional-files") {
        return data.assetId !== undefined;
      }
      return true;
    },
    {
      message: "assetId is required when resource is 'additional-files'",
      path: ["assetId"],
    },
  )
  .refine(
    (data) => {
      // assetId should only be provided for additional-files
      if (data.resource !== "additional-files" && data.assetId !== undefined) {
        return false;
      }
      return true;
    },
    {
      message:
        "assetId should only be provided when resource is 'additional-files'",
      path: ["assetId"],
    },
  );

export type AssetSearchParams = z.infer<typeof AssetSearchParamsSchema>;

/**
 * Full resource selection options for ZIP downloads.
 * Includes multi-file options (worksheet-pdf, worksheet-pptx) that bundle multiple files.
 */
export const RESOURCE_SELECTION_OPTIONS = [
  "intro-quiz-questions",
  "intro-quiz-answers",
  "exit-quiz-questions",
  "exit-quiz-answers",
  "presentation",
  "worksheet-pdf", // Bundles questions + answers
  "worksheet-pdf-questions",
  "worksheet-pdf-answers",
  "worksheet-pptx", // Bundles questions + answers
  "worksheet-pptx-questions",
  "worksheet-pptx-answers",
  "supplementary-pdf",
  "supplementary-docx",
  "lesson-guide-docx",
  "lesson-guide-pdf",
  "additional-files",
] as const;

export type ResourceSelectionOption =
  (typeof RESOURCE_SELECTION_OPTIONS)[number];

/**
 * Maps selection options to their corresponding file types.
 * Some selections (worksheet-pdf, worksheet-pptx) map to multiple files.
 */
export const SELECTION_TO_FILES_MAP: Record<
  ResourceSelectionOption,
  ResourceFileType[]
> = {
  "intro-quiz-questions": ["quiz-starter-questions--pdf"],
  "intro-quiz-answers": ["quiz-starter-answers--pdf"],
  "exit-quiz-questions": ["quiz-exit-questions--pdf"],
  "exit-quiz-answers": ["quiz-exit-answers--pdf"],
  presentation: ["slidedeck--pptx"],
  "worksheet-pdf": ["worksheet-questions--pdf", "worksheet-answers--pdf"],
  "worksheet-pdf-questions": ["worksheet-questions--pdf"],
  "worksheet-pdf-answers": ["worksheet-answers--pdf"],
  "worksheet-pptx": ["worksheet-questions--pptx", "worksheet-answers--pptx"],
  "worksheet-pptx-questions": ["worksheet-questions--pptx"],
  "worksheet-pptx-answers": ["worksheet-answers--pptx"],
  "supplementary-pdf": ["supplementary-asset--pdf"],
  "supplementary-docx": ["supplementary-asset--docx"],
  "lesson-guide-docx": ["lesson-guide--docx"],
  "lesson-guide-pdf": ["lesson-guide--pdf"],
  "additional-files": ["additional-files"],
};

/**
 * Zod schema for validating resource selection (used in download endpoint)
 */
export const ResourceSelectionOptionsSchema = z
  .array(z.enum(RESOURCE_SELECTION_OPTIONS), {
    invalid_type_error: `Must be a comma separated list of: ${RESOURCE_SELECTION_OPTIONS.join(", ")}`,
    required_error: "Query parameter 'selection' is required",
  })
  .nonempty();

export type ResourceSelectionOptionsType = z.infer<
  typeof ResourceSelectionOptionsSchema
>;

/**
 * Zod schema for validating download search params
 */
export const DownloadSearchParamsSchema = z.object({
  selection: ResourceSelectionOptionsSchema,
  additionalFiles: z.array(z.string()).optional(),
});

export type DownloadSearchParams = z.infer<typeof DownloadSearchParamsSchema>;
