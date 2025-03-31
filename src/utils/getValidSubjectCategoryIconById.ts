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
  15: "philosophy",
  16: "social-science",
  17: "theology",
};

const allIconMap: Record<string, OakIconName> = {
  "religious-education": "subject-religious-education",
  english: "books",
  science: "rocket",
};

export function getValidSubjectCategoryIconById(
  subjectSlug: string,
  id: number,
): OakIconName {
  const iconName = subjectCategoryIconMap[id];

  if (id === -1) {
    return allIconMap[subjectSlug] ?? "books";
  }

  return getValidSubjectIconName(iconName ?? null);
}
