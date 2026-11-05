"use client";

import Search from "@/app/(core)/teachers/search/Search.view";
import { RequestStatus } from "@/context/Search/useSearch";
import useSearchFilters from "@/context/Search/useSearchFilters";
import { SearchPageData } from "@/node-lib/curriculum-api-2023";
import { SearchHit, SearchQuery } from "@/context/Search/search.types";

export const SearchView = ({
  curriculumData,
  results,
  query,
  status,
}: {
  curriculumData: SearchPageData;
  results: SearchHit[];
  query: SearchQuery;
  status: RequestStatus;
}) => {
  const {
    subjects: allSubjects,
    keyStages: allKeyStages,
    contentTypes: allContentTypes,
    examBoards: allExamBoards,
    yearGroups: allYearGroups,
  } = curriculumData;

  const searchFilters = useSearchFilters({
    allKeyStages,
    allYearGroups,
    allSubjects,
    allContentTypes,
    allExamBoards,
    query,
    setQuery: (query) => console.log("diego setting", { query }), // TODO: remove
  });

  return (
    <Search
      allKeyStages={allKeyStages}
      results={results}
      searchFilters={searchFilters}
      query={query}
      status={status}
    />
  );
};
