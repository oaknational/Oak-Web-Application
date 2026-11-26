import type { OakIconName } from "@oaknational/oak-components";
import { z } from "zod";

export type LessonDownloadContentBase = {
  hasSlideDeckAssetObject: boolean;
  hasStarterQuiz: boolean;
  hasExitQuiz: boolean;
  hasWorksheetAssetObject: boolean;
  hasWorksheetAnswersAssetObject: boolean;
  hasSupplementaryAssetObject: boolean;
  hasLessonGuideObject: boolean;
  mediaClips: {
    hasIntro: boolean;
    hasCycle1: boolean;
    hasCycle2: boolean;
    hasCycle3: boolean;
    hasCycle4: boolean;
  };
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
  "intro-audio-clips",
  "cycle-1-audio-clips",
  "cycle-2-audio-clips",
  "cycle-3-audio-clips",
  "cycle-4-audio-clips",
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
  | "additional-files"
  | "intro"
  | "cycle-1"
  | "cycle-2"
  | "cycle-3"
  | "cycle-4";

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

export const cycleSchema = z.enum([
  "cycle_1",
  "cycle_2",
  "cycle_3",
  "cycle_4",
  "intro",
]);
export type Cycle = z.infer<typeof cycleSchema>;
export type CycleTitleMap = Partial<Record<Cycle, string>>;

// Family and format order is the download-page order.
export const getLessonDownloadResources = (cycleTitles?: CycleTitleMap) =>
  ({
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
    intro: {
      label: "Keywords",
      group: "Audio clips",
      icon: "audio", // TODO
      accordionLabel: "audio clips",
      downloadTitle: "Keywords",
      subjectToCopyright: false,
      availability: (content) => content.mediaClips?.hasIntro,
      formats: [{ type: "intro-audio-clips", ext: "mp3", label: "Keywords" }],
    },
    "cycle-1": {
      label: cycleTitles?.["cycle_1"] ?? "Cycle 1",
      group: "Audio clips",
      icon: "audio", // TODO
      accordionLabel: "audio clips",
      downloadTitle: cycleTitles?.["cycle_1"] ?? "Cycle 1",
      subjectToCopyright: false,
      availability: (content) => content.mediaClips?.hasCycle1,
      formats: [
        {
          type: "cycle-1-audio-clips",
          ext: "mp3",
          label: cycleTitles?.["cycle_1"] ?? "Cycle 1",
        },
      ],
    },
    "cycle-2": {
      label: cycleTitles?.["cycle_2"] ?? "Cycle 2",
      group: "Audio clips",
      icon: "audio", // TODO
      accordionLabel: "audio clips",
      downloadTitle: cycleTitles?.["cycle_2"] ?? "Cycle 2",
      subjectToCopyright: false,
      availability: (content) => content.mediaClips?.hasCycle2,
      formats: [
        {
          type: "cycle-2-audio-clips",
          ext: "mp3",
          label: cycleTitles?.["cycle_2"] ?? "Cycle 2",
        },
      ],
    },
    "cycle-3": {
      label: cycleTitles?.["cycle_3"] ?? "Cycle 3",
      group: "Audio clips",
      icon: "audio", // TODO
      accordionLabel: "audio clips",
      downloadTitle: cycleTitles?.["cycle_3"] ?? "Cycle 3",
      subjectToCopyright: false,
      availability: (content) => content.mediaClips?.hasCycle3,
      formats: [
        {
          type: "cycle-3-audio-clips",
          ext: "mp3",
          label: cycleTitles?.["cycle_3"] ?? "Cycle 3",
        },
      ],
    },
    "cycle-4": {
      label: cycleTitles?.["cycle_4"] ?? "Cycle 4",
      group: "Audio clips",
      icon: "audio", // TODO
      accordionLabel: "audio clips",
      downloadTitle: cycleTitles?.["cycle_4"] ?? "Cycle 4",
      subjectToCopyright: false,
      availability: (content) => content.mediaClips?.hasCycle4,
      formats: [
        {
          type: "cycle-4-audio-clips",
          ext: "mp3",
          label: cycleTitles?.["cycle_4"] ?? "Cycle 4",
        },
      ],
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
        {
          type: "intro-quiz-answers",
          ext: "pdf",
          label: "Starter quiz answers",
        },
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
        {
          type: "exit-quiz-questions",
          ext: "pdf",
          label: "Exit quiz questions",
        },
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
  }) as const satisfies Record<
    LessonDownloadFamily,
    DownloadResourceDefinition
  >;

export const lessonDownloadFormats = (cycleTitles?: CycleTitleMap) =>
  Object.values(getLessonDownloadResources(cycleTitles)).flatMap((resource) =>
    resource.formats.map((format) => ({
      ...format,
      label: "label" in format ? format.label : resource.label,
      resource,
    })),
  );

export const getLessonDownloadTypes = (
  family: LessonDownloadFamily,
  cycleTitles?: CycleTitleMap,
): LessonDownloadType[] =>
  getLessonDownloadResources(cycleTitles)[family].formats.map(
    (format) => format.type,
  );

export const getLessonDownloadTitle = (
  family: LessonDownloadFamily,
  cycleTitles?: CycleTitleMap,
) => {
  const resource = getLessonDownloadResources(cycleTitles)[family];
  if ("downloadTitleOverride" in resource) {
    return resource.downloadTitleOverride;
  }
  if (!resource.downloadTitle) {
    return undefined;
  }
  const extensions = [...new Set(resource.formats.map((format) => format.ext))];
  return `${resource.downloadTitle} (${extensions.join("/").toUpperCase()})`;
};

export const lessonDownloadMetadata = (cycleTitles?: CycleTitleMap) =>
  Object.fromEntries(
    lessonDownloadFormats(cycleTitles).map(
      ({ type, resource }) => [type, resource] as const,
    ),
  );

export const getLessonDownloadMetadata = (
  type: LessonDownloadType,
  cycleTitles?: CycleTitleMap,
) => {
  const resource = lessonDownloadMetadata(cycleTitles)[type];
  if (!resource) {
    throw new Error(`Unknown lesson download type: ${type}`);
  }
  return resource;
};

export const buildLessonDownloads = (
  content: LessonDownloadContent,
  cycleTitles?: CycleTitleMap,
) =>
  lessonDownloadFormats(cycleTitles).flatMap(({ resource, ...format }) =>
    resource.availability
      ? [{ ...format, exists: resource.availability(content) }]
      : [],
  );

export const buildLessonOverviewDownloads = (
  content: LessonDownloadContent,
  cycleTitles?: CycleTitleMap,
) => {
  const lessonGuideTypes = getLessonDownloadTypes("lesson-guide", cycleTitles);
  return (
    buildLessonDownloads(content, cycleTitles)
      // Keep overview ordering independent of the download page's guide-first order.
      .sort(
        (a, b) =>
          Number(lessonGuideTypes.includes(a.type)) -
          Number(lessonGuideTypes.includes(b.type)),
      )
      .map(({ type, exists }) => ({ type, exists }))
  );
};
