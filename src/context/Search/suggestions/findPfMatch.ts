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
import { hasNonMatchingWords } from "./match/hasNonMatchingWords";

import { DirectMatch } from "@/pages/api/search/schemas";

/**
 * Searches within a query for any pfs (programme factors) that can be matched exactly within the term
 */
export const findPfMatch = (query: string): DirectMatch | null => {
  if (!query.trim() || query.length < 2) {
    return null;
  }

  const subjectMatch = getMatch(query, OAK_SUBJECTS);
  const parsedSubject = subjectSlugs.safeParse(subjectMatch?.slug);

  const keystageMatch = getMatch(query, OAK_KEYSTAGES);
  const parsedKeystage = keystageSlugs.safeParse(keystageMatch?.slug);

  const yearMatch = getMatch(query, OAK_YEARS);
  const parsedYear = yearSlugs.safeParse(yearMatch?.slug);

  const examboardMatch = getMatch(query, OAK_EXAMBOARDS);
  const parsedExamboard = examboardSlugs.safeParse(examboardMatch?.slug);

  if (
    !parsedSubject.data &&
    !parsedKeystage.data &&
    !parsedYear.data &&
    !parsedExamboard.data
  ) {
    return null;
  }

  const isAmbiguousMatch = hasNonMatchingWords(query, {
    subject: subjectMatch?.matched,
    keyStage: keystageMatch?.matched,
    year: yearMatch?.matched,
    examBoard: examboardMatch?.matched,
  });

  return isAmbiguousMatch
    ? null
    : {
        subject: parsedSubject.data ?? null,
        keyStage: parsedKeystage.data ?? null,
        examBoard: parsedExamboard.data ?? null,
        year: parsedYear.data ?? null,
      };
};
