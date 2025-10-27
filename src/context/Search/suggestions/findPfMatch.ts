import {
  examboardSlugs,
  keystageSlugs,
  subjectSlugs,
  yearSlugs,
} from "@oaknational/oak-curriculum-schema";
import z from "zod";

import {
  OAK_EXAMBOARDS,
  OAK_KEYSTAGES,
  OAK_SUBJECTS,
  OAK_YEARS,
} from "./oakCurriculumData";
import { getMatch } from "./match/getMatch";
import { hasNonMatchingWords } from "./match/hasNonMatchingWords";

import { DirectMatch } from "@/common-lib/schemas/search-intent";

/**
 * Searches within a query for any pfs (programme factors) that can be matched exactly within the term
 */
export const findPfMatch = (query: string): DirectMatch | null => {
  if (!query.trim() || query.length < 2) {
    return null;
  }

  const subjectMatch = getMatch(query, OAK_SUBJECTS);
  const parsedSubject = z
    .object({ title: z.string(), slug: subjectSlugs })
    .safeParse(subjectMatch);

  const keystageMatch = getMatch(query, OAK_KEYSTAGES);
  const parsedKeystage = z
    .object({ title: z.string(), slug: keystageSlugs })
    .safeParse(keystageMatch);

  const yearMatch = getMatch(query, OAK_YEARS);
  const parsedYear = z
    .object({ title: z.string(), slug: yearSlugs })
    .safeParse(yearMatch);

  const examboardMatch = getMatch(query, OAK_EXAMBOARDS);
  const parsedExamboard = z
    .object({ title: z.string(), slug: examboardSlugs })
    .safeParse(examboardMatch);

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

  return {
    subject: isAmbiguousMatch ? null : (parsedSubject.data ?? null),
    keyStage: parsedKeystage.data ?? null,
    examBoard: parsedExamboard.data ?? null,
    year: parsedYear.data ?? null,
  };
};
