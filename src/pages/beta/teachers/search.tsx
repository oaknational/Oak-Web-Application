import React from "react";
import { GetStaticProps, NextPage } from "next";

import AppLayout from "../../../components/AppLayout";
import useSearch from "../../../context/Search/useSearch";
import Search from "../../../components/SearchComponents/Search.page";
import curriculumApi, {
  SearchPageData,
} from "../../../node-lib/curriculum-api";
import { decorateWithIsr } from "../../../node-lib/isr";
import { getSeoProps } from "../../../browser-lib/seo/getSeoProps";
import useSearchFilters from "../../../context/Search/useSearchFilters";

type SearchPageProps = {
  curriculumData: SearchPageData;
};
const SearchPage: NextPage<SearchPageProps> = (props) => {
  const { curriculumData } = props;
  const { subjects: allSubjects, keyStages: allKeyStages } = curriculumData;

  const searchProps = useSearch({
    allKeyStages,
    allSubjects,
  });
  const searchFilters = useSearchFilters({
    ...searchProps,
    allKeyStages,
    allSubjects,
  });

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: "Search for Free Teaching Resources",

          description: "Search for Free Teaching Resources",
        }),
        ...{ noFollow: true, noIndex: true },
      }}
      $background="grey1"
    >
      <Search
        {...searchProps}
        searchFilters={searchFilters}
        allKeyStages={allKeyStages}
      />
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps<SearchPageProps> = async () => {
  const curriculumData = await curriculumApi.searchPage();

  const results = {
    props: {
      curriculumData,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default SearchPage;
