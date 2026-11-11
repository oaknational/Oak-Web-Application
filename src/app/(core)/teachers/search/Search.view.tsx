import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useMemo } from "react";
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

import {
  getActiveFilters,
  getSortedSearchFiltersSelected,
  isKeyStageTitleValueType,
  removeHTMLTags,
  trackSearchModified,
} from "./helpers";

import { SearchProps } from "@/components/TeacherViews/Search/search.view.types";
import { ContentFilterToggle } from "@/components/TeacherViews/Search/ContentFilterToggle";
import { SearchResultsItemProps } from "@/components/TeacherComponents/SearchResultsItem";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import MobileFilters from "@/components/SharedComponents/MobileFilters";
import SearchFilters from "@/components/TeacherComponents/SearchFilters";
import SearchForm from "@/components/SharedComponents/SearchForm";
import SearchResults from "@/components/TeacherComponents/SearchResults";
import NoSearchResults from "@/components/TeacherComponents/NoSearchResults";
import SignPostToAila from "@/components/TeacherComponents/NoSearchResults/SignPostToAila";
import DelayedLoadingContainer from "@/components/SharedComponents/DelayedLoadingContainer";
import { srOnlyCss } from "@/components/SharedComponents/ScreenReaderOnly";
import SearchActiveFilters from "@/components/TeacherComponents/SearchActiveFilters";

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
  } = props;
  const track = useTeacherBrowseAnalytics((store) => store.track);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hitCount = results.length;

  const searchQueryParams = useMemo(() => {
    const getParam = (param: string) =>
      searchParams?.get(param)?.trim() || undefined;
    return {
      keyStages: getParam("keyStages"),
      examBoards: getParam("examBoards"),
      contentTypes: getParam("contentTypes"),
      subjects: getParam("subjects"),
      yearGroups: getParam("yearGroups"),
      curriculum: getParam("curriculum"),
      page: getParam("page"),
    };
  }, [searchParams]);

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
      searchQueryParams.keyStages ||
      searchQueryParams.examBoards ||
      searchQueryParams.contentTypes ||
      searchQueryParams.subjects ||
      searchQueryParams.yearGroups ||
      searchQueryParams.curriculum;

    if (
      !searchQueryParams.page &&
      searchStartTime &&
      (status === "success" || status === "fail")
    ) {
      if (searchHasFilters) {
        track.searchRefined({
          componentType: "filter_link",
          searchResultCount: hitCount,
          activeFilters: getActiveFilters(searchQueryParams),
          searchTerm: query.term,
        });
      } else {
        const searchEndTime = performance.now();
        track.searchAccessed({
          searchTerm: query.term,
          componentType: "search_button",
          searchResultCount: hitCount,
          searchResultsLoadTime: Math.floor(searchEndTime - searchStartTime),
        });
        setSearchStartTime(null);
      }
    }
  }, [
    hitCount,
    query.term,
    searchQueryParams,
    searchStartTime,
    setSearchStartTime,
    status,
    track,
  ]);

  const searchFilterOptionSelected =
    getSortedSearchFiltersSelected(searchQueryParams);

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
        searchRank: searchRank,
        searchFilterOptionSelected,
        searchResultCount: hitCount,
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

  const searchResultOpened = ({
    searchHit,
    searchRank,
  }: {
    searchHit: SearchResultsItemProps;
    searchRank: number;
  }) => {
    if (searchHit && isKeyStageTitleValueType(searchHit.keyStageTitle)) {
      track.searchResultOpened({
        searchRank: searchRank,
        searchFilterOptionSelected:
          getSortedSearchFiltersSelected(searchQueryParams),
        searchResultCount: hitCount,
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
                    hasShowResultsButton={true}
                  >
                    <OakBox>
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
            </OakFlex>
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
                $display={["none", "flex", "flex"]}
              >
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
              </CustomWidthFlex>
            </OakGridArea>
          )}
          <OakGridArea
            $colSpan={[12, 7, 7]}
            $colStart={[1, 5, 5]}
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
                    $display={["none", "flex", "flex"]}
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
                  </OakFlex>
                  <SearchResults
                    hits={results}
                    allKeyStages={allKeyStages}
                    query={query}
                    paginationNavigation={{
                      route: pathname || "/",
                      searchParams,
                      push: (url: string) => router?.push(url),
                    }}
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
