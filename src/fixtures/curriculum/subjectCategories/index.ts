import { SubjectCategory } from "@/utils/curriculum/types";

const BASE_SUBJECT_CATEGORIES: SubjectCategory = {
  id: 1,
  title: "Foo",
};

export function createSubjectCategory(partial: Partial<SubjectCategory> = {}) {
  return {
    ...BASE_SUBJECT_CATEGORIES,
    ...partial,
  };
}
