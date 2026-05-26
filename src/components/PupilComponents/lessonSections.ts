import z from "zod";

export const lessonSectionsSchema = z.enum([
  "overview",
  "intro",
  "starter-quiz",
  "video",
  "exit-quiz",
  "review",
]);

export const allLessonReviewSectionsSchema = z.enum([
  "intro",
  "starter-quiz",
  "video",
  "exit-quiz",
]);

export const lessonSections = lessonSectionsSchema.options;
export const allLessonReviewSections = allLessonReviewSectionsSchema.options;

export type LessonSection = z.infer<typeof lessonSectionsSchema>;
export type LessonReviewSection = z.infer<typeof allLessonReviewSectionsSchema>;

export const isLessonSection = (
  currentSection: string,
): currentSection is LessonSection => {
  return lessonSectionsSchema.options.includes(currentSection as LessonSection);
};

export const isLessonReviewSection = (
  section: string,
): section is LessonReviewSection => {
  return allLessonReviewSectionsSchema.options.includes(
    section as LessonReviewSection,
  );
};
