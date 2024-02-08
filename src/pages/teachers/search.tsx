import React from "react";
import { GetStaticProps, NextPage } from "next";

import AppLayout from "@/components/SharedComponents/AppLayout";
import useSearch from "@/context/Search/useSearch";
import Search from "@/components/TeacherViews/Search/Search.view";
import curriculumApi2023, {
  SearchPageData,
} from "@/node-lib/curriculum-api-2023";
import curriculumApi from "@/node-lib/curriculum-api";
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
    legacy: "filterOutAll",
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
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Search for Free Teaching Resources${paginationTitle}`,

          description: "Search for Free Teaching Resources",
        }),
        ...{ noFollow: true, noIndex: true },
      }}
      $background="grey20"
    >
      <Search
        {...searchProps}
        searchFilters={searchFilters}
        allKeyStages={allKeyStages}
      />
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps<SearchPageProps> = async (
  context,
) => {
  return getPageProps({
    page: "teachers-search::getStaticProps",
    context,
    getProps: async () => {
      const curriculumData2020 = await curriculumApi.searchPage();
      const curriculumData2023 = await curriculumApi2023.searchPage();

      const subjects = [
        ...curriculumData2020.subjects,
        ...curriculumData2023.subjects,
      ];

      const uniqueSubjects = subjects.reduce(
        (acc: SearchPageData["subjects"], subject) => {
          const existingSubject = acc.find(
            (s: SearchPageData["subjects"][number]) => s.slug === subject.slug,
          );

          if (!existingSubject) {
            acc.push(subject);
          }

          return acc;
        },
        [],
      );

      const curriculumData = {
        ...curriculumData2023,
        subjects: uniqueSubjects,
      };

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
