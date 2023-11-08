import { LessonListSchema } from "./lessonDownloads.schema";

const getNextLessonsInUnit = (unit: LessonListSchema, lessonSlug: string) => {
  if (!unit || !lessonSlug) {
    return [];
  }
  const lessonInUnit = unit.find((lesson) => lesson.lessonSlug === lessonSlug);
  const lessonPosition = lessonInUnit?.orderInUnit;
  const nextLessons =
    lessonPosition &&
    unit
      .filter((lesson) =>
        lesson.orderInUnit ? lesson.orderInUnit > lessonPosition : [],
      )
      .splice(0, 3);

  return nextLessons
    ? nextLessons.map(({ lessonSlug, lessonTitle }) => ({
        lessonSlug,
        lessonTitle,
      }))
    : [];
};

export default getNextLessonsInUnit;
