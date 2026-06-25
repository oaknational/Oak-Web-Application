"use client";

import { useRouter, useSearchParams } from "next/navigation";

import Search from "@/app/(core)/teachers/search/Search.view";
import useSearch from "@/context/Search/useSearch";
import useSearchFilters from "@/context/Search/useSearchFilters";
import { SearchPageData } from "@/node-lib/curriculum-api-2023";

export const SearchView = ({
  curriculumData,
}: {
  curriculumData: SearchPageData;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    navigation: {
      searchParams: searchParams,
      push: (url: string) => router.push(url, { scroll: false }),
    },
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
