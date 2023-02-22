import { useCallback, useMemo, useState } from "react";

import errorReporter from "../../common-lib/error-reporter";
import config from "../../config/browser";
import OakError from "../../errors/OakError";
import { SearchHit } from "../../pages/beta/teachers/search";
import handleFetchError from "../../utils/handleFetchError";

import constructElasticQuery from "./constructElasticQuery";
import { useSearchQuery } from "./SearchContext";

const reportError = errorReporter("search");

const useFetchSearchResults = () => {
  const { text, keyStages } = useSearchQuery();

  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState(false);

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
      setShowMessage(false);
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
            if (!hitList.length && text) {
              setShowMessage(true);
            }
          }
        }
      } catch (error) {
        const oakError = new OakError({
          code: "search/unknown",
          originalError: error,
        });

        reportError(oakError);
        setError(oakError.message);
      } finally {
        setLoading(false);
      }
    },
    [requestOptions, text]
  );

  return {
    loading,
    results,
    error,
    fetchSearchResults,
    showMessage,
  };
};

export default useFetchSearchResults;
