import { OakIconName } from "@oaknational/oak-components";

import { getValidSubjectIconName } from "./getValidSubjectIconName";
const subjectCategoryIconMap: Record<number, string> = {
  1: "biology",
  2: "chemistry",
  3: "physics",
  4: "english-reading-writing-oracy",
  5: "english-grammar",
  6: "english-handwriting",
  7: "english-spelling",
  8: "english-vocabulary",
  18: "english-language",
  19: "english-reading-for-pleasure",
};

export function getValidSubjectCategoryIconById(id: number): OakIconName {
  const subjectSlug = subjectCategoryIconMap[id];

  return getValidSubjectIconName(subjectSlug ?? null);
}
