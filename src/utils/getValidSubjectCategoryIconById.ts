const subjectCategoryIconMap: Record<number, string> = {
  1: "subject-biology",
  2: "subject-chemistry",
  3: "subject-physics",
  4: "subject-english-reading-writing-oracy",
  5: "subject-english-grammar",
  6: "subject-english-handwriting",
  7: "subject-english-spelling",
  8: "subject-english-vocabulary",
  18: "subject-english-language",
  19: "subject-english-reading-for-pleasure",
};

export function getValidSubjectCategoryIconById(id: number): string {
  const subjectSlug = subjectCategoryIconMap[id];

  if (!subjectSlug) {
    return "books";
  }

  return subjectSlug;
}
