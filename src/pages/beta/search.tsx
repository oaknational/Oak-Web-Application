import React, { useEffect } from "react";
import { NextPage } from "next";

import { ALL_KEY_STAGES } from "../../context/Search/SearchContext";
import AppLayout from "../../components/AppLayout";
import SearchResults from "../../components/SearchResults";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import BrowserWidthBar from "../../components/BrowserWidthBar";
import KeyStageFilter from "../../components/SearchFilters/KeyStageFilter";
import Flex from "../../components/Flex";
import useFetchSearchResults from "../../context/Search/useFetchSearchResults";

export interface SearchHit {
  _source: {
    id: number;
    is_sensitive: boolean;
    is_specialist: boolean | null;
    key_stage_slug: string;
    key_stage_title: string;
    lesson_description: string;
    slug: string;
    subject_slug: string;
    subject_title: string;
    theme_title: string;
    title: string;
    topic_slug: string;
    topic_title: string;
    type: string;
    year_slug: string;
    year_title: string;
  };
}

const Search: NextPage = () => {
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
    <AppLayout seoProps={DEFAULT_SEO_PROPS} $background="grey1">
      <BrowserWidthBar $background="white" $pv={20}>
        <Flex>
          {ALL_KEY_STAGES.map((ks) => (
            <KeyStageFilter key={`search-filters-keystage-${ks}`} ks={ks} />
          ))}
        </Flex>
      </BrowserWidthBar>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <SearchResults hits={results} />
    </AppLayout>
  );
};

export default Search;
