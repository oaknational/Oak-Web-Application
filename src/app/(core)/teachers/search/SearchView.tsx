"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakFlex,
  OakSecondaryButton,
  OakP,
  OakBox,
  OakMaxWidth,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { trackSearchModified } from "./helpers";
import { useUpdateSearchQuery } from "./helpers/useUpdateSearchQuery";
import { useSearchTracking } from "./useSearchTracking";

import { SearchViewProps } from "@/components/TeacherViews/Search/search.view.types";
import { ContentFilterToggle } from "@/components/TeacherViews/Search/ContentFilterToggle";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import MobileFilters from "@/components/SharedComponents/MobileFilters";
import SearchFilters from "@/components/TeacherComponents/SearchFilters";
import SearchForm from "@/components/SharedComponents/SearchForm";
import SearchResults from "@/components/TeacherComponents/SearchResults";
import NoSearchResults from "@/components/TeacherComponents/NoSearchResults";
import SignPostToAila from "@/components/TeacherComponents/NoSearchResults/SignPostToAila";
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

const SearchView: FC<SearchViewProps> = (props) => {
  const { query, status, results, timeTaken, allKeyStages, searchFilters } =
    props;
  const track = useTeacherBrowseAnalytics((store) => store.track);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { updateSearchTerm } = useUpdateSearchQuery();
  const hitCount = results.length;

  const shouldShowError = status === "fail";
  const shouldShowNoResultsMessage = status === "success" && !hitCount;
  const shouldShowResults = status === "success" && hitCount > 0;

  const { searchResultExpanded, searchResultOpened } = useSearchTracking({
    query,
    status,
    results,
    timeTaken,
  });

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
                  handleSubmit={({ searchTerm }) => {
                    updateSearchTerm({
                      searchTerm,
                    });
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

export default SearchView;
