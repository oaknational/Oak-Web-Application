import React from "react";
import { Metadata } from "next";
import z from "zod";
import { notFound } from "next/navigation";

import { SearchView } from "./SearchView";
import { getFilterForQuery } from "./helpers";

import curriculumApi2023, {
  SearchPageData,
} from "@/node-lib/curriculum-api-2023";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { AppPageProps } from "@/hocs/withPageErrorHandling";
import { fetchResults } from "@/context/Search/search-api/2023/fetchResults";
import { SearchHit, SearchQuery } from "@/context/Search/search.types";
import { RequestStatus } from "@/context/Search/useSearch";

export const metadata: Metadata = {
  title: "Search for Free Teaching Resources",
  description: "Search for Free Teaching Resources",
  robots: {
    index: false,
    follow: true,
  },
};

const searchPageParamsSchema = z.object({
  term: z.string(),
  keyStages: z.string().optional(),
  yearGroups: z.string().optional(),
  subjects: z.string().optional(),
  contentTypes: z.string().optional(),
  examBoards: z.string().optional(),
  curriculum: z.string().optional(),
});

const constructSearchQuery = ({
  searchParams,
  data,
}: {
  data: SearchPageData;
  searchParams: z.infer<typeof searchPageParamsSchema>;
}): SearchQuery => {
  const {
    subjects: allSubjects,
    keyStages: allKeyStages,
    contentTypes: allContentTypes,
    examBoards: allExamBoards,
    yearGroups: allYearGroups,
  } = data;

  const query = {
    term: searchParams?.term,
    keyStages:
      allKeyStages && searchParams?.keyStages
        ? getFilterForQuery(searchParams?.keyStages, allKeyStages)
        : [],
    yearGroups:
      allYearGroups && searchParams?.yearGroups
        ? getFilterForQuery(searchParams?.yearGroups, allYearGroups)
        : [],
    subjects:
      allSubjects && searchParams?.subjects
        ? getFilterForQuery(searchParams?.subjects, allSubjects)
        : [],
    contentTypes:
      allContentTypes && searchParams?.contentTypes
        ? getFilterForQuery(searchParams?.contentTypes, allContentTypes).filter(
            (type): type is "lesson" | "unit" =>
              type === "lesson" || type === "unit",
          )
        : [],
    examBoards:
      allExamBoards && searchParams?.examBoards
        ? getFilterForQuery(searchParams?.examBoards, allExamBoards)
        : [],
    curriculum: [],
    legacy: "filterOutAll" as const,
  };

  return query;
};

async function SearchPage(props: AppPageProps) {
  const curriculumData = await curriculumApi2023.searchPage();
  const searchParams = await props.searchParams;
  const validatedSearchParams = searchPageParamsSchema.safeParse(searchParams);
  if (validatedSearchParams.error) {
    return notFound();
  }
  const query = constructSearchQuery({
    data: curriculumData,
    searchParams: validatedSearchParams.data,
  });

  let status: RequestStatus = "loading";
  let results: SearchHit[] = [];
  try {
    results = await fetchResults(query);
    status = "success";
  } catch {
    status = "fail";
  }
  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel={"search"}
    >
      <SearchView
        curriculumData={curriculumData}
        results={results}
        query={query}
        status={status}
      />
    </TeacherBrowseAnalyticsStoreProvider>
  );
}

export default SearchPage;
