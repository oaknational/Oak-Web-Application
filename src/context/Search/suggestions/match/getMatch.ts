import { CurriculumData } from "../oakCurriculumData";

import { rankMatches } from "./rankMatches";

export const getMatch = (query: string, data: CurriculumData[]) => {
  const matches = data
    .map((datum) => {
      let matched;
      const slugRegex = new RegExp(datum.slug, "i");
      const matchesSlug = query.match(slugRegex);
      if (matchesSlug) {
        matched = datum.slug;
      } else {
        const titleRegex = new RegExp(datum.title, "i");
        const matchesTitle = query.match(titleRegex);
        if (matchesTitle) {
          matched = datum.title;
        } else {
          datum.aliases?.forEach((alias) => {
            const aliasRegex = new RegExp(alias, "i");
            const matches = query.match(aliasRegex);
            if (matches) {
              matched = alias;
            }
          });
        }
      }

      if (matched) {
        return { slug: datum.slug, matched };
      } else {
        return null;
      }
    })
    .filter((match) => !!match);

  if (matches.length > 1) {
    const ranked = rankMatches(query, matches);
    return ranked;
  }
  return matches[0]?.slug;
};
