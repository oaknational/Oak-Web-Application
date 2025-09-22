import { useRouter } from "next/router";
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
  const {
    query: {
      term = "",
      keyStages = "",
      yearGroups = "",
      subjects = "",
      contentTypes = "",
      examBoards = "",
      curriculum = "",
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
    push(url, undefined, { shallow: true });
  });

  return { query, setQuery };
};

// TODO find a new home
export type SearchSuggestion = {
  type: "subject" | "subject-ks";
  title: string;
  description: string;
  slug: string;
  keyStages: Array<{
    slug: string;
    title: string;
    href: string;
  }>;
};

type Results = {
  results: SearchHit[];
  suggestion: SearchSuggestion | null;
};

export type RequestStatus = "not-asked" | "loading" | "success" | "fail";
export type UseSearchReturnType = {
  status: RequestStatus;
  results: Results | null;
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

  const [results, setResults] = useState<Results | null>(null);
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
      onSuccess: (hits, suggestion) => {
        setResults({
          results: hits,
          suggestion,
        });
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
