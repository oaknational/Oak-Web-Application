import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import errorReporter from "../../common-lib/error-reporter";
import config from "../../config/browser";
import OakError from "../../errors/OakError";
import useStableCallback from "../../hooks/useStableCallback";
import handleFetchError from "../../utils/handleFetchError";
import { resolveOakHref } from "../../common-lib/urls";

import constructElasticQuery from "./constructElasticQuery";
import { SearchHit, searchResultsSchema } from "./helpers";

export type SearchQuery = {
  term: string;
  keyStages?: string[];
};
export type SetSearchQuery = (
  arg: SearchQuery | ((oldQuery: SearchQuery) => SearchQuery)
) => void;
type UseSearchQueryReturnType = {
  query: SearchQuery;
  setQuery: SetSearchQuery;
};
const useSearchQuery = ({
  allKeyStages,
}: {
  allKeyStages: { slug: string; title: string }[];
}): UseSearchQueryReturnType => {
  const {
    query: { term = "", keyStages = "" },
    push,
  } = useRouter();

  const isKeyStage = useCallback(
    (slug: string) => {
      return allKeyStages.some((keyStage) => keyStage.slug === slug);
    },
    [allKeyStages]
  );

  const termString = term?.toString() || "";
  const keyStagesArray = useMemo(
    () => keyStages.toString().split(","),
    [keyStages]
  );

  const query = useMemo(() => {
    return {
      term: termString,
      keyStages: keyStagesArray.filter(isKeyStage),
    };
  }, [termString, keyStagesArray, isKeyStage]);

  const setQuery = useStableCallback(
    (arg: SearchQuery | ((oldQuery: SearchQuery) => SearchQuery)) => {
      const newQuery = typeof arg === "function" ? arg(query) : arg;

      const url = resolveOakHref({ page: "beta-search", query: newQuery });
      push(url, undefined, { shallow: true });
    }
  );

  return { query, setQuery };
};

const reportError = errorReporter("search");

export type RequestStatus = "not-asked" | "loading" | "success" | "fail";
export type UseSearchReturnType = {
  status: RequestStatus;
  results: SearchHit[];
  fetchResults: ({ isCancelled }: { isCancelled: boolean }) => Promise<void>;
  query: SearchQuery;
  setQuery: SetSearchQuery;
  setSearchTerm: (props: { searchTerm: string }) => void;
};
type UseSearchProps = {
  allKeyStages: { title: string; slug: string }[];
};
const useSearch = (props: UseSearchProps): UseSearchReturnType => {
  const { allKeyStages } = props;
  const { query, setQuery } = useSearchQuery({ allKeyStages });

  const [results, setResults] = useState<SearchHit[]>([]);
  const [status, setStatus] = useState<RequestStatus>("not-asked");

  const fetchResults = useStableCallback(
    async (
      { isCancelled }: { isCancelled: boolean } = { isCancelled: false }
    ) => {
      setStatus("loading");
      try {
        const options: RequestInit = {
          method: "POST",
          redirect: "follow",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(constructElasticQuery(query)),
        };

        const response = await fetch(config.get("searchApiUrl"), options);

        handleFetchError(response);

        const unparsedData = await response.json();
        const data = searchResultsSchema.parse(unparsedData);
        if (data) {
          const { hits } = data;
          const hitList = hits.hits;
          if (!isCancelled) {
            setResults(hitList);
            setStatus("success");
          }
        }
      } catch (error) {
        const oakError = new OakError({
          code: "search/unknown",
          originalError: error,
        });

        reportError(oakError);
        setStatus("fail");
      }
    }
  );

  /**
   * This function to set the searchTerm of the query, without setting any
   * other parameters. To be passed to SearchForm as submitHandler
   */
  const setSearchTerm = useCallback(
    ({ searchTerm }: { searchTerm: string }) =>
      setQuery((_query) => ({ ..._query, term: searchTerm })),
    [setQuery]
  );

  useEffect(() => {
    if (!query.term) {
      return;
    }
    fetchResults();
  }, [fetchResults, query]);

  return {
    status,
    results,
    fetchResults,
    query,
    setQuery,
    setSearchTerm,
  };
};

export default useSearch;
