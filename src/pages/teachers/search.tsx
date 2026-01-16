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
import PaginationHead from "@/components/SharedComponents/Pagination/PaginationHead";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

type SearchPageProps = {
  curriculumData: SearchPageData;
  topNav: TopNavProps;
};

const SearchPage: NextPage<SearchPageProps> = (props) => {
  const { curriculumData, topNav } = props;
  const {
    subjects: allSubjects,
    keyStages: allKeyStages,
    contentTypes: allContentTypes,
    examBoards: allExamBoards,
    yearGroups: allYearGroups,
  } = curriculumData;

  const searchProps = useSearch({
    allKeyStages,
    allYearGroups,
    allSubjects,
    allContentTypes,
    allExamBoards,
    legacy: [{ slug: "new", title: "Show new only" }],
  });

  const { results } = searchProps;

  const paginationProps = usePagination({
    totalResults: results.length,
    pageSize: RESULTS_PER_PAGE,
    items: results,
  });

  const {
    paginationTitle,
    prevPageUrlObject,
    nextPageUrlObject,
    isLastPage,
    isFirstPage,
  } = paginationProps;

  const searchFilters = useSearchFilters({
    ...searchProps,
    allKeyStages,
    allYearGroups,
    allSubjects,
    allContentTypes,
    allExamBoards,
  });

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <PaginationHead
        prevPageUrlObject={prevPageUrlObject}
        nextPageUrlObject={nextPageUrlObject}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
      />
      <AppLayout
        topNavProps={topNav}
        seoProps={{
          ...getSeoProps({
            title: `Search for Free Teaching Resources${paginationTitle}`,
            description: "Search for Free Teaching Resources",
          }),
          noIndex: true,
        }}
        $background="bg-btn-secondary-hover"
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
      const topNav = await curriculumApi2023.topNav();

      const results = {
        props: {
          curriculumData,
          topNav,
        },
      };
      return results;
    },
  });
};

export default SearchPage;
