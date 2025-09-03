import { isValidIconName, OakIconName } from "@oaknational/oak-components";

const subjectAndCatKeyMap: Record<string, string> = {
  "reading-writing-and-oracy": "reading-writing-oracy",
  literature: "english-reading-for-pleasure",
};

export function getValidSubjectCategoryIconById(
  subjectSlug: string,
  subjectCategorySlugRaw: string,
): OakIconName {
  const subjectCategorySlug: string =
    subjectCategorySlugRaw in subjectAndCatKeyMap
      ? subjectAndCatKeyMap[subjectCategorySlugRaw]!
      : subjectCategorySlugRaw;
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
