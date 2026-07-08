import { getCachedUnitData } from "../../../getCachedUnitData";

export const getSuccessData = async (
  programmeSlug: string,
  unitSlug: string,
  lessonSlug: string,
) => {
  const unitData = await getCachedUnitData(programmeSlug, unitSlug);

  const lesson = unitData.lessons.find((l) => l.lessonSlug === lessonSlug);
  if (!lesson?.lessonReleaseDate) {
    return null;
  }

  return {
    lessonTitle: lesson.lessonTitle,
    lessonSlug: lesson.lessonSlug,
    lessonReleaseDate: lesson.lessonReleaseDate,
    ...unitData,
  };
};
