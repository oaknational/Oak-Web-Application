import { LessonResourceType } from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { ResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { LessonItemTitle } from "@/components/TeacherComponents/LessonItemContainer";
import { DownloadResourceButtonNameValueType } from "@/browser-lib/avo/Avo";

/**
 * Maps each resource type to its associated download types.
 * Resources with empty arrays are not downloadable.
 */
export const DOWNLOAD_TYPES_BY_RESOURCE: Record<
  LessonResourceType,
  ResourceType[]
> = {
  "lesson-guide": ["lesson-guide-pdf"],
  "slide-deck": ["presentation"],
  "media-clips": [],
  "lesson-details": [],
  video: [],
  worksheet: ["worksheet-pdf", "worksheet-pptx"],
  "starter-quiz": ["intro-quiz-answers", "intro-quiz-questions"],
  "exit-quiz": ["exit-quiz-answers", "exit-quiz-questions"],
  "additional-material": ["supplementary-docx", "supplementary-pdf"],
};

/**
 * Maps resource types to their display titles
 */
export const DISPLAY_TITLES_BY_RESOURCE: Record<
  LessonResourceType,
  LessonItemTitle
> = {
  "lesson-guide": "Lesson guide",
  "slide-deck": "Lesson slides",
  "media-clips": "Video & audio clips", // Default, may be overridden by subject
  "lesson-details": "Lesson details",
  video: "Lesson video",
  worksheet: "Worksheet",
  "starter-quiz": "Prior knowledge starter quiz",
  "exit-quiz": "Assessment exit quiz",
  "additional-material": "Additional material",
};

export const TRACKING_TITLES_BY_RESOURCE: Partial<
  Record<LessonResourceType, DownloadResourceButtonNameValueType>
> = {
  worksheet: "worksheet",
  "slide-deck": "slide deck",
  "starter-quiz": "starter quiz",
  "exit-quiz": "exit quiz",
  "additional-material": "additional material",
  "lesson-guide": "lesson guide",
};

/**
 * Maps resource types to their custom download titles (if different from display title)
 */
export const DOWNLOAD_TITLES_BY_RESOURCE: Partial<
  Record<LessonResourceType, string>
> = {
  "lesson-guide": "lesson guide (PDF)",
  "starter-quiz": "starter quiz questions (PDF)",
  "exit-quiz": "exit quiz questions (PDF)",
  worksheet: "worksheet (PPTX/PDF)",
  "slide-deck": "lesson slides (PPTX)",
  "additional-material": "additional material (PDF)",
};

/**
 * Sections that have skip links available for keyboard navigation
 */
export const SKIPPABLE_CONTENT_SECTIONS: Set<LessonResourceType> = new Set([
  "video",
  "lesson-guide",
  "worksheet",
  "slide-deck",
  "media-clips",
  "additional-material",
]);
