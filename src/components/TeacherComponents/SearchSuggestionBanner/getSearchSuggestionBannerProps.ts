import { SearchSuggestionBannerProps } from "./SearchSuggestionBanner";

import { OAK_SUBJECTS } from "@/context/Search/suggestions/oakCurriculumData";
import { SearchIntent } from "@/common-lib/schemas/search-intent";

export function getSearchSuggestionBannerProps(props: SearchIntent) {
  const { directMatch, suggestedFilters } = props;
  let suggestion: SearchSuggestionBannerProps | null = null;

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

    if (directMatch?.keyStage || directMatch?.examBoard) {
      suggestion.metadata = directMatch?.keyStage?.title ?? "Key stage 4";
      suggestion.links.push({
        keystageSlug: directMatch?.keyStage?.slug ?? "ks4",
        keystageTitle: directMatch?.keyStage?.title ?? "Key stage 4",
      });
    } else {
      const suggestedKeystages = suggestedFilters.filter(
        (filter) => filter.type === "key-stage",
      );

      suggestedKeystages.forEach((keystage) => {
        suggestion?.links.push({
          keystageSlug: keystage.slug,
          keystageTitle: keystage.title,
        });
      });
    }
  }

  return suggestion;
}
