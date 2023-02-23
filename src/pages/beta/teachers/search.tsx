import React, { useEffect } from "react";
import { NextPage } from "next";

import { DEFAULT_SEO_PROPS } from "../../../browser-lib/seo/Seo";
import useFetchSearchResults from "../../../context/Search/useFetchSearchResults";
import { useSearchQuery } from "../../../context/Search/SearchContext";
import AppLayout from "../../../components/AppLayout";
import SearchResults from "../../../components/SearchResults";
import SearchFilters from "../../../components/SearchFilters";
import ActiveFilters from "../../../components/SearchFilters/ActiveFilters";
import Grid, { GridArea } from "../../../components/Grid";
import Flex from "../../../components/Flex";
import Box from "../../../components/Box";
import MaxWidth from "../../../components/MaxWidth/MaxWidth";
import MobileFilters from "../../../components/MobileFilters";
import { Heading } from "../../../components/Typography";
import Card from "../../../components/Card";
import SearchForm from "../../../components/SearchForm";
import BrushBorders from "../../../components/SpriteSheet/BrushSvgs/BrushBorders";

interface CommonProps {
  id: number;
  slug: string;
  title: string;
  subject_title: string;
  subject_slug: string;
  key_stage_title: string;
  key_stage_slug: string;
  is_specialist: boolean | null;
  is_sensitive: boolean;
  theme_title: string;
  expired: boolean | null;
}

type LessonSource = {
  type: "lesson";
  lesson_description: string;
  topic_title: string;
  topic_slug: string;
  year_title: string;
  year_slug: string;
};

type UnitSource = {
  type: "unit";
  year_slug: string;
};

export interface LessonSearchHit {
  _source: LessonSource & CommonProps;
  highlight?: Partial<LessonSource>;
}

export interface UnitSearchHit {
  _source: UnitSource & CommonProps;
  highlight?: Partial<UnitSource>;
}

export type SearchHit = LessonSearchHit | UnitSearchHit;

export function isLessonSearchHit(x: SearchHit): x is LessonSearchHit {
  return x._source.type === "lesson";
}

const Search = () => {
  const { text: searchTerm } = useSearchQuery();
  const { fetchSearchResults, loading, error, results } =
    useFetchSearchResults();

  useEffect(() => {
    let isCancelled = false;

    fetchSearchResults({ isCancelled });

    return () => {
      isCancelled = true;
    };
    /**
     * When the search term or filters change, requestOptions change,
     * so fetchSearchResults (which is wrapped in useCallback) changes.
     * In short, when the term or filters change, the results are
     * fetched.
     * There is a small bug currently however, whereby if you want to
     * re-fetch results (e.g. in the case of a network error the first
     * time), you cannot simply click submit. You have to change the
     * search term.
     */
  }, [fetchSearchResults]);

  return (
    <Flex $background="white" $flexDirection={"column"}>
      <MaxWidth $ph={16}>
        <Grid $mt={48} $cg={16}>
          <GridArea $colSpan={[12, 12, 12]} $mt={24} $mb={24}>
            <Flex $flexDirection={["column"]}>
              {(searchTerm && (
                <Heading tag={"h1"} $font={["heading-5", "heading-4"]} $mt={24}>
                  &ldquo;{searchTerm}&rdquo;
                </Heading>
              )) || (
                <Heading tag={"h1"} $font={["heading-5", "heading-4"]} $mt={24}>
                  Search
                </Heading>
              )}

              <Heading tag="h2" $font={"heading-light-6"} $mt={24}>
                Search for topics and key words to explore thousands of lessons
                and adaptable resources
              </Heading>
              <Card
                $background={"teachersPastelYellow"}
                $width={"100%"}
                $pv={[24]}
                $ph={[16, 24]}
                $mt={24}
                $mb={20}
                $position={"relative"}
              >
                <SearchForm />
                <BrushBorders color={"teachersPastelYellow"} />
              </Card>
            </Flex>
            <ActiveFilters />
          </GridArea>
          <GridArea $colSpan={[12, 3]} $pr={16}>
            <Flex $flexDirection="column" $mb={32} $display={["none", "flex"]}>
              <SearchFilters />
            </Flex>
            <Box $mb={32}>
              <MobileFilters
                label="Filters"
                labelOpened="Close"
                iconOpened="Cross"
                iconClosed="Hamburger"
              >
                <SearchFilters />
              </MobileFilters>
            </Box>
          </GridArea>
          <GridArea $colSpan={[12, 9]} $pr={16}>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <SearchResults hits={results} />
          </GridArea>
        </Grid>
      </MaxWidth>
    </Flex>
  );
};

const SearchPage: NextPage = () => {
  return (
    <AppLayout seoProps={DEFAULT_SEO_PROPS} $background="grey1">
      <Search />
    </AppLayout>
  );
};

export default SearchPage;
