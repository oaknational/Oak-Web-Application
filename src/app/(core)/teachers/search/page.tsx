import React, { Suspense } from "react";
import { Metadata } from "next";

import { SearchView } from "./SearchView";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export const metadata: Metadata = {
  title: "Search for Free Teaching Resources",
  description: "Search for Free Teaching Resources",
  robots: {
    index: false,
    follow: true,
  },
};

async function SearchPage() {
  const curriculumData = await curriculumApi2023.searchPage();

  return (
    <Suspense fallback={null}>
      <SearchView curriculumData={curriculumData} />
    </Suspense>
  );
}

export default SearchPage;
