import React, { useEffect, useState } from "react";
import { NextPage } from "next";

import Layout from "../components/Layout";

const constructQuery = (queryTerms = "macbeth") => {
  return {
    query: {
      multi_match: {
        query: queryTerms,
      },
    },
  };
};

const SearchPage: NextPage = () => {
  const [results, setResults] = useState([]);
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
    body: JSON.stringify(constructQuery()),
  };

  useEffect(() => {
    // setLoading(true);

    fetch(apiRoute, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        const { hits } = data;
        const hitList: [] = hits.hits;
        setResults(hitList);
      });
  }, []);

  const resultElements: JSX.Element[] = [];
  results.map((hit) => {
    const { _source } = hit;
    const { title } = _source;
    resultElements.push(<li>{title}</li>);
  });

  return (
    <Layout>
      <ul>{resultElements}</ul>
    </Layout>
  );
};

export default SearchPage;
