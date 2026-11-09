import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { constructSearchQuery } from "./helpers/constructSearchQuery";
import SearchView from "./SearchView";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { AppPageProps } from "@/hocs/withPageErrorHandling";
import { fetchResults } from "@/context/Search/search-api/2023/fetchResults";
import {
  RequestStatus,
  SearchHit,
  searchPageParamsSchema,
} from "@/context/Search/search.types";
import { getSearchFilters } from "@/context/Search/getSearchFilters";
import errorReporter from "@/common-lib/error-reporter";

export const metadata: Metadata = {
  title: "Search for Free Teaching Resources",
  description: "Search for Free Teaching Resources",
  robots: {
    index: false,
    follow: true,
  },
};

const reportError = errorReporter("search-page::app");

async function SearchPage(props: Readonly<AppPageProps>) {
  const curriculumData = await curriculumApi2023.searchPage();
  const searchParams = await props.searchParams;
  const validatedSearchParams = searchPageParamsSchema.safeParse(searchParams);

  if (validatedSearchParams.error) {
    return notFound();
  }
  const query = constructSearchQuery({
    data: curriculumData,
    searchQuery: validatedSearchParams.data,
  });

  let status: RequestStatus = "loading";
  let results: SearchHit[] = [];
  let timeTaken = 0;
  try {
    const res = await fetchResults(query);
    results = res.hitList;
    timeTaken = res.took;
    status = "success";
  } catch (error) {
    status = "fail";
    void reportError(error);
  }

  const searchFilters = getSearchFilters({
    allKeyStages: curriculumData.keyStages,
    allYearGroups: curriculumData.yearGroups,
    allSubjects: curriculumData.subjects,
    allContentTypes: curriculumData.contentTypes,
    allExamBoards: curriculumData.examBoards,
    query,
  });

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel={"search"}
    >
      <SearchView
        allKeyStages={curriculumData.keyStages}
        results={results}
        query={query}
        status={status}
        searchFilters={searchFilters}
        timeTaken={timeTaken}
      />
    </TeacherBrowseAnalyticsStoreProvider>
  );
}

export default SearchPage;
