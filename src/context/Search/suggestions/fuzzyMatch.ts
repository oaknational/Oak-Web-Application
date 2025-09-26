import Fuse from "fuse.js";
import {
  examboardSlugs,
  keystageSlugs,
  subjectSlugs,
  yearSlugs,
} from "@oaknational/oak-curriculum-schema";

import {
  CurriculumData,
  OAK_EXAMBOARDS,
  OAK_KEYSTAGES,
  OAK_SUBJECTS,
  OAK_YEARS,
} from "./oakCurriculumData";

import { DirectMatch } from "@/pages/api/search/schemas";

const examboardsFuse = new Fuse(OAK_EXAMBOARDS, {
  keys: ["slug", "title"],
  threshold: 0.8,
  minMatchCharLength: 3,
  ignoreLocation: true,
});

const getMatch = (query: string, data: CurriculumData[]) => {
  const matches = data
    .map((datum) => {
      const slugRegex = new RegExp(datum.slug, "i");
      const matchesSlug = query.match(slugRegex);

      const titleRegex = new RegExp(datum.title, "i");
      const matchesTitle = query.match(titleRegex);

      const matchesAlias = datum.aliases?.some((alias) => {
        const aliasRegex = new RegExp(alias, "i");
        return query.match(aliasRegex);
      });

      if (matchesSlug || matchesTitle || matchesAlias) {
        return datum.slug;
      } else {
        return null;
      }
    })
    .filter((match) => !!match);

  // if there are multiple matches rank them by how many characters they match in the query term
  if (matches.length > 1) {
    const ranked = rankMatches(query, matches as string[]);
    return ranked[0]?.match;
  }
  return matches[0];
};

const rankMatches = (query: string, matches: string[]) => {
  return matches
    .map((match) => {
      const leftoverChars = query.length - match.length;
      return {
        match,
        leftoverChars,
      };
    })
    .sort((a, b) => a.leftoverChars - b.leftoverChars);
};

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

  const examboardResults = examboardsFuse.search(query);
  const parsedExamboard = examboardSlugs.safeParse(
    examboardResults[0]?.item.slug,
  );

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
