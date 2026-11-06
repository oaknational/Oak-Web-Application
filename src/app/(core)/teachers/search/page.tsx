import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { SearchView } from "./SearchView";
import { constructSearchQuery } from "./helpers/constructSearchQuery";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { AppPageProps } from "@/hocs/withPageErrorHandling";
import { fetchResults } from "@/context/Search/search-api/2023/fetchResults";
import {
  RequestStatus,
  SearchHit,
  searchPageParamsSchema,
} from "@/context/Search/search.types";

export const metadata: Metadata = {
  title: "Search for Free Teaching Resources",
  description: "Search for Free Teaching Resources",
  robots: {
    index: false,
    follow: true,
  },
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
