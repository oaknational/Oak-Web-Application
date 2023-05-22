import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import errorReporter from "../../common-lib/error-reporter";
import config from "../../config/browser";
import OakError from "../../errors/OakError";
import useStableCallback from "../../hooks/useStableCallback";
import handleFetchError from "../../utils/handleFetchError";
import { resolveOakHref } from "../../common-lib/urls";
import { SearchPageData } from "../../node-lib/curriculum-api/index";

import constructElasticQuery from "./constructElasticQuery";
import { SearchHit, searchResultsSchema } from "./helpers";
import { KeyStage } from "./useSearchFilters";

export type SearchQuery = {
  term: string;
  keyStages: string[];
  subjects: string[];
};
export type SetSearchQuery = (
  arg: Partial<SearchQuery> | ((oldQuery: SearchQuery) => Partial<SearchQuery>)
) => void;
type UseSearchQueryReturnType = {
  query: SearchQuery;
  setQuery: SetSearchQuery;
};
export const createSearchQuery = (
  partialQuery: Partial<SearchQuery>
): SearchQuery => {
  const { term = "", keyStages = [], subjects = [] } = partialQuery;
  return { term, keyStages, subjects };
};
const useSearchQuery = ({
  allKeyStages,
  allSubjects,
}: {
  allKeyStages: KeyStage[];
  allSubjects: SearchPageData["subjects"];
}): UseSearchQueryReturnType => {
  const {
    query: { term = "", keyStages = "", subjects = "" },
    push,
  } = useRouter();

  const isKeyStage = useCallback(
    (slug: string) => {
      return allKeyStages.some((keyStage) => keyStage.slug === slug);
    },
    [allKeyStages]
  );

  const isSubject = useCallback(
    (slug: string) => {
      return allSubjects.some((subject) => subject.slug === slug);
    },
    [allSubjects]
  );

  // const isKeyStage = useCallback(
  //   <T extends { slug: string }>(slug: string, items: T[]) => {
  //     return items.some((item) => item.slug === slug);
  //   },
  //   []
  // );

  const termString = term?.toString() || "";
  const keyStagesArray = useMemo(
    () => (keyStages ? keyStages.toString().split(",") : []),
    [keyStages]
  );
  const subjectsArray = useMemo(
    () => (subjects ? subjects.toString().split(",") : []),
    [subjects]
  );

  const query = useMemo(() => {
    return {
      term: termString,
      keyStages: keyStagesArray.filter(isKeyStage),
      subjects: subjectsArray.filter(isSubject),
    };
  }, [termString, keyStagesArray, isKeyStage, subjectsArray, isSubject]);

  const setQuery: SetSearchQuery = useStableCallback((arg) => {
    const newQuery = typeof arg === "function" ? arg(query) : arg;

    const url = resolveOakHref({
      page: "search",
      viewType: "teachers",
      query: newQuery,
    });
    push(url, undefined, { shallow: true });
  });

  return { query, setQuery };
};

const reportError = errorReporter("search");

export type RequestStatus = "not-asked" | "loading" | "success" | "fail";
export type UseSearchReturnType = {
  status: RequestStatus;
  results: SearchHit[];
  query: SearchQuery;
  setQuery: SetSearchQuery;
  setSearchTerm: (props: { searchTerm: string }) => void;
  searchStartTime: null | number;
  setSearchStartTime: (time: number | null) => void;
};
type UseSearchProps = {
  allKeyStages: KeyStage[];
  allSubjects: SearchPageData["subjects"];
};
const useSearch = (props: UseSearchProps): UseSearchReturnType => {
  const { allKeyStages, allSubjects } = props;
  const { query, setQuery } = useSearchQuery({ allKeyStages, allSubjects });
  const [searchStartTime, setSearchStartTime] = useState<null | number>(null);

  const [results, setResults] = useState<SearchHit[]>([]);
  const [status, setStatus] = useState<RequestStatus>("not-asked");

  const fetchResults = useStableCallback(async () => {
    setStatus("loading");
    setSearchStartTime(performance.now());
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
        setResults(hitList);
        setStatus("success");
      }
    } catch (error) {
      const oakError = new OakError({
        code: "search/unknown",
        originalError: error,
      });

      reportError(oakError);
      setStatus("fail");
    }
  });

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
    query,
    setQuery,
    setSearchTerm,
    searchStartTime,
    setSearchStartTime,
  };
};

export default useSearch;
