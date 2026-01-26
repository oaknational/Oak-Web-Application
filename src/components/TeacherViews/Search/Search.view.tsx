import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakFlex,
  OakSecondaryButton,
  OakP,
  OakBox,
  OakMaxWidth,
  OakLoadingSpinner,
  OakSpan,
} from "@oaknational/oak-components";
import styled from "styled-components";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { SearchProps } from "./search.view.types";
import {
  isKeyStageTitleValueType,
  removeHTMLTags,
  trackSearchModified,
} from "./helpers";
import { ContentFilterToggle } from "./ContentFilterToggle";

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
import MiniDropDown from "@/components/TeacherComponents/MiniDropdown";
import SearchSuggestedFilters from "@/components/TeacherComponents/SearchSuggestedFilters/SearchSuggestedFilters";
import { useSuggestedFilters } from "@/context/Search/useSuggestedFilters";
import { SearchSuggestionBanner } from "@/components/TeacherComponents/SearchSuggestionBanner/SearchSuggestionBanner";
import DelayedLoadingContainer from "@/components/SharedComponents/DelayedLoadingContainer";
import { srOnlyCss } from "@/components/SharedComponents/ScreenReaderOnly";

const CustomWidthFlex = styled(OakFlex)`
  max-width: 300px;
`;

// Skip to results is visually hidden until focused
const SkipToResultsButton = styled(OakSecondaryButton)`
  &:not(:focus-within) {
    ${srOnlyCss};
  }
`;

