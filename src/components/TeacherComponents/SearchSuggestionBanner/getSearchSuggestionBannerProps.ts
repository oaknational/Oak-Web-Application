import { SearchSuggestionBannerProps } from "./SearchSuggestionBanner";

import { OAK_SUBJECTS } from "@/context/Search/suggestions/oakCurriculumData";
import { SearchIntent } from "@/common-lib/schemas/search-intent";

const getKeystageLinks = (searchIntent: SearchIntent) => {
  const { directMatch, suggestedFilters } = searchIntent;
  const links = [];

  const subjectData = OAK_SUBJECTS.find(
    (subject) => subject.slug === directMatch?.subject?.slug,
  );

  const hasKeystageMatch = directMatch?.keyStage || directMatch?.examBoard;
  const isValidKeystageForSubject = subjectData?.keyStages.some((ks) => {
    if (directMatch?.keyStage) {
      return ks.slug === directMatch.keyStage.slug;
    } else {
      return ks.slug === "ks4";
    }
  });
  const suggestedKeystageFilters = suggestedFilters.filter(
    (filter) => filter.type === "key-stage",
  );

  // This is to handle the fact that ks4 citizenship has pathways (Core nad GCSE) but no examboards/tiers
  // so directing to the programme listing page shows no programmes, as pathways are handled at the subject listing level in browse
  const getHasPathways = (keystageSlug: string) =>
    directMatch?.subject?.slug === "citizenship" && keystageSlug === "ks4";

  if (hasKeystageMatch && isValidKeystageForSubject) {
    // Valid keystage match in a subject
    const keystageSlug = directMatch?.keyStage?.slug ?? "ks4";
    const keystageTitle = directMatch?.keyStage?.title ?? "Key stage 4";
    const hasPathways = getHasPathways(keystageSlug);
    links.push({
      keystageSlug,
      keystageTitle,
      pathwayTitle: hasPathways ? "Core" : undefined,
    });
    hasPathways &&
      links.push({
        keystageSlug,
        keystageTitle,
        pathwayTitle: "GCSE",
      });
  } else if (suggestedKeystageFilters.length > 0) {
    // suggested filters in a subject without pathways
    suggestedKeystageFilters.forEach((keystage) => {
      const hasPathways = getHasPathways(keystage.slug);
      links.push({
        keystageSlug: keystage.slug,
        keystageTitle: keystage.title,
        pathwayTitle: hasPathways ? "Core" : undefined,
      });
      hasPathways &&
        links.push({
          keystageSlug: keystage.slug,
          keystageTitle: keystage.title,
          pathwayTitle: "GCSE",
        });
    });
  } else {
    // keystages for subject with no or invalid direct match & no suggested filters
    subjectData?.keyStages.forEach((keystage) => {
      const hasPathways = getHasPathways(keystage.slug);
      links.push({
        keystageSlug: keystage.slug,
        keystageTitle: keystage.title,
        pathwayTitle: hasPathways ? "Core" : undefined,
      });
      hasPathways &&
        links.push({
          keystageSlug: keystage.slug,
          keystageTitle: keystage.title,
          pathwayTitle: "GCSE",
        });
    });
  }

  return links;
};

export function getSearchSuggestionBannerProps(props: SearchIntent) {
  const { directMatch } = props;
  let suggestion: SearchSuggestionBannerProps | null = null;

  if (directMatch?.subject) {
    const description = OAK_SUBJECTS.find(
      (subject) => subject.slug === directMatch.subject?.slug,
    )?.description;

    if (!description) {
      return null;
    }

    suggestion = {
      title: directMatch.subject.title,
      subjectSlug: directMatch.subject.slug,
      body: description,
      links: getKeystageLinks(props),
    };
  }

  if (suggestion?.links.length === 1) {
    suggestion.metadata = suggestion.links[0]?.keystageTitle;
  }

  return suggestion;
}
