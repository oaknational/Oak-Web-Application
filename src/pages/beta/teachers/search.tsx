import React from "react";
import { GetStaticProps, NextPage } from "next";

import { BETA_SEO_PROPS } from "../../../browser-lib/seo/Seo";
import AppLayout from "../../../components/AppLayout";
import useSearch from "../../../context/Search/useSearch";
import Search from "../../../components/SearchComponents/Search.page";
import useKeyStageFilters from "../../../context/Search/useKeyStageFilters";
import curriculumApi, {
  SearchPageData,
} from "../../../node-lib/curriculum-api";
import { decorateWithIsr } from "../../../node-lib/isr";

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
  return (
    <AppLayout seoProps={BETA_SEO_PROPS} $background="grey1">
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
