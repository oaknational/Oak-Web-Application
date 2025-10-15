import { SearchSuggestionBannerProps } from "./SearchSuggestionBanner";

import { SearchIntent } from "@/common-lib/schemas/search-intent";

export function getSearchSuggestionBannerProps(props: SearchIntent) {
  const { directMatch, suggestedFilters } = props;
  let suggestion: SearchSuggestionBannerProps | null = null;

  if (directMatch?.subject) {
    suggestion = {
      title: directMatch.subject.title,
      body: "placeholder",
      links: [],
    };

    if (directMatch?.keyStage || directMatch?.examBoard) {
      suggestion.metadata = directMatch?.keyStage?.title ?? "Key stage 4";
      suggestion.links.push({
        keystageSlug: directMatch?.keyStage?.slug ?? "ks4",
        keystageTitle: directMatch?.keyStage?.title ?? "Key stage 4",
        examboardSlug: directMatch?.examBoard?.slug,
      });
    } else {
      const suggestedExamBoards = suggestedFilters.filter(
        (filter) => filter.type === "exam-board",
      );
      const suggestedKeystages = suggestedFilters.filter(
        (filter) => filter.type === "key-stage",
      );

      const suggestedKeystageLinks = suggestedKeystages.flatMap((filter) => {
        if (filter.slug === "ks4" && suggestedExamBoards.length > 0) {
          return suggestedExamBoards.map((examboard) => ({
            keystageSlug: filter.slug,
            keystageTitle: filter.title,
            examboardSlug: examboard.slug,
          }));
        }
        return {
          keystageSlug: filter.slug,
          keystageTitle: filter.title,
        };
      });
      suggestion.links = suggestedKeystageLinks;
    }
  }

  return suggestion;
}
