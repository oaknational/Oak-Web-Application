import React from "react";
import {
  NextPage,
  GetStaticProps,
  GetStaticPropsResult,
  GetStaticPathsResult,
} from "next";
import {
  OakGrid,
  OakGridArea,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import LessonList from "@/components/TeacherComponents/LessonList";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
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
import { NEW_COHORT } from "@/config/cohort";
import { SpecialistLesson } from "@/node-lib/curriculum-api-2023/queries/specialistLessonListing/specialistLessonListing.schema";
import NewContentBanner from "@/components/TeacherComponents/NewContentBanner/NewContentBanner";
import removeLegacySlugSuffix from "@/utils/slugModifiers/removeLegacySlugSuffix";
import isSlugEYFS from "@/utils/slugModifiers/isSlugEYFS";
import PaginationHead from "@/components/SharedComponents/Pagination/PaginationHead";
import { isLessonListItem } from "@/components/TeacherComponents/LessonListItem/LessonListItem";
import { useShareExperiment } from "@/pages-helpers/teacher/share-experiments/useShareExperiment";

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
    subjectSlug,
  } = curriculumData;

  const { shareIdRef, shareIdKeyRef } = useShareExperiment({
    unitSlug: unitSlug ?? undefined,
    programmeSlug: programmeSlug ?? undefined,
    source: "lesson-listing",
  });
  console.log(shareIdRef, shareIdKeyRef);

  const lessons = getHydratedLessonsFromUnit(curriculumData);
  const hasNewContent = lessons[0]?.lessonCohort === NEW_COHORT;
  const paginationProps = usePagination({
    totalResults: lessons.length,
    pageSize: RESULTS_PER_PAGE,
    items: lessons,
  });

  const {
    currentPageItems,
    paginationTitle,
    prevPageUrlObject,
    nextPageUrlObject,
    isFirstPage,
    isLastPage,
  } = paginationProps;

  const { track } = useAnalytics();

  const trackLessonSelected = ({
    ...props
  }: LessonListItemProps | SpecialistLesson) => {
    if (isLessonListItem(props)) {
      track.lessonAccessed({
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "use",
        componentType: "lesson_card",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        lessonName: props.lessonTitle,
        lessonSlug: props.lessonSlug,
        unitName: unitTitle,
        unitSlug: unitSlug,
        keyStageSlug: keyStageSlug,
        keyStageTitle: keyStageTitle as KeyStageTitleValueType,
        yearGroupName: props.yearTitle,
        yearGroupSlug: props.yearSlug,
      });
    }
  };

  const isNew = hasNewContent ?? false;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Unit: ${unitTitle} | ${keyStageSlug.toUpperCase()} ${subjectTitle}${paginationTitle}`,
          description: `Free lessons and teaching resources about ${unitTitle.toLowerCase()}`,
        }),
      }}
      $background="white"
    >
      <PaginationHead
        prevPageUrlObject={prevPageUrlObject}
        nextPageUrlObject={nextPageUrlObject}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
      />
      <OakThemeProvider theme={oakDefaultTheme}>
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
                programmeSlug:
                  subjectSlug === "maths" && !isSlugEYFS(programmeSlug)
                    ? removeLegacySlugSuffix(programmeSlug)
                    : programmeSlug,
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
            <OakGridArea $colSpan={[12, 9]}>
              <NewContentBanner
                keyStageSlug={keyStageSlug}
                subjectSlug={subjectSlug}
                subjectTitle={subjectTitle.toLowerCase()}
                programmeSlug={programmeSlug}
                isLegacy={isSlugLegacy(programmeSlug)}
              />
            </OakGridArea>
          </OakGrid>
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
      </OakThemeProvider>
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

      const curriculumData = await curriculumApi2023.lessonListing({
        programmeSlug,
        unitSlug,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

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
