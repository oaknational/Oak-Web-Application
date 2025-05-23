import { getTitleFromSlug } from "@/fixtures/shared/helper";
import { SubjectCategory } from "@/utils/curriculum/types";

const BASE_SUBJECT_CATEGORIES: SubjectCategory = {
  id: 1,
  slug: "foo",
  title: "Foo",
};

export function createSubjectCategory(partial: Partial<SubjectCategory> = {}) {
  const slug = getTitleFromSlug(partial?.slug);
  return {
    ...BASE_SUBJECT_CATEGORIES,
    ...(slug ? { slug } : {}),
    ...partial,
  };
}
