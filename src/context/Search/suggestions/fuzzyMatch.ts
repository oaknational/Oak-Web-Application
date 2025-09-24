import Fuse from "fuse.js";

import { OAK_SUBJECTS } from "./oakSubjects";

import { SearchSuggestion } from "@/pages/api/search/schemas";

const fuse = new Fuse(OAK_SUBJECTS, {
  keys: ["title", "slug", "aliases"],
  threshold: 0.2, // Lower = more strict matching
  minMatchCharLength: 2,
});

export const findFuzzyMatch = (query: string): SearchSuggestion | null => {
  if (!query.trim() || query.length < 2) {
    return null;
  }

  const results = fuse.search(query);

  if (!results[0]) {
    return null;
  }

  const bestMatch = results[0].item;

  return {
    type: "subject" as const,
    title: bestMatch.title,
    description: bestMatch.description,
    slug: bestMatch.slug,
    keyStages: bestMatch.keyStages,
  };
};
