import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

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

const useSearchQuery = ({
  allKeyStages,
  allYearGroups,
  allSubjects,
  allContentTypes,
  allExamBoards,
  legacy,
}: {
  allKeyStages?: KeyStage[];
  allYearGroups?: SearchPageData["yearGroups"];
  allSubjects?: SearchPageData["subjects"];
  allContentTypes?: ContentType[];
  allExamBoards?: SearchPageData["examBoards"];
  legacy?: { slug: string; title: string }[];
}): UseSearchQueryReturnType => {
  const { push } = useRouter();

  const routerQuery = {
    term: "",
    keyStages: "",
    yearGroups: "",
    subjects: "",
    contentTypes: "",
    examBoards: "",
    curriculum: "",
  };

  const isFilterItemCallback = useCallback(isFilterItem, []);

  const getFilterForQueryCallback = useCallback(getFilterForQuery, [
    isFilterItemCallback,
  ]);

  const termString = routerQuery.term?.toString() || "";
  const query = useMemo(() => {
    return {
      term: termString,
      keyStages: allKeyStages
        ? getFilterForQueryCallback(routerQuery.keyStages, allKeyStages)
        : [],
      yearGroups: allYearGroups
        ? getFilterForQueryCallback(routerQuery.yearGroups, allYearGroups)
        : [],
      subjects: allSubjects
        ? getFilterForQueryCallback(routerQuery.subjects, allSubjects)
        : [],
      contentTypes: allContentTypes
        ? getFilterForQueryCallback(
            routerQuery.contentTypes,
            allContentTypes,
          ).filter(
            (type): type is "lesson" | "unit" =>
              type === "lesson" || type === "unit",
          )
        : [],
      examBoards: allExamBoards
        ? getFilterForQueryCallback(routerQuery.examBoards, allExamBoards)
        : [],
      curriculum: legacy
        ? getFilterForQueryCallback(routerQuery.curriculum, legacy)
        : [],
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    termString,
    allKeyStages,
    allYearGroups,
    routerQuery.yearGroups,
    getFilterForQueryCallback,
    routerQuery.keyStages,
    allSubjects,
    routerQuery.contentTypes,
    allContentTypes,
    routerQuery.examBoards,
    allExamBoards,
    routerQuery.subjects,
    routerQuery.curriculum,
  ]);

  const setQuery: SetSearchQuery = useStableCallback((arg) => {
    const newQuery = typeof arg === "function" ? arg(query) : arg;
    const url = resolveOakHref({
      page: "search",
      query: newQuery,
    });
    push(url);
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
  allYearGroups?: SearchPageData["yearGroups"];
  allSubjects?: SearchPageData["subjects"];
  allContentTypes?: ContentType[];
  allExamBoards?: SearchPageData["examBoards"];
  legacy?: { slug: string; title: string }[];
};
const useSearch = (props: UseSearchProps): UseSearchReturnType => {
  const {
    allKeyStages,
    allYearGroups,
    allSubjects,
    allContentTypes,
    allExamBoards,
    legacy,
  } = props;
  const { query, setQuery } = useSearchQuery({
    allKeyStages,
    allYearGroups,
    allSubjects,
    allContentTypes,
    allExamBoards,
    legacy,
  });
  const [searchStartTime, setSearchStartTime] = useState<null | number>(null);

  const [results, setResults] = useState<SearchHit[]>([]);
  const [status, setStatus] = useState<RequestStatus>("not-asked");

  const legacyQueryVal =
    query.curriculum?.[0] === "new" ? "filterOutAll" : "filterOutEYFS";
  const fetchResults = useStableCallback(async () => {
    /**
     * Searches both 2020 and 2023 content, and merges the results
     */
    performSearch({
      query: {
        ...query,
        legacy: legacyQueryVal,
      },
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
