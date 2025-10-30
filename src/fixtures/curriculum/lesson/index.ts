import { getTitleFromSlug } from "@/fixtures/shared/helper";
import { Unit } from "@/utils/curriculum/types";

const BASE_LESSON = {
  slug: "test",
  title: "Test",
  _state: "published",
};

export function createLesson(
  partial?: Partial<NonNullable<Unit["lessons"]>[number]>,
) {
  const title = getTitleFromSlug(partial?.slug);

  return {
    ...BASE_LESSON,
    ...(title ? { title } : {}),
    ...partial,
  };
}
