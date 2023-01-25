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
import { P , Heading } from "../../../components/Typography";
import {
  useSearchQuery,
  KeyStage,
} from "../../../context/Search/SearchContext";
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

              <Heading tag="h3" $font={"heading-light-6"} $mt={24}>
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
