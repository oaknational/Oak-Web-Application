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
  OakMaxWidth,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { SearchProps } from "./search.view.types";
import {
  isKeyStageTitleValueType,
  removeHTMLTags,
  trackSearchModified,
} from "./helpers";

import { SearchResultsItemProps } from "@/components/TeacherComponents/SearchResultsItem";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import MobileFilters from "@/components/SharedComponents/MobileFilters";
import SearchFilters from "@/components/TeacherComponents/SearchFilters";
import SearchActiveFilters from "@/components/TeacherComponents/SearchActiveFilters";
import SearchForm from "@/components/SharedComponents/SearchForm";
import SearchResults from "@/components/TeacherComponents/SearchResults";
import NoSearchResults from "@/components/TeacherComponents/NoSearchResults";
import {
  getActiveFilters,
  getSortedSearchFiltersSelected,
} from "@/context/Search/search.helpers";
import SignPostToAila from "@/components/TeacherComponents/NoSearchResults/SignPostToAila";

const CustomWidthFlex = styled(OakFlex)`
  max-width: 300px;
`;

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
    const searchHasFilters =
      router.query.keyStages ||
      router.query.examBoards ||
      router.query.contentTypes ||
      router.query.subjects ||
      router.query.yearGroups ||
      router.query.curriculum;

    if (
      !router.query.page &&
      searchStartTime &&
      (status === "success" || status === "fail")
    ) {
      if (!searchHasFilters) {
        const searchEndTime = performance.now();
        track.searchAccessed({
          searchTerm: query.term,
          platform: "owa",
          product: "teacher lesson resources",
          engagementIntent: "refine",
          componentType: "search_button",
          eventVersion: "2.0.0",
          analyticsUseCase: "Teacher",
          searchResultCount: hitCount,
          searchResultsLoadTime: Math.floor(searchEndTime - searchStartTime),
        });
        setSearchStartTime(null);
      } else {
        track.searchRefined({
          platform: "owa",
          product: "teacher lesson resources",
          engagementIntent: "refine",
          componentType: "filter_link",
          eventVersion: "2.0.0",
          analyticsUseCase: "Teacher",
          searchResultCount: hitCount,
          activeFilters: getActiveFilters(router.query),
          searchTerm: query.term,
        });
      }
    }
  }, [
    analyticsUseCase,
    hitCount,
    query.term,
    router,
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
      const lessonName =
        searchHit.type === "lesson" ? removeHTMLTags(searchHit.title) : "";
      const lessonSlug =
        searchHit.type === "lesson" ? searchHit.buttonLinkProps.lessonSlug : "";
      const unitName =
        searchHit.type === "lesson"
          ? removeHTMLTags(searchHit.unitTitle)
          : removeHTMLTags(searchHit.title);

      track.searchResultExpanded({
        analyticsUseCase: analyticsUseCase,
        componentType: "search_result_item",
        engagementIntent: "refine",
        eventVersion: "2.0.0",
        platform: "owa",
        product: "teacher lesson resources",
        context: "search",
        keyStageSlug: searchHit.keyStageSlug,
        keyStageTitle: searchHit.keyStageTitle,
        subjectTitle: searchHit.subjectTitle,
        subjectSlug: searchHit.subjectSlug,
        unitName,
        unitSlug: searchHit.buttonLinkProps.unitSlug,
        searchRank: searchRank,
        searchFilterOptionSelected: getSortedSearchFiltersSelected(
          router.query,
        ),
        searchResultCount: hitCount,
        searchResultType: searchHit.type,
        lessonName,
        lessonSlug,
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

  const [filterButtonFocussed, setFilterButtonFocussed] = useState(false);

  return (
    <OakFlex $background="white" $flexDirection={"column"}>
      <OakMaxWidth $ph={"inner-padding-m"}>
        <OakGrid $mt={"space-between-l"} $cg={"all-spacing-4"}>
          <OakGridArea
            $colSpan={[12, 12, 7]}
            $colStart={1}
            $rowStart={1}
            $mt={["space-between-none", "space-between-m"]}
            $mb={"space-between-ssx"}
          >
            <OakFlex
              $flexDirection={["column"]}
              $mb={["space-between-m", "space-between-m2"]}
              $pa={["inner-padding-none", "inner-padding-xl"]}
            >
              <OakBox $display={["none", "block"]}>
                <OakHeading tag="h1" $font={"heading-4"} $mb="space-between-m2">
                  Search
                </OakHeading>
              </OakBox>
              <OakBox $pv={["inner-padding-xl5", "inner-padding-none"]}>
                <SearchForm
                  searchContext="search"
                  searchTerm={query.term}
                  placeholderText="Search by keyword or topic"
                  handleSubmit={(value) => {
                    setSearchTerm(value);
                  }}
                  analyticsSearchSource={"search page search box"}
                />
              </OakBox>

              <OakBox $mt={["space-between-none", "space-between-m2"]}>
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
                            trackSearchModified(
                              query.term,
                              track.searchFilterModified,
                            )({
                              checked: contentTypeFilter.checked,
                              filterType: "Content type filter",
                              filterValue: contentTypeFilter.slug,
                            });
                            contentTypeFilter.onChange();
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
                        isMobileFilter
                        trackSearchModified={trackSearchModified(
                          query.term,
                          track.searchFilterModified,
                        )}
                      />
                    </OakBox>
                  </MobileFilters>
                </OakFlex>
              </OakBox>
            </OakFlex>
            <OakBox $pl={["inner-padding-none", "inner-padding-xl"]}>
              <SearchActiveFilters
                searchFilters={searchFilters}
                trackSearchModified={trackSearchModified(
                  query.term,
                  track.searchFilterModified,
                )}
              />
            </OakBox>
          </OakGridArea>
          {!shouldShowNoResultsMessage && (
            <OakGridArea $colSpan={[12, 3]} $colStart={[1, 10]} $rowStart={2}>
              <CustomWidthFlex
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
                        : { position: "absolute", top: "-600px" }
                    }
                  >
                    Skip to results
                  </OakSecondaryButton>
                </OakFlex>
                <SearchFilters
                  {...searchFilters}
                  trackSearchModified={trackSearchModified(
                    query.term,
                    track.searchFilterModified,
                  )}
                />
              </CustomWidthFlex>
            </OakGridArea>
          )}
          <OakGridArea
            $colSpan={[12, 9]}
            $colStart={1}
            $rowStart={2}
            $pr={"inner-padding-m"}
          >
            <OakBox role="status" aria-live="polite" $pl="inner-padding-xl">
              {shouldShowError && (
                <p>There was an error fetching search results</p>
              )}
              {shouldShowLoading && <p>Loading...</p>}
              {shouldShowNoResultsMessage && (
                <OakBox id="search-results" $mb={"space-between-xxl"}>
                  <NoSearchResults searchTerm={query.term} />
                  <OakBox $mt="space-between-m">
                    <SignPostToAila
                      title="Can't find what you need?"
                      text="Create a tailor-made lesson plan and resources on any topic with Aila, our free AI-powered lesson assistant. Entirely adaptable to your class and context."
                      searchExpression={query.term}
                      keyStage={
                        query.keyStages?.length === 1 ? query.keyStages[0] : ""
                      }
                      subject={
                        query.subjects?.length === 1 ? query.subjects[0] : ""
                      }
                    />
                  </OakBox>
                </OakBox>
              )}
              {shouldShowResults && (
                <OakBox $display={["none", "block"]}>
                  <OakP $mb={"space-between-xxl"}>
                    Showing {results.length} result
                    {results.length === 1 ? "" : "s"}
                  </OakP>
                </OakBox>
              )}
            </OakBox>

            {shouldShowResults && (
              <SearchResults
                hits={results}
                allKeyStages={allKeyStages}
                query={query}
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
      </OakMaxWidth>
    </OakFlex>
  );
};

export default Search;
