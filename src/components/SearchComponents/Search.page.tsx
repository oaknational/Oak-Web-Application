import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import { Heading } from "../Typography";
import { SearchResultsItemProps } from "../SearchResultsItem/SearchResultsItem";

import { SearchProps } from "./search.page.types";

import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import Flex from "@/components/Flex";
import Grid, { GridArea } from "@/components/Grid";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import MobileFilters from "@/components/MobileFilters";
import SearchFilters from "@/components/SearchFilters";
import ActiveFilters from "@/components/SearchFilters/ActiveFilters";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import NoSearchResults from "@/components/SearchResults/NoSearchResults";
import { getSortedSearchFiltersSelected } from "@/context/Search/search.helpers";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

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

      track.searchCompleted({
        searchFilterOptionSelected: getSortedSearchFiltersSelected(
          router.query.keyStages,
        ),
        searchResultCount: hitCount,
        analyticsUseCase: analyticsUseCase,
        searchResultsStatus: status,
        searchResultsLoadTime: Math.floor(searchEndTime - searchStartTime),
      });
      setSearchStartTime(null);
    }
  }, [
    analyticsUseCase,
    hitCount,
    query.term,
    router.query.keyStages,
    router.query.page,
    searchStartTime,
    setSearchStartTime,
    status,
    track,
  ]);

  const searchResultClicked = ({
    searchHit,
    searchRank,
  }: {
    searchHit: SearchResultsItemProps;
    searchRank: number;
  }) => {
    if (searchHit) {
      track.searchResultClicked({
        keyStageSlug: searchHit.keyStageSlug || "",
        keyStageTitle: searchHit.keyStageTitle as KeyStageTitleValueType,
        subjectTitle: searchHit.subjectTitle,
        subjectSlug: searchHit.subjectSlug,
        unitName: searchHit.title.replace(/(<([^>]+)>)/gi, ""), // unit name without highlighting html tags,
        unitSlug: searchHit.buttonLinkProps.unitSlug,
        analyticsUseCase: analyticsUseCase,
        searchRank: searchRank,
        searchFilterOptionSelected: getSortedSearchFiltersSelected(
          router.query.keyStages,
        ),
        searchResultCount: hitCount,
        searchResultType: searchHit.type,
        lessonName: searchHit.title.replace(/(<([^>]+)>)/gi, ""),
        lessonSlug:
          searchHit.type === "lesson"
            ? searchHit.buttonLinkProps.lessonSlug
            : undefined,
      });
    }
  };

  return (
    <Flex $background="white" $flexDirection={"column"}>
      <MaxWidth $ph={16}>
        <Grid $mt={48} $cg={16}>
          <GridArea $colSpan={[12, 12, 7]} $mt={24}>
            <Flex $flexDirection={["column"]} $mb={[48, 72]}>
              <Heading tag="h1" $font={"heading-4"} $mb={32}>
                Search
              </Heading>
              <SearchForm
                searchTerm={query.term}
                placeholderText="Search by keyword or topic"
                handleSubmit={(value) => {
                  setSearchTerm(value);
                }}
                analyticsSearchSource={"search page search box"}
              />
            </Flex>
            <ActiveFilters searchFilters={searchFilters} />
          </GridArea>
          <GridArea $colSpan={[12, 9]} $pr={16}>
            <div role="status">
              {shouldShowError && (
                <p>There was an error fetching search results</p>
              )}
              {shouldShowLoading && <p>Loading...</p>}
              {shouldShowNoResultsMessage && (
                <NoSearchResults searchTerm={query.term} />
              )}
            </div>
            <Flex $mb={32}>
              <MobileFilters
                $mt={0}
                label="Filters"
                labelOpened="Close"
                iconOpened="cross"
                iconClosed="mini-menu"
                iconBackground="black"
                $alignSelf={"flex-start"}
              >
                <SearchFilters {...searchFilters} />
              </MobileFilters>
            </Flex>
            {shouldShowResults && (
              <SearchResults
                hits={results}
                allKeyStages={allKeyStages}
                searchResultClicked={(searchHit, searchRank) =>
                  searchResultClicked({
                    searchHit,
                    searchRank,
                  })
                }
              />
            )}
          </GridArea>
          <GridArea $colSpan={[12, 3]} $pr={16}>
            <Flex $flexDirection="column" $mb={32} $display={["none", "flex"]}>
              <SearchFilters {...searchFilters} />
            </Flex>
          </GridArea>
        </Grid>
      </MaxWidth>
    </Flex>
  );
};

export default Search;
