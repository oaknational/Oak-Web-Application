import { useCallback, useMemo, useState } from "react";

import errorHandler from "../../common-lib/error-handler";
import config from "../../config";
import OakError from "../../errors/OakError";
import { SearchHit } from "../../pages/search";
import handleFetchError from "../../utils/handleFetchError";

import constructElasticQuery from "./constructElasticQuery";
import { useSearchQuery } from "./SearchContext";

const handleError = errorHandler("search");

const useFetchSearchResults = () => {
  const { text, keyStages } = useSearchQuery();

  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const requestOptions: RequestInit = useMemo(
    () => ({
      method: "POST",
      redirect: "follow",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(constructElasticQuery({ term: text, keyStages })),
    }),
    [text, keyStages]
  );

  const fetchSearchResults = useCallback(
    async ({ isCancelled }: { isCancelled: boolean }) => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          config.get("searchApiUrl"),
          requestOptions
        );

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
        const oakError = new OakError({
          code: "search/unknown",
          originalError: error,
        });

        handleError(oakError);
        setError(oakError.message);
      } finally {
        setLoading(false);
      }
    },
    [requestOptions]
  );

  return {
    loading,
    results,
    error,
    fetchSearchResults,
  };
};

export default useFetchSearchResults;