const DelayedLoadingSpinnerWithLabel: FC<{
  label: string;
  delay?: number;
  "data-testid"?: string;
}> = ({ label, delay = 1000, "data-testid": dataTestId }) => (
  <DelayedLoadingContainer
    delay={delay}
    $flexDirection="row"
    $alignItems="center"
    data-testid={dataTestId}
  >
    <OakSpan $mr="spacing-4" $textAlign="center">
      {label}
    </OakSpan>
    <OakLoadingSpinner />
  </DelayedLoadingContainer>
);

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
    setQuery,
  } = props;
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const router = useRouter();
  const hitCount = results.length;

  const shouldShowError = status === "fail";
  const shouldShowLoading = status === "loading";
  const shouldShowNoResultsMessage = status === "success" && !hitCount;
  const shouldShowResults = status === "success" && hitCount > 0;

  const isAiExperimentSearchEnabled =
    useFeatureFlagVariantKey("ai-experiment-search") === "search-with-ai";

  const suggestedFilters = useSuggestedFilters({
    term: query.term,
    enabled: Boolean(isAiExperimentSearchEnabled),
  });
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

  const searchFilterOptionSelected = getSortedSearchFiltersSelected(
    router.query,
  );

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
        searchFilterOptionSelected,
        searchResultCount: hitCount,
        searchResultType: searchHit.type,
        lessonName,
        lessonSlug,
        lessonReleaseDate: searchHit.legacy ? "2020-2023" : "2023-2026",
        lessonReleaseCohort: searchHit.legacy ? "2020-2023" : "2023-2026",
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
        lessonReleaseDate: searchHit.legacy ? "2020-2023" : "2023-2026",
        lessonReleaseCohort: searchHit.legacy ? "2020-2023" : "2023-2026",
      });
    }
  };

  const renderAiExperimentFilters = () => {
    if (!shouldShowResults) {
      return null;
    }

    const renderAllFilters = () => {
      if (suggestedFilters.status === "success") {
        return (
          <MiniDropDown label="All filters">
            <OakBox $pt="spacing-16">
              <SearchFilters
                {...searchFilters}
                trackSearchModified={trackSearchModified(
                  query.term,
                  track.searchFilterModified,
                )}
              />
            </OakBox>
          </MiniDropDown>
        );
      }

      if (suggestedFilters.status === "loading") {
        return null;
      }

      return (
        <SearchFilters
          {...searchFilters}
          trackSearchModified={trackSearchModified(
            query.term,
            track.searchFilterModified,
          )}
        />
      );
    };

    return (
      <>
        {suggestedFilters.status === "loading" && (
          <DelayedLoadingSpinnerWithLabel label="Loading filters" />
        )}
        <SearchSuggestedFilters
          setQuery={setQuery}
          query={query}
          searchFilters={suggestedFilters.searchFilters}
          trackSearchModified={trackSearchModified(
            query.term,
            track.searchFilterModified,
          )}
        />
        {renderAllFilters()}
      </>
    );
  };

  return (
    <OakFlex
      $minHeight={"100vh"}
      $background="bg-primary"
      $flexDirection={"column"}
    >
      <OakMaxWidth $ph={"spacing-16"}>
        <OakGrid $mt={"spacing-48"} $cg={"spacing-16"}>
          <OakGridArea
            $colSpan={[12, 12, 7]}
            $colStart={1}
            $rowStart={1}
            $mt={["spacing-0", "spacing-24"]}
            $mb={["spacing-8", "spacing-8", "spacing-48"]}
          >
            <OakFlex
              $flexDirection={["column"]}
              $mb={["spacing-24", "spacing-32"]}
              $pt={["spacing-0", "spacing-24"]}
            >
              <OakBox $display={["none", "block"]}>
                <OakHeading tag="h1" $font={"heading-4"} $mb="spacing-32">
                  Search
                </OakHeading>
              </OakBox>
              <OakBox $pv={["spacing-56", "spacing-0"]}>
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

              {!isAiExperimentSearchEnabled && (
                <OakFlex
                  $mt={["spacing-0", "spacing-32"]}
                  $alignItems={"center"}
                  $display={["flex", "none", "none"]}
                >
                  <ContentFilterToggle
                    contentTypeFilters={searchFilters.contentTypeFilters}
                    idSuffix="mobile"
                    trackSearchModified={(checked, filterType, filterValue) =>
                      trackSearchModified(
                        query.term,
                        track.searchFilterModified,
                      )({
                        checked,
                        filterType,
                        filterValue,
                        searchFilterMatchType: "default",
                      })
                    }
                  />
                  <OakBox
                    $position={"absolute"}
                    $width={"100%"}
                    $ph={"spacing-16"}
                    $right={"spacing-0"}
                    $pointerEvents={"none"}
                  >
                    <MobileFilters
                      $mt={"spacing-0"}
                      label="Filters"
                      labelOpened="Close"
                      iconOpened="cross"
                      iconClosed="filter"
                    >
                      <OakBox $mt={["spacing-24", null, null]}>
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
                  </OakBox>
                </OakFlex>
              )}
            </OakFlex>
            {isAiExperimentSearchEnabled && (
              <OakBox
                $display={["block", "block", "none"]}
                $mb="spacing-12"
                $ph={["spacing-0", "spacing-0", "spacing-24"]}
              >
                {renderAiExperimentFilters()}
              </OakBox>
            )}
            <OakBox
              $height={["spacing-0", "spacing-0", "spacing-4"]}
              $mb={["spacing-48", "spacing-16"]}
            >
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
            <OakGridArea $colSpan={[12, 3]} $colStart={[1, 1]} $rowStart={2}>
              <CustomWidthFlex
                $flexDirection="column"
                $mb="spacing-32"
                $display={[
                  "none",
                  isAiExperimentSearchEnabled ? "none" : "flex",
                  "flex",
                ]}
              >
                {isAiExperimentSearchEnabled ? (
                  renderAiExperimentFilters()
                ) : (
                  <>
                    <OakFlex
                      $mb="spacing-16"
                      $flexDirection="column"
                      $gap="spacing-8"
                    >
                      <OakHeading tag="h2" $font="heading-6">
                        Filters
                      </OakHeading>
                      <SkipToResultsButton element="a" href="#search-results">
                        Skip to results
                      </SkipToResultsButton>
                    </OakFlex>
                    <SearchFilters
                      {...searchFilters}
                      isMobileFilter={false}
                      trackSearchModified={trackSearchModified(
                        query.term,
                        track.searchFilterModified,
                      )}
                    />
                  </>
                )}
              </CustomWidthFlex>
            </OakGridArea>
          )}
          <OakGridArea
            $colSpan={[12, isAiExperimentSearchEnabled ? 12 : 7, 7]}
            $colStart={[1, isAiExperimentSearchEnabled ? 1 : 5, 5]}
            $rowStart={2}
          >
            <OakBox role="status" aria-live="polite">
              {shouldShowError && (
                <p>There was an error fetching search results</p>
              )}
              {shouldShowLoading && (
                <DelayedLoadingSpinnerWithLabel
                  data-testid="loading"
                  label="Loading results"
                  delay={1000}
                />
              )}
              {shouldShowNoResultsMessage && (
                <OakBox id="search-results" $mb={"spacing-72"}>
                  <NoSearchResults searchTerm={query.term} />
                  <OakBox $mt="spacing-24">
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
                <OakFlex
                  $flexDirection="column"
                  $gap={["spacing-16", "spacing-16", "spacing-56"]}
                >
                  <OakFlex
                    $flexDirection={"column"}
                    $gap={"spacing-24"}
                    $display={[
                      "none",
                      isAiExperimentSearchEnabled ? "none" : "flex",
                      "flex",
                    ]}
                    $pl="spacing-24"
                  >
                    <ContentFilterToggle
                      contentTypeFilters={searchFilters.contentTypeFilters}
                      idSuffix="desktop"
                      trackSearchModified={(checked, filterType, filterValue) =>
                        trackSearchModified(
                          query.term,
                          track.searchFilterModified,
                        )({
                          checked,
                          filterType,
                          filterValue,
                          searchFilterMatchType: "default",
                        })
                      }
                    />
                    <OakP $font={"heading-light-7"}>
                      Showing {results.length} result
                      {results.length === 1 ? "" : "s"}
                    </OakP>
                    <SearchSuggestionBanner
                      intent={suggestedFilters.data}
                      searchTrackingData={{
                        searchResultCount: hitCount,
                        searchFilterOptionSelected,
                      }}
                    />
                  </OakFlex>
                  <OakBox
                    $display={[
                      "block",
                      isAiExperimentSearchEnabled ? "block" : "none",
                      "none",
                    ]}
                  >
                    <SearchSuggestionBanner
                      intent={suggestedFilters.data}
                      searchTrackingData={{
                        searchResultCount: hitCount,
                        searchFilterOptionSelected,
                      }}
                    />
                  </OakBox>
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
                </OakFlex>
              )}
            </OakBox>
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
    </OakFlex>
  );
};

export default Search;
