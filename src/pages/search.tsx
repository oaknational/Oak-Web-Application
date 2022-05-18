import React, { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";

import { useSearchQuery } from "../context/SearchContext";
import Layout from "../components/Layout";
import SearchResults from "../components/SearchResults";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";

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

type ConstructQueryParams = {
  term: string;
  keyStages: Set<string>;
};

const constructQuery = (query: ConstructQueryParams) => {
  const { term, keyStages } = query;
  const filter =
    keyStages.size > 0
      ? {
          terms: {
            key_stage_slug: Array.from(keyStages),
          },
        }
      : null;

  return {
    query: {
      bool: {
        // search twice with an OR
        should: [
          {
            // exact matches in titles and intro text first
            // boosting titles highest
            multi_match: {
              query: term,
              type: "phrase",
              // boost title highest, then other titles, then intro text
              fields: ["title^10", "*_title^6", "lesson_description^3"],
            },
          },
          // then search everything with fuzzy
          {
            multi_match: {
              query: term,
              fields: ["*"],
              type: "most_fields",
              /* Search terms <=4 characters have to be an exact match
                terms >4 and <7 can have 1 error >=7 can have 2 errors */
              fuzziness: "AUTO:4,7",
              // First character of search term has to be an exact match
              prefix_length: 1,
            },
          },
        ],
        // keystage filter
        filter,
        /* if this is not set in a "should" any filtered content will appear
        not just those in the multi-matches above */
        minimum_should_match: 1,
      },
    },
  };
};

function handleFetchError(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
}

const Search: NextPage = () => {
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(true);
  const { text, keyStages } = useSearchQuery();

  //TODO: a better way of handling env variables type
  const apiRoute: RequestInfo =
    "https://search-staging.oaknational.workers.dev";

  const requestOptions: RequestInit = useMemo(
    () => ({
      method: "POST",
      redirect: "follow",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(constructQuery({ term: text, keyStages })),
    }),
    [text, keyStages]
  );

  useEffect(() => {
    let isCancelled = false;

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(apiRoute, requestOptions);
        handleFetchError(response);
        const data = await response.json();
        if (data) {
          const { hits } = data;
          const hitList: SearchHit[] = hits.hits;

          if (!isCancelled) {
            setResults(hitList);
            setLoading(false);
          }
        }
      } catch (error) {
        //TODO: handle error
        console.error(error);
        throw error;
      }
    };

    fetchSearchResults();

    return () => {
      isCancelled = true;
    };
  }, [requestOptions]);

  return (
    <Layout seoProps={DEFAULT_SEO_PROPS}>
      {loading && <p>Loading...</p>}
      <SearchResults hits={results} />
    </Layout>
  );
};

export default Search;
