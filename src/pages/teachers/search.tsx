import React from "react";
import { GetStaticProps, NextPage } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import AppLayout from "@/components/SharedComponents/AppLayout";
import useSearch from "@/context/Search/useSearch";
import Search from "@/components/TeacherViews/Search/Search.view";
import curriculumApi2023, {
  SearchPageData,
} from "@/node-lib/curriculum-api-2023";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import useSearchFilters from "@/context/Search/useSearchFilters";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import { RESULTS_PER_PAGE } from "@/components/TeacherComponents/SearchResults";
import getPageProps from "@/node-lib/getPageProps";

type SearchPageProps = {
  curriculumData: SearchPageData;
};

const SearchPage: NextPage<SearchPageProps> = (props) => {
  const { curriculumData } = props;
  const {
    subjects: allSubjects,
    keyStages: allKeyStages,
    contentTypes: allContentTypes,
    examBoards: allExamBoards,
  } = curriculumData;

  const searchProps = useSearch({
    allKeyStages,
    allSubjects,
    allContentTypes,
    allExamBoards,
    legacy: "filterOutEYFS",
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
    allExamBoards,
  });
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <AppLayout
        seoProps={{
          ...getSeoProps({
            title: `Search for Free Teaching Resources${paginationTitle}`,

            description: "Search for Free Teaching Resources",
          }),
        }}
        $background="grey20"
      >
        <Search
          {...searchProps}
          searchFilters={searchFilters}
          allKeyStages={allKeyStages}
        />
      </AppLayout>
    </OakThemeProvider>
  );
};

export const getStaticProps: GetStaticProps<SearchPageProps> = async (
  context,
) => {
  return getPageProps({
    page: "teachers-search::getStaticProps",
    context,
    getProps: async () => {
      const curriculumData = await curriculumApi2023.searchPage();

      const results = {
        props: {
          curriculumData,
        },
      };
      return results;
    },
  });
};

export default SearchPage;
