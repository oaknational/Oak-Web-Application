import { CurriculumData } from "../oakCurriculumData";

import { rankMatches } from "./rankMatches";

export type MatchResult = { slug: string; matched: string };

const getMatchLowerCase = (query: string, term: string) => {
  const termLower = term.toLowerCase();
  const queryLower = query.toLowerCase();
  const matches = queryLower.includes(termLower);
  return matches;
};

export const getMatch = (
  query: string,
  data: CurriculumData[],
): MatchResult | undefined => {
  const matches: Array<MatchResult> = [];

  data.forEach((datum) => {
    const matchesSlug = getMatchLowerCase(query, datum.slug);
    if (matchesSlug) {
      matches.push({ slug: datum.slug, matched: datum.slug });
    }

    const matchesTitle = getMatchLowerCase(query, datum.title);
    if (matchesTitle) {
      matches.push({ slug: datum.slug, matched: datum.title });
    }

    datum.aliases?.forEach((alias) => {
      const matchesAlias = getMatchLowerCase(query, alias);
      if (matchesAlias) {
        matches.push({ slug: datum.slug, matched: alias });
      }
    });
  });

  if (matches.length > 1) {
    const ranked = rankMatches(query, matches);
    return ranked;
  }
  return matches[0];
};
