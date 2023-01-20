import React, { useEffect } from "react";
import { NextPage } from "next";

import AppLayout from "../../../components/AppLayout";
import SearchResults from "../../../components/SearchResults";
import { DEFAULT_SEO_PROPS } from "../../../browser-lib/seo/Seo";
import SearchFilters from "../../../components/SearchFilters";
import Grid, { GridArea } from "../../../components/Grid";
import Flex from "../../../components/Flex";
import useFetchSearchResults from "../../../context/Search/useFetchSearchResults";
import MaxWidth from "../../../components/MaxWidth/MaxWidth";
import MobileSearchFilters from "../../../components/MobileSearchFilters";
import Button from "../../../components/Button";
import { P } from "../../../components/Typography";
import {
  useSearchQuery,
  KeyStage,
} from "../../../context/Search/SearchContext";

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
}

export interface LessonSearchHit {
  _source: {
    type: "lesson";
    lesson_description: string;
    topic_title: string;
    topic_slug: string;
    year_title: string;
    year_slug: string;
  } & CommonProps;
}

export interface UnitSearchHit {
  _source: {
    type: "unit";
    year_slug: string;
  } & CommonProps;
}

export type SearchHit = LessonSearchHit | UnitSearchHit;

export function isLessonSearchHit(x: SearchHit): x is LessonSearchHit {
  return x._source.type === "lesson";
}

const Search = () => {
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

  const { keyStages, setKeyStages } = useSearchQuery();

  const onRemoveFilterClick = (keyStage: KeyStage) => {
    const newKeyStages = new Set(keyStages);
    newKeyStages.delete(keyStage);
    setKeyStages(newKeyStages);
  };

  return (
    <Flex $background="white" $flexDirection={"column"}>
      <MaxWidth $ph={16}>
        <Grid $mt={48} $cg={16}>
          <GridArea $colSpan={[12, 12, 12]} $mt={24} $mb={24}>
            <Flex
              $alignItems={["flex-start", "center"]}
              $flexDirection={["column", "row"]}
            >
              <P $mr={20} $color={["oakGrey4", "black"]}>
                Active filters:
              </P>
              <Flex $alignItems={"center"}>
                {Array.from(keyStages).map((keyStage: KeyStage) => (
                  <Button
                    label={`KS${keyStage}`}
                    onClick={() => onRemoveFilterClick(keyStage)}
                    variant="buttonStyledAsLink"
                    icon="Cross"
                    $iconPosition="trailing"
                    $mr={16}
                  />
                ))}
              </Flex>
            </Flex>
          </GridArea>
          <GridArea $colSpan={[12, 4, 3]} $pr={16}>
            <Flex $flexDirection="column" $mb={32} $display={["none", "flex"]}>
              <SearchFilters />
            </Flex>
            <MobileSearchFilters>
              <SearchFilters />
            </MobileSearchFilters>
          </GridArea>
          <GridArea $colSpan={[12, 8, 9]} $pr={16}>
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
