import Fuse from "fuse.js";
import {
  keystageSlugs,
  subjectSlugs,
} from "@oaknational/oak-curriculum-schema";

import { OAK_KEYSTAGES, OAK_SUBJECTS } from "./oakSubjects";

import { DirectMatch } from "@/pages/api/search/schemas";

const subjectsFuse = new Fuse(OAK_SUBJECTS, {
  keys: ["title", "slug", "aliases"],
  threshold: 0.6,
  minMatchCharLength: 4,
});

const keystagesFuse = new Fuse(OAK_KEYSTAGES, {
  keys: ["slug", "title"],
  threshold: 0.8,
  minMatchCharLength: 3,
});

export const findFuzzyMatch = (query: string): DirectMatch | null => {
  if (!query.trim() || query.length < 2) {
    return null;
  }

  const subjectResults = subjectsFuse.search(query);
  const keystageResults = keystagesFuse.search(query);

  if (!subjectResults[0] && !keystageResults[0]) {
    return null;
  }

  const parsedSubject = subjectSlugs.safeParse(subjectResults[0]?.item.slug);
  const parsedKeystage = keystageSlugs.safeParse(keystageResults[0]?.item.slug);

  return {
    subject: parsedSubject.data ?? null,
    keyStage: parsedKeystage.data ?? null,
    examBoard: null,
    year: null,
  };
};
