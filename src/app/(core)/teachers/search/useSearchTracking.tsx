import { useRef, useEffect } from "react";

import {
  getActiveFilters,
  getSortedSearchFiltersSelected,
  isKeyStageTitleValueType,
  removeHTMLTags,
} from "./helpers";

import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { SearchViewProps } from "@/components/TeacherViews/Search/search.view.types";
import { SearchResultsItemProps } from "@/components/TeacherComponents/SearchResultsItem";

export const useSearchTracking = ({
  status,
  query,
  results,
  timeTaken,
}: Pick<SearchViewProps, "query" | "results" | "status" | "timeTaken">) => {
  // Ensure we're only tracking refined or accessed once per search request
  const lastTrackedSearch = useRef<string | null>(null);
  const {
    searchAccessed,
    searchRefined,
    searchResultExpanded,
    searchResultOpened,
  } = useTeacherBrowseAnalytics((store) => store.track);

  useEffect(() => {
    if (status !== "success") return;

    const activeFilters = getActiveFilters(query);
    const resultKey = JSON.stringify([query.term, activeFilters]);

    if (lastTrackedSearch.current === resultKey) return;
    lastTrackedSearch.current = resultKey;

    // Track SearchAccessed for a first search, ie. without filters
    // Track SearchRefined for a search that has been refined with filters
    const hasFilters = Object.entries(activeFilters).length > 0;
    if (hasFilters) {
      searchRefined({
        searchResultCount: results.length,
        searchTerm: query.term,
        componentType: "filter_link",
        activeFilters,
      });
    } else {
      searchAccessed({
        searchResultCount: results.length,
        searchResultsLoadTime: timeTaken,
        searchTerm: query.term,
        componentType: "search_button",
      });
    }
  }, [query, status, results, timeTaken, searchAccessed, searchRefined]);

  const trackSearchResultExpanded = ({
    searchHit,
    searchRank,
  }: {
    searchHit: SearchResultsItemProps;
    searchRank: number;
  }) => {
    if (
      searchHit.isToggleOpen &&
      isKeyStageTitleValueType(searchHit.keyStageTitle)
    ) {
      const lessonName =
        searchHit.type === "lesson" ? removeHTMLTags(searchHit.title) : "";
      const lessonSlug =
        searchHit.type === "lesson" ? searchHit.buttonLinkProps.lessonSlug : "";
      const unitName =
        searchHit.type === "lesson"
          ? removeHTMLTags(searchHit.unitTitle)
          : removeHTMLTags(searchHit.title);
      const searchFilterOptionSelected = getSortedSearchFiltersSelected(query);

      searchResultExpanded({
        searchRank: searchRank,
        searchFilterOptionSelected,
        searchResultCount: results.length,
        searchResultType: searchHit.type,
        searchResultContext: {
          keyStageSlug: searchHit.keyStageSlug,
          keyStageTitle: searchHit.keyStageTitle,
          subjectTitle: searchHit.subjectTitle,
          subjectSlug: searchHit.subjectSlug,
          unitName,
          unitSlug: searchHit.buttonLinkProps.unitSlug,
          lessonName,
          lessonSlug,
          lessonReleaseDate: searchHit.legacy ? "2020-2023" : "2023-2026",
          lessonReleaseCohort: searchHit.legacy ? "2020-2023" : "2023-2026",
        },
      });
    }
  };

  const trackSearchResultOpened = ({
    searchHit,
    searchRank,
  }: {
    searchHit: SearchResultsItemProps;
    searchRank: number;
  }) => {
    if (searchHit && isKeyStageTitleValueType(searchHit.keyStageTitle)) {
      searchResultOpened({
        searchRank: searchRank,
        searchFilterOptionSelected: getSortedSearchFiltersSelected(query),
        searchResultCount: results.length,
        searchResultType: searchHit.type,
        searchResultContext: {
          keyStageSlug: searchHit.keyStageSlug || "",
          keyStageTitle: searchHit.keyStageTitle,
          subjectTitle: searchHit.subjectTitle,
          subjectSlug: searchHit.subjectSlug,
          unitName:
            searchHit.type === "lesson"
              ? removeHTMLTags(searchHit.unitTitle)
              : removeHTMLTags(searchHit.title),
          unitSlug: searchHit.buttonLinkProps.unitSlug,
          lessonName: removeHTMLTags(searchHit.title),
          lessonSlug:
            searchHit.type === "lesson"
              ? searchHit.buttonLinkProps.lessonSlug
              : null,
          lessonReleaseDate: searchHit.legacy ? "2020-2023" : "2023-2026",
          lessonReleaseCohort: searchHit.legacy ? "2020-2023" : "2023-2026",
        },
      });
    }
  };

  return {
    searchResultExpanded: trackSearchResultExpanded,
    searchResultOpened: trackSearchResultOpened,
  };
};
