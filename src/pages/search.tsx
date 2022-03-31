import React, { useEffect, useState, useContext } from "react";
import { NextPage } from "next";

import { SearchContext } from "../context/SearchContext";
import Layout from "../components/Layout";

interface SearchHit {
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

const constructQuery = (queryTerms = "macbeth") => {
  return {
    query: {
      multi_match: {
        query: queryTerms,
      },
    },
  };
};

function handleFetchError(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }

  return response;
}

const Search: NextPage = () => {
  const [results, setResults] = useState<SearchHit[]>([]);
  const { text } = useContext(SearchContext);
  // const [isLoading, setLoading] = useState(false);

  //TODO: a better way of handling env variables type
  const apiRoute: RequestInfo =
    "https://search-staging.oaknational.workers.dev";

  const requestOptions: RequestInit = {
    method: "POST",
    redirect: "follow",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(constructQuery(text)),
  };

  useEffect(() => {
    // setLoading(true);

    fetch(apiRoute, requestOptions)
      .then(handleFetchError)
      .then((res) => res.json())
      .then((data) => {
        const { hits } = data;
        const hitList: SearchHit[] = hits.hits;
        setResults(hitList);
      });
  }, [text]);

  const resultElements: JSX.Element[] = [];
  results.forEach((hit: SearchHit) => {
    const { _source } = hit;
    const { title, id } = _source;
    resultElements.push(<li key={id}>{title}</li>);
  });

  return (
    <Layout>
      <ul>{resultElements}</ul>
    </Layout>
  );
};

export default Search;
