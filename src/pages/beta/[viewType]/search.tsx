import React from "react";
import { GetStaticPathsResult, GetStaticProps, NextPage } from "next";

import AppLayout from "../../../components/AppLayout";
import useSearch from "../../../context/Search/useSearch";
import Search from "../../../components/SearchComponents/Search.page";
import curriculumApi, {
  SearchPageData,
} from "../../../node-lib/curriculum-api";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "../../../node-lib/isr";
import { getSeoProps } from "../../../browser-lib/seo/getSeoProps";
import useSearchFilters from "../../../context/Search/useSearchFilters";
import usePagination from "../../../components/Pagination/usePagination";
import { RESULTS_PER_PAGE } from "../../../components/SearchResults/SearchResults";
import { VIEW_TYPES, ViewType } from "../../../common-lib/urls";
import curriculumApi2023 from "../../../node-lib/curriculum-api-2023";

type SearchPageProps = {
  curriculumData: SearchPageData;
};

const SearchPage: NextPage<SearchPageProps> = (props) => {
  const { curriculumData } = props;
  const {
    subjects: allSubjects,
    keyStages: allKeyStages,
    contentTypes: allContentTypes,
  } = curriculumData;

  const searchProps = useSearch({
    allKeyStages,
    allSubjects,
    allContentTypes,
  });
  const { results } = searchProps;

  const paginationProps = usePagination({
    totalResults: results.length,
    pageSize: RESULTS_PER_PAGE,
    items: results,
  });

  const { paginationTitle } = paginationProps;

  const searchFilters = useSearchFilters({
    ...searchProps,
    allKeyStages,
    allSubjects,
    allContentTypes,
  });

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Search for Free Teaching Resources${paginationTitle}`,

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

export type URLParams = {
  viewType: ViewType;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const paths = VIEW_TYPES.map((viewType) => ({
    params: { viewType },
  }));

  const config: GetStaticPathsResult<URLParams> = {
    fallback: false,
    paths,
  };
  return config;
};

export const getStaticProps: GetStaticProps<SearchPageProps> = async (
  context
) => {
  const curriculumData =
    context?.params?.viewType === "teachers-2023"
      ? await curriculumApi2023.searchPage()
      : await curriculumApi.searchPage();
  const results = {
    props: {
      curriculumData,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default SearchPage;
