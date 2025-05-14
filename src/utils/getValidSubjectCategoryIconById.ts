import { isValidIconName, OakIconName } from "@oaknational/oak-components";

export function getValidSubjectCategoryIconById(
  subjectSlug: string,
  subjectCategorySlug: string,
): OakIconName {
  const subjectCatKey = `subject-${subjectCategorySlug}`;
  const subjectAndCatKey = `subject-${subjectSlug}-${subjectCategorySlug}`;
  const subjectKey = `subject-${subjectSlug}`;

  if (isValidIconName(subjectCatKey)) {
    return subjectCatKey;
  }
  if (isValidIconName(subjectAndCatKey)) {
    return subjectAndCatKey;
  }
  if (subjectCategorySlug === "all" && isValidIconName(subjectKey)) {
    return subjectKey;
  }
  return "books";
}
