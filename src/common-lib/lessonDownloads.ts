import type { OakIconName } from "@oaknational/oak-components";
import { z } from "zod";

type LessonDownloadContentBase = {
  hasSlideDeckAssetObject: boolean;
  hasStarterQuiz: boolean;
  hasExitQuiz: boolean;
  hasWorksheetAssetObject: boolean;
  hasWorksheetAnswersAssetObject: boolean;
  hasSupplementaryAssetObject: boolean;
  hasLessonGuideObject: boolean;
};

export type LessonDownloadContent = LessonDownloadContentBase &
  (
    | {
        isLegacy: boolean;
        hasWorksheetGoogleDriveDownloadableVersion: boolean;
      }
    | {
        isLegacy?: never;
        hasWorksheetGoogleDriveDownloadableVersion?: never;
      }
  );

export const lessonDownloadTypeSchema = z.enum([
  "lesson-guide-pdf",
  "lesson-guide-docx",
  "presentation",
  "intro-quiz-questions",
  "intro-quiz-answers",
  "exit-quiz-questions",
  "exit-quiz-answers",
  "worksheet-pdf",
  "worksheet-pptx",
  "supplementary-pdf",
  "supplementary-docx",
  "curriculum-pdf",
  "additional-files",
]);

export type LessonDownloadType = z.infer<typeof lessonDownloadTypeSchema>;
export type LessonDownloadFamily =
  | "lesson-guide"
  | "slide-deck"
  | "starter-quiz"
  | "exit-quiz"
  | "worksheet"
  | "additional-material"
  | "curriculum"
  | "additional-files";

type DownloadResourceDefinition = {
  label: string;
  group: string;
  icon: OakIconName;
  accordionLabel: string | null;
  downloadTitle: string | null;
  downloadTitleOverride?: string;
  subjectToCopyright: boolean;
  availability: ((content: LessonDownloadContent) => boolean) | null;
  formats: readonly {
    type: LessonDownloadType;
    ext: string;
    label?: string;
    forbidden?: null;
  }[];
};

// Family and format order is the download-page order.
export const lessonDownloadResources = {
  "lesson-guide": {
    label: "Lesson guide",
    group: "Lesson guide",
    icon: "additional-material",
    accordionLabel: "lesson guide",
    downloadTitle: "lesson guide",
    subjectToCopyright: false,
    availability: (content) => content.hasLessonGuideObject,
    formats: [
      { type: "lesson-guide-pdf", ext: "pdf" },
      { type: "lesson-guide-docx", ext: "docx" },
    ],
  },
  "slide-deck": {
    label: "Slide deck",
    group: "Slide deck",
    icon: "slide-deck",
    accordionLabel: "slides",
    downloadTitle: "lesson slides",
    subjectToCopyright: true,
    availability: (content) => content.hasSlideDeckAssetObject,
    formats: [{ type: "presentation", ext: "pptx", forbidden: null }],
  },
  "starter-quiz": {
    label: "Starter quiz",
    group: "Quizzes",
    icon: "quiz",
    accordionLabel: "quizzes",
    downloadTitle: "starter quiz questions",
    subjectToCopyright: false,
    availability: (content) => content.hasStarterQuiz,
    formats: [
      {
        type: "intro-quiz-questions",
        ext: "pdf",
        label: "Starter quiz questions",
      },
      { type: "intro-quiz-answers", ext: "pdf", label: "Starter quiz answers" },
    ],
  },
  "exit-quiz": {
    label: "Exit quiz",
    group: "Quizzes",
    icon: "quiz",
    accordionLabel: "quizzes",
    downloadTitle: "exit quiz questions",
    subjectToCopyright: false,
    availability: (content) => content.hasExitQuiz,
    formats: [
      { type: "exit-quiz-questions", ext: "pdf", label: "Exit quiz questions" },
      { type: "exit-quiz-answers", ext: "pdf", label: "Exit quiz answers" },
    ],
  },
  worksheet: {
    label: "Worksheet",
    group: "Worksheet",
    icon: "worksheet",
    accordionLabel: "worksheets",
    downloadTitle: "worksheet",
    downloadTitleOverride: "worksheet (PPTX/PDF)",
    subjectToCopyright: true,
    availability: (content) =>
      content.isLegacy
        ? content.hasWorksheetGoogleDriveDownloadableVersion
        : content.hasWorksheetAssetObject ||
          content.hasWorksheetAnswersAssetObject,
    formats: [
      { type: "worksheet-pdf", ext: "pdf" },
      { type: "worksheet-pptx", ext: "pptx" },
    ],
  },
  "additional-material": {
    label: "Additional material",
    group: "Additional material",
    icon: "additional-material",
    accordionLabel: "additional materials",
    downloadTitle: "additional material",
    downloadTitleOverride: "additional material (PDF)",
    subjectToCopyright: false,
    availability: (content) => content.hasSupplementaryAssetObject,
    formats: [
      { type: "supplementary-pdf", ext: "pdf" },
      { type: "supplementary-docx", ext: "docx" },
    ],
  },
  curriculum: {
    label: "Curriculum",
    group: "Lesson files",
    icon: "additional-material",
    accordionLabel: null,
    downloadTitle: null,
    subjectToCopyright: false,
    availability: null,
    formats: [{ type: "curriculum-pdf", ext: "pdf" }],
  },
  "additional-files": {
    label: "Additional files",
    group: "Lesson files",
    icon: "additional-material",
    accordionLabel: "additional files",
    downloadTitle: null,
    subjectToCopyright: false,
    availability: null,
    formats: [{ type: "additional-files", ext: "" }],
  },
} as const satisfies Record<LessonDownloadFamily, DownloadResourceDefinition>;

export const lessonDownloadFormats = Object.values(
  lessonDownloadResources,
).flatMap((resource) =>
  resource.formats.map((format) => ({
    ...format,
    label: "label" in format ? format.label : resource.label,
    resource,
  })),
);

export const getLessonDownloadTypes = (
  family: LessonDownloadFamily,
): LessonDownloadType[] =>
  lessonDownloadResources[family].formats.map((format) => format.type);

export const getLessonDownloadTitle = (family: LessonDownloadFamily) => {
  const resource = lessonDownloadResources[family];
  if ("downloadTitleOverride" in resource) {
    return resource.downloadTitleOverride;
  }
  if (!resource.downloadTitle) {
    return undefined;
  }
  const extensions = [...new Set(resource.formats.map((format) => format.ext))];
  return `${resource.downloadTitle} (${extensions.join("/").toUpperCase()})`;
};

export const lessonDownloadMetadata = Object.fromEntries(
  lessonDownloadFormats.map(({ type, resource }) => [type, resource] as const),
);

export const getLessonDownloadMetadata = (type: LessonDownloadType) => {
  const resource = lessonDownloadMetadata[type];
  if (!resource) {
    throw new Error(`Unknown lesson download type: ${type}`);
  }
  return resource;
};

export const buildLessonDownloads = (content: LessonDownloadContent) =>
  lessonDownloadFormats.flatMap(({ resource, ...format }) =>
    resource.availability
      ? [{ ...format, exists: resource.availability(content) }]
      : [],
  );

export const buildLessonOverviewDownloads = (
  content: LessonDownloadContent,
) => {
  const lessonGuideTypes = getLessonDownloadTypes("lesson-guide");
  return (
    buildLessonDownloads(content)
      // Keep overview ordering independent of the download page's guide-first order.
      .sort(
        (a, b) =>
          Number(lessonGuideTypes.includes(a.type)) -
          Number(lessonGuideTypes.includes(b.type)),
      )
      .map(({ type, exists }) => ({ type, exists }))
  );
};
