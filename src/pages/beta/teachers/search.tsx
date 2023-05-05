import React from "react";
import { GetStaticProps, NextPage } from "next";

import useTrackPageView from "../../../hooks/useTrackPageView";
import AppLayout from "../../../components/AppLayout";
import useSearch from "../../../context/Search/useSearch";
import Search from "../../../components/SearchComponents/Search.page";
import useKeyStageFilters from "../../../context/Search/useKeyStageFilters";
import curriculumApi, {
  SearchPageData,
} from "../../../node-lib/curriculum-api";
import { decorateWithIsr } from "../../../node-lib/isr";
import { getSeoProps } from "../../../browser-lib/seo/getSeoProps";

type SearchPageProps = {
  curriculumData: SearchPageData;
};
const SearchPage: NextPage<SearchPageProps> = (props) => {
  const { curriculumData } = props;
  const allKeyStages = curriculumData.keyStages;
  const searchProps = useSearch({ allKeyStages });
  const keyStageFilters = useKeyStageFilters({
    ...searchProps,
    allKeyStages,
  });
  useTrackPageView({ pageName: "Search" });

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
        keyStageFilters={keyStageFilters}
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
