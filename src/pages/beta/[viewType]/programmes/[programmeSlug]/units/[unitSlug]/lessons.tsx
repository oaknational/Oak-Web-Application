import React from "react";
import {
  NextPage,
  GetStaticProps,
  GetStaticPropsResult,
  GetStaticPathsResult,
} from "next";

import curriculumApi from "../../../../../../../node-lib/curriculum-api";
import usePagination from "../../../../../../../components/Pagination/usePagination";
import AppLayout from "../../../../../../../components/AppLayout";
import { getSeoProps } from "../../../../../../../browser-lib/seo/getSeoProps";
import MaxWidth from "../../../../../../../components/MaxWidth/MaxWidth";
import Box from "../../../../../../../components/Box";
import Breadcrumbs from "../../../../../../../components/Breadcrumbs";
import TitleCard from "../../../../../../../components/Card/SubjectUnitLessonTitleCard";
import CurriculumDownloadButton from "../../../../../../../components/CurriculumDownloadButtons/CurriculumDownloadButton";
import LessonList from "../../../../../../../components/UnitAndLessonLists/LessonList";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "../../../../../../../node-lib/isr";
import { RESULTS_PER_PAGE } from "../../../../../../../utils/resultsPerPage";
import { ViewType } from "../../../../../../../common-lib/urls";
import curriculumApi2023 from "../../../../../../../node-lib/curriculum-api-2023";
import { LessonListingPageData } from "../../../../../../../node-lib/curriculum-api-2023/queries/lessonListing/lessonListing.schema";
import getPageProps from "../../../../../../../node-lib/getPageProps";

export type LessonListingPageProps = {
  curriculumData: LessonListingPageData;
};

/**
 * This function takes a unit and returns an array of lessons with the unit data
 * embedded in each lesson.
 *
 * We do this so that we don't have to send duplicate unit data for each lesson.
 * This data gets stored in the browser and is used to render the lesson list,
 * so it's important to keep it as small as possible.
 */
function getHydratedLessonsFromUnit(unit: LessonListingPageData) {
  const { lessons, ...rest } = unit;
  return lessons.map((lesson) => ({
    ...lesson,
    ...rest,
  }));
}

const LessonListPage: NextPage<LessonListingPageProps> = ({
  curriculumData,
}) => {
  const {
    unitSlug,
    keyStageTitle,
    keyStageSlug,
    unitTitle,
    subjectSlug,
    subjectTitle,
    programmeSlug,
  } = curriculumData;

  const lessons = getHydratedLessonsFromUnit(curriculumData);

  const paginationProps = usePagination({
    totalResults: lessons.length,
    pageSize: RESULTS_PER_PAGE,
    items: lessons,
  });

  const { currentPageItems, paginationTitle } = paginationProps;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Unit: ${unitTitle} | ${keyStageSlug.toUpperCase()} ${subjectTitle}${paginationTitle}`,
          description: "Lessons in Unit",
        }),
        ...{ noFollow: true, noIndex: true },
      }}
      $background="white"
    >
      <MaxWidth $ph={16}>
        <Box $mv={[24, 48]}>
          <Breadcrumbs
            breadcrumbs={[
              {
                oakLinkProps: {
                  page: "home",
                  viewType: "teachers",
                },
                label: "Home",
              },
              {
                oakLinkProps: {
                  page: "subject-index",
                  viewType: "teachers",
                  keyStageSlug,
                },
                label: keyStageTitle,
              },
              {
                oakLinkProps: {
                  page: "unit-index",
                  viewType: "teachers",
                  programmeSlug,
                },
                label: subjectTitle,
              },

              {
                oakLinkProps: {
                  page: "lesson-index",
                  viewType: "teachers",
                  unitSlug,
                  programmeSlug: programmeSlug,
                },

                label: unitTitle,
                disabled: true,
              },
            ]}
          />
        </Box>

        <TitleCard
          page={"lessons"}
          keyStage={keyStageTitle}
          keyStageSlug={keyStageSlug}
          subjectSlug={subjectSlug}
          subject={subjectTitle}
          title={unitTitle}
          $mt={0}
          $mb={24}
          $alignSelf={"flex-start"}
        />

        <CurriculumDownloadButton
          keyStageSlug={keyStageSlug}
          keyStageTitle={keyStageTitle}
          subjectSlug={subjectSlug}
          subjectTitle={subjectTitle}
          lessonPage={true}
        />

        <Box $mt={56}>
          <LessonList
            {...curriculumData}
            lessonCount={lessons.length}
            currentPageItems={currentPageItems}
            paginationProps={paginationProps}
            headingTag={"h2"}
            unitTitle={unitTitle}
          />
        </Box>
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  programmeSlug: string;
  unitSlug: string;
  viewType: ViewType;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  LessonListingPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "lesson-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("no context.params");
      }
      const { programmeSlug, unitSlug } = context.params;
      if (!programmeSlug || !unitSlug) {
        throw new Error("unexpected context.params");
      }

      const curriculumData =
        context?.params?.viewType === "teachers-2023"
          ? await curriculumApi2023.lessonListing({
              programmeSlug,
              unitSlug,
            })
          : await curriculumApi.lessonListing({
              programmeSlug,
              unitSlug,
            });

      const results: GetStaticPropsResult<LessonListingPageProps> = {
        props: {
          curriculumData,
        },
      };
      return results;
    },
  });
};

export default LessonListPage;
