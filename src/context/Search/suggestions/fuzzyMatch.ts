import {
  examboardSlugs,
  keystageSlugs,
  subjectSlugs,
  yearSlugs,
} from "@oaknational/oak-curriculum-schema";

import {
  OAK_EXAMBOARDS,
  OAK_KEYSTAGES,
  OAK_SUBJECTS,
  OAK_YEARS,
} from "./oakCurriculumData";
import { getMatch } from "./match/getMatch";

import { DirectMatch } from "@/pages/api/search/schemas";

export const findFuzzyMatch = (query: string): DirectMatch | null => {
  if (!query.trim() || query.length < 2) {
    return null;
  }

  const subjectMatch = getMatch(query, OAK_SUBJECTS);
  const parsedSubject = subjectSlugs.safeParse(subjectMatch);

  const keystageMatch = getMatch(query, OAK_KEYSTAGES);
  const parsedKeystage = keystageSlugs.safeParse(keystageMatch);

  const yearMatch = getMatch(query, OAK_YEARS);
  const parsedYear = yearSlugs.safeParse(yearMatch);

  const examboardMatch = getMatch(query, OAK_EXAMBOARDS);
  const parsedExamboard = examboardSlugs.safeParse(examboardMatch);

  if (
    !parsedSubject.data &&
    !parsedKeystage.data &&
    !parsedYear.data &&
    !parsedExamboard.data
  ) {
    return null;
  }

  return {
    subject: parsedSubject.data ?? null,
    keyStage: parsedKeystage.data ?? null,
    examBoard: parsedExamboard.data ?? null,
    year: parsedYear.data ?? null,
  };
};
