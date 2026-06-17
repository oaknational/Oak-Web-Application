"use client";

import Search from "@/components/TeacherViews/Search/Search.view";
import useSearch from "@/context/Search/useSearch";
import useSearchFilters from "@/context/Search/useSearchFilters";
import { SearchPageData } from "@/node-lib/curriculum-api-2023";

type SearchViewProps = {
  curriculumData: SearchPageData;
};

export const SearchView = ({ curriculumData }: SearchViewProps) => {
  const {
    subjects: allSubjects,
    keyStages: allKeyStages,
    contentTypes: allContentTypes,
    examBoards: allExamBoards,
    yearGroups: allYearGroups,
  } = curriculumData;

  const searchProps = useSearch({
    allKeyStages,
    allYearGroups,
    allSubjects,
    allContentTypes,
    allExamBoards,
    legacy: [{ slug: "new", title: "Show new only" }],
  });

  const searchFilters = useSearchFilters({
    ...searchProps,
    allKeyStages,
    allYearGroups,
    allSubjects,
    allContentTypes,
    allExamBoards,
  });

  return (
    <Search
      allKeyStages={allKeyStages}
      {...searchProps}
      searchFilters={searchFilters}
    />
  );
};
