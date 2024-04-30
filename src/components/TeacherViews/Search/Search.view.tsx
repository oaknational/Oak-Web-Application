import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakFlex,
  OakSecondaryButton,
  OakP,
  isValidIconName,
  OakBox,
  OakSearchFilterCheckBox,
  OakSearchFilterCheckBoxProps,
} from "@oaknational/oak-components";

import { SearchProps } from "./search.view.types";
import { isKeyStageTitleValueType, removeHTMLTags } from "./helpers";

import { SearchResultsItemProps } from "@/components/TeacherComponents/SearchResultsItem";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import MobileFilters from "@/components/SharedComponents/MobileFilters";
import SearchFilters from "@/components/TeacherComponents/SearchFilters";
import SearchActiveFilters from "@/components/TeacherComponents/SearchActiveFilters";
import SearchForm from "@/components/SharedComponents/SearchForm";
import SearchResults from "@/components/TeacherComponents/SearchResults";
import NoSearchResults from "@/components/TeacherComponents/NoSearchResults";
import { getSortedSearchFiltersSelected } from "@/context/Search/search.helpers";
import { FilterTypeValueType } from "@/browser-lib/avo/Avo";

const Search: FC<SearchProps> = (props) => {
  const {
    query,
    setSearchTerm,
    status,
    results,
    allKeyStages,
    searchFilters,
    searchStartTime,
    setSearchStartTime,
  } = props;

  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const router = useRouter();

  const hitCount = results.length;

  const shouldShowError = status === "fail";
  const shouldShowLoading = status === "loading";
  const shouldShowNoResultsMessage = status === "success" && !hitCount;
  const shouldShowResults = status === "success" && hitCount > 0;

  useEffect(() => {
    if (query.term && status === "loading") {
      setSearchStartTime(performance.now());
    }
  }, [query.term, setSearchStartTime, status]);

  useEffect(() => {
    if (
      !router.query.page &&
      searchStartTime &&
      (status === "success" || status === "fail")
    ) {
      const searchEndTime = performance.now();

      track.searchResultsDisplayed({
        searchFilterOptionSelected: getSortedSearchFiltersSelected(
          router.query,
        ),
        searchResultCount: hitCount,
        analyticsUseCase: analyticsUseCase,
        context: "search",
        searchResultsLoadTime: Math.floor(searchEndTime - searchStartTime),
      });
      setSearchStartTime(null);
    }
  }, [
    analyticsUseCase,
    hitCount,
    query.term,
    router.query,
    searchStartTime,
    setSearchStartTime,
    status,
    track,
  ]);

  const searchResultExpanded = ({
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
      track.searchResultExpanded({
        context: "search",
        keyStageSlug: searchHit.keyStageSlug || "",
        keyStageTitle: searchHit.keyStageTitle,
        subjectTitle: searchHit.subjectTitle,
        subjectSlug: searchHit.subjectSlug,
        unitName:
          searchHit.type === "lesson"
            ? removeHTMLTags(searchHit.unitTitle)
            : removeHTMLTags(searchHit.title),
        unitSlug: searchHit.buttonLinkProps.unitSlug,
        searchRank: searchRank,
        searchFilterOptionSelected: getSortedSearchFiltersSelected(
          router.query,
        ),
        searchResultCount: hitCount,
        searchResultType: searchHit.type,
        lessonName: removeHTMLTags(searchHit.title),
        lessonSlug:
          searchHit.type === "lesson"
            ? searchHit.buttonLinkProps.lessonSlug
            : "",
      });
    }
  };

  const searchResultOpened = ({
    searchHit,
    searchRank,
  }: {
    searchHit: SearchResultsItemProps;
    searchRank: number;
  }) => {
    if (searchHit && isKeyStageTitleValueType(searchHit.keyStageTitle)) {
      track.searchResultOpened({
        keyStageSlug: searchHit.keyStageSlug || "",
        keyStageTitle: searchHit.keyStageTitle,
        subjectTitle: searchHit.subjectTitle,
        subjectSlug: searchHit.subjectSlug,
        unitName:
          searchHit.type === "lesson"
            ? removeHTMLTags(searchHit.unitTitle)
            : removeHTMLTags(searchHit.title),
        unitSlug: searchHit.buttonLinkProps.unitSlug,
        analyticsUseCase: analyticsUseCase,
        searchRank: searchRank,
        searchFilterOptionSelected: getSortedSearchFiltersSelected(
          router.query,
        ),
        searchResultCount: hitCount,
        searchResultType: searchHit.type,
        lessonName: removeHTMLTags(searchHit.title),
        lessonSlug:
          searchHit.type === "lesson"
            ? searchHit.buttonLinkProps.lessonSlug
            : null,
        context: "search",
      });
    }
  };

  const searchRefined = (
    filterType: FilterTypeValueType,
    filterValue: string,
  ) => {
    track.searchRefined({
      context: "search",
      searchResultCount: hitCount,
      filterType: filterType,
      filterValue: filterValue,
    });
  };

  const [filterButtonFocussed, setFilterButtonFocussed] = useState(false);

  return (
    <OakFlex $background="white" $flexDirection={"column"}>
      <MaxWidth $ph={16}>
        <OakGrid $mt={"space-between-l"} $cg={"all-spacing-4"}>
          <OakGridArea
            $colSpan={[12, 12, 7]}
            $colStart={1}
            $rowStart={1}
            $mt={"space-between-m"}
            $mb={"space-between-m"}
          >
            <OakFlex
              $flexDirection={["column"]}
              $mb={["space-between-l", "space-between-xxl"]}
            >
              <OakHeading tag="h1" $font={"heading-4"} $mb="space-between-m2">
                Search
              </OakHeading>
              <SearchForm
                searchContext="search"
                searchTerm={query.term}
                placeholderText="Search by keyword or topic"
                handleSubmit={(value) => {
                  setSearchTerm(value);
                }}
                analyticsSearchSource={"search page search box"}
              />
              <OakBox $mt={"space-between-m2"}>
                <OakFlex
                  $gap={"space-between-xs"}
                  $flexWrap={"wrap"}
                  $position={"absolute"}
                  $zIndex={"modal-close-button"}
                >
                  {searchFilters.contentTypeFilters
                    .map((contentTypeFilter) => {
                      const icon = isValidIconName(
                        `teacher-${contentTypeFilter.slug}`,
                      )
                        ? (`teacher-${contentTypeFilter.slug}` as OakSearchFilterCheckBoxProps["icon"])
                        : undefined;

                      return (
                        <OakSearchFilterCheckBox
                          name={"typeFilters"}
                          displayValue={contentTypeFilter.title}
                          key={`search-filters-type-${contentTypeFilter.slug}`}
                          aria-label={`${contentTypeFilter.title} filter`}
                          id={`search-filters-type-${contentTypeFilter.slug}`}
                          icon={icon}
                          value={"Content type filter"}
                          keepIconColor={true}
                          {...contentTypeFilter}
                          onChange={() => {
                            contentTypeFilter.onChange();
                            searchRefined(
                              "Content type filter",
                              contentTypeFilter.title,
                            );
                          }}
                        />
                      );
                    })
                    .reverse()}
                </OakFlex>
                <OakFlex $mb="space-between-m2">
                  <MobileFilters
                    $mt={0}
                    label="Filters"
                    labelOpened="Close"
                    iconOpened="cross"
                    iconClosed="mini-menu"
                    iconBackground="black"
                    $alignSelf={"flex-end"}
                  >
                    <OakBox $mt={["space-between-m", null, null]}>
                      <SearchFilters
                        {...searchFilters}
                        searchRefined={searchRefined}
                        isMobileFilter
                      />
                    </OakBox>
                  </MobileFilters>
                </OakFlex>
              </OakBox>
            </OakFlex>
            <SearchActiveFilters searchFilters={searchFilters} />
          </OakGridArea>
          <OakGridArea
            $colSpan={[12, 3]}
            $colStart={[1, 10]}
            $rowStart={2}
            $pr={"inner-padding-m"}
          >
            <OakFlex
              $flexDirection="column"
              $mb="space-between-m2"
              $display={["none", "flex"]}
            >
              <OakFlex
                $mb="space-between-s"
                $flexDirection="column"
                $gap="space-between-ssx"
              >
                <OakHeading tag="h2" $font="heading-6">
                  Filters
                </OakHeading>
                <OakSecondaryButton
                  element="a"
                  href="#search-results"
                  onFocus={() => setFilterButtonFocussed(true)}
                  onBlur={() => setFilterButtonFocussed(false)}
                  style={
                    filterButtonFocussed
                      ? {}
                      : { position: "absolute", top: "-500px" }
                  }
                >
                  Skip to results
                </OakSecondaryButton>
              </OakFlex>
              <SearchFilters {...searchFilters} searchRefined={searchRefined} />
            </OakFlex>
          </OakGridArea>
          <OakGridArea
            $colSpan={[12, 9]}
            $colStart={1}
            $rowStart={2}
            $pr={"inner-padding-m"}
          >
            <div role="status" aria-live="polite">
              {shouldShowError && (
                <p>There was an error fetching search results</p>
              )}
              {shouldShowLoading && <p>Loading...</p>}
              {shouldShowNoResultsMessage && (
                <NoSearchResults searchTerm={query.term} />
              )}
              {shouldShowResults && (
                <OakP $mb={"space-between-ssx"}>
                  Showing {results.length} result
                  {results.length === 1 ? "" : "s"}
                </OakP>
              )}
            </div>

            {shouldShowResults && (
              <SearchResults
                hits={results}
                allKeyStages={allKeyStages}
                searchResultExpanded={(searchHit, searchRank) =>
                  searchResultExpanded({
                    searchHit,
                    searchRank,
                  })
                }
                searchResultOpened={(searchHit, searchRank) =>
                  searchResultOpened({
                    searchHit,
                    searchRank,
                  })
                }
              />
            )}
          </OakGridArea>
        </OakGrid>
      </MaxWidth>
    </OakFlex>
  );
};

export default Search;
