import React, { useEffect, useState, useContext } from "react";
import { NextPage } from "next";

import { SearchContext } from "../context/SearchContext";
import Layout from "../components/Layout";

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

const constructQuery = (query: string, keystage: string) => {
  const filter = keystage
    ? {
        term: {
          key_stage_slug: keystage,
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
              query,
              type: "phrase",
              // boost title highest, then other titles, then intro text
              fields: ["title^10", "*_title^6", "lesson_description^3"],
            },
          },
          // then search everything with fuzzy
          {
            multi_match: {
              query,
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
  // TODO: handle error in UI in a meaningful way
  return response;
}

const Search: NextPage = () => {
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(true);
  const { text, keystage } = useContext(SearchContext);

  //TODO: a better way of handling env variables type
  const apiRoute: RequestInfo =
    "https://search-staging.oaknational.workers.dev";

  const requestOptions: RequestInit = {
    method: "POST",
    redirect: "follow",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(constructQuery(text, keystage)),
  };

  useEffect(() => {
    let isCancelled = false;
    // TODO: add loading UI
    fetch(apiRoute, requestOptions)
      .then(handleFetchError)
      .then((res) => res.json())
      .then((data) => {
        const { hits } = data;
        const hitList: SearchHit[] = hits.hits;
        if (!isCancelled) {
          setResults(hitList);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [text, keystage]);

  const resultElements: JSX.Element[] = [];
  results.forEach((hit: SearchHit) => {
    const { _source } = hit;
    const { title, id } = _source;
    resultElements.push(<li key={id}>{title}</li>);
  });

  return (
    <Layout>
      <h2>Key Stage: {keystage}</h2>
      {loading && <p>Loading...</p>}
      <ul>{resultElements}</ul>
    </Layout>
  );
};

export default Search;
