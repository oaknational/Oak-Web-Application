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

const keystagesFuse = new Fuse(OAK_KEYSTAGES, {
  keys: ["slug", "title"],
  threshold: 0.8,
  minMatchCharLength: 3,
  ignoreLocation: true,
});

const yearsFuse = new Fuse(OAK_YEARS, {
  keys: ["slug", "title", "aliases"],
  threshold: 0.8,
  minMatchCharLength: 2,
  ignoreLocation: true,
});

const examboardsFuse = new Fuse(OAK_EXAMBOARDS, {
  keys: ["slug", "title"],
  threshold: 0.8,
  minMatchCharLength: 3,
  ignoreLocation: true,
});

const getMatches = (query: string, data: CurriculumData[]) => {
  return data
    .map((subject) => {
      const slugRegex = new RegExp(subject.slug, "i");
      const matchesSlug = query.match(slugRegex);

      const titleRegex = new RegExp(subject.title, "i");
      const matchesTitle = query.match(titleRegex);

      const matchesAlias = subject.aliases?.some((alias) => {
        const aliasRegex = new RegExp(alias, "i");
        return query.match(aliasRegex);
      });

      if (matchesSlug || matchesTitle || matchesAlias) {
        return subject.slug;
      } else {
        return null;
      }
    })
    .filter((match) => !!match);
};

export const findFuzzyMatch = (query: string): DirectMatch | null => {
  if (!query.trim() || query.length < 2) {
    return null;
  }

  const matchedSubjects = getMatches(query, OAK_SUBJECTS);
  // if there are multiple matches we don't have a way to rank them so discard them all
  const subjectMatch = matchedSubjects.length === 1 ? matchedSubjects[0] : null;
  const parsedSubject = subjectSlugs.safeParse(subjectMatch);

  const keystageResults = keystagesFuse.search(query);
  const parsedKeystage = keystageSlugs.safeParse(keystageResults[0]?.item.slug);

  const yearResults = yearsFuse.search(query);
  const parsedYear = yearSlugs.safeParse(yearResults[0]?.item.slug);

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
