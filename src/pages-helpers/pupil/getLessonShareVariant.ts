import {
  LessonSection,
  LessonReviewSection,
} from "@/components/PupilComponents/lessonSections";

export type LessonShareVariant = {
  sections: LessonSection[];
  reviewSections: LessonReviewSection[];
  hideYearGroup?: boolean;
};

export const PUPIL_LESSON_SHARE_VARIANTS: Record<string, LessonShareVariant> = {
  "starter-quiz-only": {
    sections: ["overview", "intro", "starter-quiz"],
    reviewSections: ["intro", "starter-quiz"],
  },
  "exit-quiz-only": {
    sections: ["overview", "intro", "exit-quiz"],
    reviewSections: ["intro", "exit-quiz"],
  },
  "video-only": {
    sections: ["overview", "intro", "video"],
    reviewSections: ["intro", "video"],
  },
  "starter-quiz-video": {
    sections: ["overview", "intro", "starter-quiz", "video"],
    reviewSections: ["intro", "starter-quiz", "video"],
  },
  "quizzes-only": {
    sections: ["overview", "intro", "starter-quiz", "exit-quiz"],
    reviewSections: ["intro", "starter-quiz", "exit-quiz"],
  },
  "video-exit-quiz": {
    sections: ["overview", "intro", "video", "exit-quiz"],
    reviewSections: ["intro", "video", "exit-quiz"],
  },
};

export type LessonShareVariantSlug = keyof typeof PUPIL_LESSON_SHARE_VARIANTS;

/**
 * Returns a lesson share variant if the slug has a matching variant, otherwise returns null
 * @param lessonShareSlug - the url slug for a share variant
 */
export const getLessonShareVariant = (
  lessonShareSlug: string,
): LessonShareVariant | null =>
  PUPIL_LESSON_SHARE_VARIANTS[lessonShareSlug] ?? null;

/**
 * Checks to see if variant exists with specified parameters (e.g sections and year group) and returns the matching slug
 * or null if none is found.
 * Overview and Intro are excluded from the check as they are not independently selectable when sharing a lesson
 * @param sections - the sections that should be included in the variant
 * @param hideYearGroup - whether the variant should hide the year group
 */
export const getLessonShareVariantSlug = (
  sections: LessonSection[],
  hideYearGroup: boolean = false,
): LessonShareVariantSlug | null => {
  const filterOutOverviewIntro = (s: LessonSection): boolean =>
    s !== "overview" && s !== "intro";
  const sectionsExclOverviewIntro = sections.filter(filterOutOverviewIntro);
  const match = Object.entries(PUPIL_LESSON_SHARE_VARIANTS).find(
    ([slug, variant]) => {
      const filteredSections = variant.sections.filter(filterOutOverviewIntro);
      const hasAllSections: boolean = filteredSections.every((section) =>
        sectionsExclOverviewIntro.includes(section),
      );
      if (!hasAllSections) return null;
      const hasHideYearGroup =
        Boolean(variant.hideYearGroup) === Boolean(hideYearGroup);
      if (!hasHideYearGroup) return null;
      return [slug, variant];
    },
  );
  return match?.[0] ?? null;
};
