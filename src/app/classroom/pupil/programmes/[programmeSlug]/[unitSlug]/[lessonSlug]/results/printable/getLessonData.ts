"use server";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export const getLessonData = async (lessonSlug?: string) => {
  if (!lessonSlug) return;
  console.log("querying curriculum api for lesson data with slug", lessonSlug);
  const { browseData, content } = await curriculumApi2023.pupilLessonQuery({
    lessonSlug,
  });
  return { browseData, content };
};
