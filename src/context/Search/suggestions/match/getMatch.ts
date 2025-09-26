import { CurriculumData } from "../oakCurriculumData";

import { rankMatches } from "./rankMatches";

export const getMatch = (query: string, data: CurriculumData[]) => {
  const matches: Array<{ slug: string; matched: string }> = [];

  data.forEach((datum) => {
    const slugRegex = new RegExp(datum.slug, "i");
    const matchesSlug = query.match(slugRegex);
    if (matchesSlug) {
      matches.push({ slug: datum.slug, matched: datum.slug });
    }

    const titleRegex = new RegExp(datum.title, "i");
    const matchesTitle = query.match(titleRegex);
    if (matchesTitle) {
      matches.push({ slug: datum.slug, matched: datum.title });
    }

    datum.aliases?.forEach((alias) => {
      const aliasRegex = new RegExp(alias, "i");
      const matchesAlias = query.match(aliasRegex);
      if (matchesAlias) {
        matches.push({ slug: datum.slug, matched: alias });
      }
    });
  });

  if (matches.length > 1) {
    const ranked = rankMatches(query, matches);
    return ranked;
  }
  return matches[0]?.slug;
};
