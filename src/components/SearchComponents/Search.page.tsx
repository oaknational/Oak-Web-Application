import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import useAnalytics from "../../context/Analytics/useAnalytics";
import useAnalyticsPageProps from "../../hooks/useAnalyticsPageProps";
import Box from "../Box";
import Card from "../Card";
import Flex from "../Flex";
import Grid, { GridArea } from "../Grid";
import MaxWidth from "../MaxWidth/MaxWidth";
import MobileFilters from "../MobileFilters";
import SearchFilters from "../SearchFilters";
import ActiveFilters from "../SearchFilters/ActiveFilters";
import SearchForm from "../SearchForm";
import SearchResults from "../SearchResults";
import NoSearchResults from "../SearchResults/NoSearchResults";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import { Heading } from "../Typography";
import { SearchResultsItemProps } from "../SearchResultsItem/SearchResultsItem";

import { SearchProps } from "./search.page.types";

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
          <GridArea $colSpan={[12, 12, 12]} $mt={24} $mb={24}>
            <Flex $flexDirection={["column"]}>
              {query.term ? (
                <Heading
                  tag={"h1"}
                  $font={["heading-5", "heading-4"]}
                  $mt={24}
                  $wordWrap={"break-word"}
                >
                  &ldquo;{query.term}&rdquo;
                </Heading>
              ) : (
                <Heading tag={"h1"} $font={["heading-5", "heading-4"]} $mt={24}>
                  Search
                </Heading>
              )}
              <Heading tag="h2" $font={"heading-light-6"} $mt={24}>
                Search for topics and key words to explore thousands of lessons
                with adaptable teaching resources
              </Heading>
              <Card
                $background={"lemon50"}
                $width={"100%"}
                $pv={[24]}
                $ph={[16, 24]}
                $mt={24}
                $mb={20}
                $position={"relative"}
              >
                <SearchForm
                  searchTerm={query.term}
                  placeholderText="Search by keyword or topic"
                  handleSubmit={(value) => {
                    setSearchTerm(value);
                  }}
                  analyticsSearchSource={"search page search box"}
                />
                <BrushBorders color={"lemon50"} />
              </Card>
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
            <Box $mb={32}>
              <MobileFilters
                label="Filters"
                labelOpened="Close"
                iconOpened="cross"
                iconClosed="hamburger"
              >
                <SearchFilters {...searchFilters} />
              </MobileFilters>
            </Box>
          </GridArea>
        </Grid>
      </MaxWidth>
    </Flex>
  );
};

export default Search;
