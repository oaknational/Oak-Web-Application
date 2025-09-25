import Fuse from "fuse.js";
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

import { DirectMatch } from "@/pages/api/search/schemas";

const subjectsFuse = new Fuse(OAK_SUBJECTS, {
  keys: ["title", "slug", "aliases"],
  threshold: 0.6,
  minMatchCharLength: 4,
  ignoreLocation: true,
});

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

export const findFuzzyMatch = (query: string): DirectMatch | null => {
  if (!query.trim() || query.length < 2) {
    return null;
  }

  const subjectResults = subjectsFuse.search(query);
  const parsedSubject = subjectSlugs.safeParse(subjectResults[0]?.item.slug);

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
