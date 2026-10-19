import React, { cache } from "react";
import { Metadata } from "next";

import { SearchView } from "./SearchView";

import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { curriculumApiWithCache } from "@/node-lib/cache";

export const metadata: Metadata = {
  title: "Search for Free Teaching Resources",
  description: "Search for Free Teaching Resources",
  robots: {
    index: false,
    follow: true,
  },
};

const getCachedSearchPage = cache(async () => {
  return curriculumApiWithCache({ queryKey: "searchPage", args: [] });
});

async function SearchPage() {
  const curriculumData = await getCachedSearchPage();

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel={"search"}
    >
      <SearchView curriculumData={curriculumData} />
    </TeacherBrowseAnalyticsStoreProvider>
  );
}

export default SearchPage;
