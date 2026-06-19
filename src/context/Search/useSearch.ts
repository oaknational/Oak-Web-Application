import { useRouter as useCompatRouter } from "next/compat/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getFilterForQuery,
  isFilterItem,
} from "../../app/(core)/teachers/search/helpers";

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

type SearchNavigationAdapter = {
  searchParams: URLSearchParams | null;
  push: (url: string) => void;
};

const useSearchQuery = ({
  allKeyStages,
  allYearGroups,
  allSubjects,
  allContentTypes,
  allExamBoards,
  legacy,
  navigation,
}: {
  allKeyStages?: KeyStage[];
  allYearGroups?: SearchPageData["yearGroups"];
  allSubjects?: SearchPageData["subjects"];
  allContentTypes?: ContentType[];
  allExamBoards?: SearchPageData["examBoards"];
  legacy?: { slug: string; title: string }[];
  navigation?: SearchNavigationAdapter;
}): UseSearchQueryReturnType => {
  const router = useCompatRouter();
  const searchParams = useMemo(() => {
    if (navigation?.searchParams) {
      return navigation.searchParams;
    }

    return new URLSearchParams(router?.asPath?.split("?")[1] ?? "");
  }, [navigation?.searchParams, router?.asPath]);

  const isFilterItemCallback = useCallback(isFilterItem, []);

  const getFilterForQueryCallback = useCallback(getFilterForQuery, [
    isFilterItemCallback,
  ]);

  const term = searchParams?.get("term") ?? "";
  const keyStages = searchParams?.get("keyStages") ?? "";
  const yearGroups = searchParams?.get("yearGroups") ?? "";
  const subjects = searchParams?.get("subjects") ?? "";
  const contentTypes = searchParams?.get("contentTypes") ?? "";
  const examBoards = searchParams?.get("examBoards") ?? "";
  const curriculum = searchParams?.get("curriculum") ?? "";

  const termString = term?.toString() || "";
  const query = useMemo(() => {
    return {
      term: termString,
      keyStages: allKeyStages
        ? getFilterForQueryCallback(keyStages, allKeyStages)
        : [],
      yearGroups: allYearGroups
        ? getFilterForQueryCallback(yearGroups, allYearGroups)
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
      curriculum: legacy ? getFilterForQueryCallback(curriculum, legacy) : [],
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    termString,
    allKeyStages,
    allYearGroups,
    yearGroups,
    getFilterForQueryCallback,
    keyStages,
    allSubjects,
    contentTypes,
    allContentTypes,
    examBoards,
    allExamBoards,
    subjects,
    curriculum,
  ]);

  const setQuery: SetSearchQuery = useStableCallback((arg) => {
    const newQuery = typeof arg === "function" ? arg(query) : arg;
    const url = resolveOakHref({
      page: "search",
      query: newQuery,
    });

    if (navigation?.push) {
      navigation.push(url);
      return;
    }

    if (router) {
      void router.push(url);
    }
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
  navigation?: SearchNavigationAdapter;
};
const useSearch = (props: UseSearchProps): UseSearchReturnType => {
  const {
    allKeyStages,
    allYearGroups,
    allSubjects,
    allContentTypes,
    allExamBoards,
    legacy,
    navigation,
  } = props;
  const { query, setQuery } = useSearchQuery({
    allKeyStages,
    allYearGroups,
    allSubjects,
    allContentTypes,
    allExamBoards,
    legacy,
    navigation,
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
