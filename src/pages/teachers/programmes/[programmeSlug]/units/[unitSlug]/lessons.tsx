import React from "react";
import {
  NextPage,
  GetStaticProps,
  GetStaticPropsResult,
  GetStaticPathsResult,
} from "next";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import LessonList from "@/components/TeacherComponents/LessonList";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import curriculumApi from "@/node-lib/curriculum-api";
import { RESULTS_PER_PAGE } from "@/utils/resultsPerPage";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  LessonListingPageData,
  lessonListingSchema,
} from "@/node-lib/curriculum-api-2023/queries/lessonListing/lessonListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import HeaderListing from "@/components/TeacherComponents/HeaderListing";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import { LessonListItemProps } from "@/components/TeacherComponents/LessonListItem";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { NEW_COHORT } from "@/config/cohort";
import shouldUseLegacyApi from "@/utils/slugModifiers/shouldUseLegacyApi";
import { SpecialistLesson } from "@/node-lib/curriculum-api-2023/queries/specialistLessonListing/specialistLessonListing.schema";

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
function getHydratedLessonsFromUnit(unit: lessonListingSchema) {
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
    subjectTitle,
    programmeSlug,
    hasNewContent,
  } = curriculumData;

  const lessons = getHydratedLessonsFromUnit(curriculumData);

  const paginationProps = usePagination({
    totalResults: lessons.length,
    pageSize: RESULTS_PER_PAGE,
    items: lessons,
  });

  const { currentPageItems, paginationTitle } = paginationProps;

  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const trackLessonSelected = ({
    ...props
  }: LessonListItemProps | SpecialistLesson) => {
    track.lessonSelected({
      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
      keyStageSlug,
      subjectTitle,
      subjectSlug: props.subjectSlug,
      unitName: unitTitle,
      unitSlug,
      lessonName: props.lessonTitle,
      lessonSlug: props.lessonSlug,
      analyticsUseCase,
    });
  };

  const isNew = hasNewContent ?? false;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Unit: ${unitTitle} | ${keyStageSlug.toUpperCase()} ${subjectTitle}${paginationTitle}`,
          description: `Free lessons and teaching resources about ${unitTitle.toLowerCase()}`,
        }),
        ...{ noFollow: true, noIndex: true },
      }}
      $background="white"
    >
      <HeaderListing
        breadcrumbs={[
          {
            oakLinkProps: {
              page: "home",
            },
            label: "Home",
          },
          {
            oakLinkProps: {
              page: "subject-index",
              keyStageSlug,
            },
            label: keyStageTitle,
          },
          {
            oakLinkProps: {
              page: "unit-index",
              programmeSlug,
            },
            label: subjectTitle,
          },

          {
            oakLinkProps: {
              page: "lesson-index",
              unitSlug,
              programmeSlug: programmeSlug,
            },

            label: unitTitle,
            disabled: true,
          },
        ]}
        background={"pink30"}
        subjectIconBackgroundColor={"pink"}
        title={unitTitle}
        programmeFactor={keyStageTitle} // this should be changed to year LESQ-242
        isNew={isNew}
        hasCurriculumDownload={isSlugLegacy(programmeSlug)}
        {...curriculumData}
      />
      <MaxWidth $ph={16}>
        <OakGrid>
          <OakGridArea
            $colSpan={[12, 9]}
            $mt={["space-between-s", "space-between-m2"]}
          >
            <LessonList
              {...curriculumData}
              lessonCount={lessons.length}
              currentPageItems={currentPageItems}
              paginationProps={paginationProps}
              headingTag={"h2"}
              unitTitle={unitTitle}
              onClick={trackLessonSelected}
            />
          </OakGridArea>
        </OakGrid>
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  programmeSlug: string;
  unitSlug: string;
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

      const curriculumData = shouldUseLegacyApi(programmeSlug)
        ? await curriculumApi.lessonListing({
            programmeSlug,
            unitSlug,
          })
        : await curriculumApi2023.lessonListing({
            programmeSlug,
            unitSlug,
          });

      const lessonsCohorts = curriculumData.lessons.map(
        (l) => l.lessonCohort ?? "2020-2023",
      );
      const hasNewContent = lessonsCohorts.includes(NEW_COHORT);

      const results: GetStaticPropsResult<LessonListingPageProps> = {
        props: {
          curriculumData: { ...curriculumData, hasNewContent },
        },
      };
      return results;
    },
  });
};

export default LessonListPage;
