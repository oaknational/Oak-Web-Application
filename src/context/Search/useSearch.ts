import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFeatureFlagEnabled } from "posthog-js/react";

import { getFilterForQuery, isFilterItem } from "./search.helpers";
import {
  ContentType,
  KeyStage,
  SearchHit,
  SearchQuery,
  SetSearchQuery,
} from "./search.types";
import { performSearch } from "./search-api/performSearch";

import useStableCallback from "@/hooks/useStableCallback";
import { resolveOakHref } from "@/common-lib/urls";
import { SearchPageData } from "@/node-lib/curriculum-api-2023";

type UseSearchQueryReturnType = {
  query: SearchQuery;
  setQuery: SetSearchQuery;
};
export const createSearchQuery = (
  partialQuery: Partial<SearchQuery>,
): SearchQuery => {
  const {
    term = "",
    keyStages = [],
    subjects = [],
    contentTypes = [],
    examBoards = [],
  } = partialQuery;
  return { term, keyStages, subjects, contentTypes, examBoards };
};

const useSearchQuery = ({
  allKeyStages,
  allSubjects,
  allContentTypes,
  allExamBoards,
}: {
  allKeyStages?: KeyStage[];
  allSubjects?: SearchPageData["subjects"];
  allContentTypes?: ContentType[];
  allExamBoards?: SearchPageData["examBoards"];
}): UseSearchQueryReturnType => {
  const {
    query: {
      term = "",
      keyStages = "",
      subjects = "",
      contentTypes = "",
      examBoards = "",
    },
    push,
  } = useRouter();

  const isFilterItemCallback = useCallback(isFilterItem, []);

  const getFilterForQueryCallback = useCallback(getFilterForQuery, [
    isFilterItemCallback,
  ]);

  const termString = term?.toString() || "";

  const query = useMemo(() => {
    return {
      term: termString,
      keyStages: allKeyStages
        ? getFilterForQueryCallback(keyStages, allKeyStages)
        : [],
      subjects: allSubjects
        ? getFilterForQueryCallback(subjects, allSubjects)
        : [],
      contentTypes: allContentTypes
        ? getFilterForQueryCallback(contentTypes, allContentTypes).filter(
            (type): type is "lesson" | "unit" =>
              type === "lesson" || type === "unit",
          )
        : [],
      examBoards: allExamBoards
        ? getFilterForQueryCallback(examBoards, allExamBoards)
        : [],
    };
  }, [
    termString,
    allKeyStages,
    getFilterForQueryCallback,
    keyStages,
    allSubjects,
    contentTypes,
    allContentTypes,
    examBoards,
    allExamBoards,
    subjects,
  ]);

  const setQuery: SetSearchQuery = useStableCallback((arg) => {
    const newQuery = typeof arg === "function" ? arg(query) : arg;

    const url = resolveOakHref({
      page: "search",
      query: newQuery,
    });
    push(url, undefined, { shallow: true });
  });

  return { query, setQuery };
};

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
  allKeyStages?: KeyStage[];
  allSubjects?: SearchPageData["subjects"];
  allContentTypes?: ContentType[];
  allExamBoards?: SearchPageData["examBoards"];
};
const useSearch = (props: UseSearchProps): UseSearchReturnType => {
  const { allKeyStages, allSubjects, allContentTypes, allExamBoards } = props;
  const { query, setQuery } = useSearchQuery({
    allKeyStages,
    allSubjects,
    allContentTypes,
    allExamBoards,
  });
  const [searchStartTime, setSearchStartTime] = useState<null | number>(null);

  const [results, setResults] = useState<SearchHit[]>([]);
  const [status, setStatus] = useState<RequestStatus>("not-asked");

  const use2023SearchApi = useFeatureFlagEnabled("use-2023-search-api");

  const fetchResults = useStableCallback(async (useNewApi: boolean) => {
    /**
     * Current this searches the 2023 curriculum.
     * We will want to search both 2020 and 2023, and merge the results.
     */
    performSearch({
      query,
      apiVersion: useNewApi ? "2023" : "2020",
      onStart: () => {
        setStatus("loading");
        setSearchStartTime(performance.now());
      },
      onSuccess: (results) => {
        setResults(results);
        setStatus("success");
      },
      onFail: () => {
        setStatus("fail");
      },
    });
  });

  /**
   * This function to set the searchTerm of the query, without setting any
   * other parameters. To be passed to SearchForm as submitHandler
   */
  const setSearchTerm = useCallback(
    ({ searchTerm }: { searchTerm: string }) =>
      setQuery((_query) => ({ ..._query, term: searchTerm })),
    [setQuery],
  );

  useEffect(() => {
    if (!query.term) {
      return;
    }
    fetchResults(use2023SearchApi ?? false);
  }, [fetchResults, query, use2023SearchApi]);

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
