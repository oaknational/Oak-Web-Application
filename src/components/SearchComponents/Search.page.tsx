import { useRouter } from "next/router";
import { FC, useEffect } from "react";

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

  return (
    <Flex $background="white" $flexDirection={"column"}>
      <MaxWidth $ph={16}>
        <Grid $mt={48} $cg={16}>
          <GridArea $colSpan={[12, 12, 8]} $mt={24} $mb={24}>
            <Flex $flexDirection={["column"]} $mb={[48, 72]}>
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
            {shouldShowResults && (
              <SearchResults hits={results} allKeyStages={allKeyStages} />
            )}
          </GridArea>
          <GridArea $colSpan={[12, 3]} $pr={16}>
            <Flex $flexDirection="column" $mb={32} $display={["none", "flex"]}>
              <SearchFilters {...searchFilters} />
            </Flex>
            <Flex $mb={32}>
              <MobileFilters
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
          </GridArea>
        </Grid>
      </MaxWidth>
    </Flex>
  );
};

export default Search;
