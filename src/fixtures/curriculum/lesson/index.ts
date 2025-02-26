import { getTitleFromSlug } from "@/fixtures/shared/helper";
import { Unit } from "@/utils/curriculum/types";

const BASE_LESSON = {
  slug: "test",
  title: "Test",
  _state: "published",
  // order: 1,
  // lesson_uid: ""
};

// const ID_MAP = new Map();

export function createLesson(
  partial?: Partial<NonNullable<Unit["lessons"]>[number]>,
) {
  const title = getTitleFromSlug(partial?.slug);
  // const lesson_uid = getLessonUidFromSlug(ID_MAP, partial?.slug ?? BASE_LESSON.slug);

  return {
    ...BASE_LESSON,
    ...(title ? { title } : {}),
    // ...(lesson_uid ? {lesson_uid} : {}),
    ...partial,
  };
}
