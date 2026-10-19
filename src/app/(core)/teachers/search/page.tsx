import React, { cache } from "react";
import { Metadata } from "next";

import { SearchView } from "./SearchView";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { applyCurriculumCachePolicy } from "@/node-lib/cache";

export const metadata: Metadata = {
  title: "Search for Free Teaching Resources",
  description: "Search for Free Teaching Resources",
  robots: {
    index: false,
    follow: true,
  },
};

const getCachedSearchPage = cache(async () => {
  "use cache";
  applyCurriculumCachePolicy();

  return curriculumApi2023.searchPage();
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
