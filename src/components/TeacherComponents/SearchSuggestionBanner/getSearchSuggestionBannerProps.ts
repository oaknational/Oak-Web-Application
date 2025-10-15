import { SearchSuggestionBannerProps } from "./SearchSuggestionBanner";

import { OAK_SUBJECTS } from "@/context/Search/suggestions/oakCurriculumData";
import { SearchIntent } from "@/common-lib/schemas/search-intent";

export function getSearchSuggestionBannerProps(props: SearchIntent) {
  const { directMatch, suggestedFilters } = props;
  let suggestion: SearchSuggestionBannerProps | null = null;

  const suggestedKeystageFilters = suggestedFilters.filter(
    (filter) => filter.type === "key-stage",
  );

  if (directMatch?.subject) {
    const description = OAK_SUBJECTS.find(
      (subject) => subject.slug === directMatch.subject?.slug,
    )?.description;

    suggestion = {
      title: directMatch.subject.title,
      subjectSlug: directMatch.subject.slug,
      body: description,
      links: [],
    };

    const subjectData = OAK_SUBJECTS.find(
      (subject) => subject.slug === directMatch.subject?.slug,
    );

    const hasKeystageMatch = directMatch?.keyStage || directMatch?.examBoard;
    const isValidKeystageForSubject = subjectData?.keyStages.some((ks) => {
      if (directMatch.keyStage) {
        return ks.slug === directMatch.keyStage.slug;
      } else {
        return ks.slug === "ks4";
      }
    });

    if (hasKeystageMatch) {
      if (isValidKeystageForSubject) {
        suggestion.links.push({
          keystageSlug: directMatch?.keyStage?.slug ?? "ks4",
          keystageTitle: directMatch?.keyStage?.title ?? "Key stage 4",
        });
      } else {
        subjectData?.keyStages.forEach((ks) => {
          suggestion?.links.push({
            keystageSlug: ks.slug,
            keystageTitle: ks.title,
          });
        });
      }
    } else if (suggestedKeystageFilters.length > 0) {
      suggestedKeystageFilters.forEach((keystage) => {
        suggestion?.links.push({
          keystageSlug: keystage.slug,
          keystageTitle: keystage.title,
        });
      });
    } else {
      subjectData?.keyStages.forEach((ks) => {
        suggestion?.links.push({
          keystageSlug: ks.slug,
          keystageTitle: ks.title,
        });
      });
    }
  }

  if (suggestion?.links.length === 1) {
    suggestion.metadata = suggestion.links[0]?.keystageTitle;
  }

  return suggestion;
}
