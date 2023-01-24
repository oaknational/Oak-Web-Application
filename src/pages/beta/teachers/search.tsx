import React, { useEffect } from "react";
import { NextPage } from "next";

import { ALL_KEY_STAGES } from "../../../context/Search/SearchContext";
import AppLayout from "../../../components/AppLayout";
import SearchResults from "../../../components/SearchResults";
import { DEFAULT_SEO_PROPS } from "../../../browser-lib/seo/Seo";
import BrowserWidthBar from "../../../components/BrowserWidthBar";
import KeyStageFilter from "../../../components/SearchFilters/KeyStageFilter";
import Flex from "../../../components/Flex";
import useFetchSearchResults from "../../../context/Search/useFetchSearchResults";
import MaxWidth from "../../../components/MaxWidth/MaxWidth";

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
  year: string;
  unit_study_order: number;
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
    <Flex $background="white">
      <MaxWidth $ph={16}>
        <BrowserWidthBar $background="white" $pv={20}>
          <Flex $mt={80}>
            {ALL_KEY_STAGES.map((ks) => (
              <KeyStageFilter key={`search-filters-keystage-${ks}`} ks={ks} />
            ))}
          </Flex>
        </BrowserWidthBar>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <SearchResults hits={results} />
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
