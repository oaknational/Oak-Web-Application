"use server";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export const getLessonData = async (lessonSlug?: string) => {
  if (!lessonSlug) return;
  const { browseData, content } = await curriculumApi2023.pupilLessonQuery({
    lessonSlug,
  });
  return { browseData, content };
};
