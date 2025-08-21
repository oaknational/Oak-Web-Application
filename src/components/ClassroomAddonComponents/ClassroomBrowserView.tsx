import {
  oakDefaultTheme,
  OakGrid,
  OakGridArea,
  OakMaxWidth,
  OakThemeProvider,
} from "@oaknational/oak-components";
import React from "react";

import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import PaginationHead from "@/components/SharedComponents/Pagination/PaginationHead";
import HeaderListing from "@/components/TeacherComponents/HeaderListing";
import isSlugEYFS from "@/utils/slugModifiers/isSlugEYFS";
import removeLegacySlugSuffix from "@/utils/slugModifiers/removeLegacySlugSuffix";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import LessonList from "@/components/TeacherComponents/LessonList";
import { TeacherRedirectedOverlay } from "@/components/TeacherComponents/TeacherRedirectedOverlay/TeacherRedirectedOverlay";
import { LessonListingPageData } from "@/node-lib/curriculum-api-2023/queries/lessonListing/lessonListing.schema";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import { RESULTS_PER_PAGE } from "@/utils/resultsPerPage";
import { LessonListItemProps } from "@/components/TeacherComponents/LessonListItem";

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
  return lessons.map((lesson) => {
    if (lesson.isUnpublished) {
      return lesson;
    } else {
      return {
        ...lesson,
        ...rest,
      };
    }
  });
}

type Props = {
  curriculumData: LessonListingPageData;
  onLessonSelected: (props: LessonListItemProps) => void;
};
export const ClassroomBrowserView = ({
  curriculumData,
  onLessonSelected,
}: Props) => {
  const {
    unitSlug,
    keyStageTitle,
    keyStageSlug,
    unitTitle,
    subjectTitle,
    programmeSlug,
    subjectSlug,
    year,
    containsGeorestrictedLessons,
    containsLoginRequiredLessons,
  } = curriculumData;

  const lessons = getHydratedLessonsFromUnit(curriculumData);

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

  const unpublishedLessonCount = lessons.filter(
    (lesson) => lesson.isUnpublished && !lesson.expired,
  ).length;
  const lessonCountHeader = unpublishedLessonCount
    ? `${lessons.length - unpublishedLessonCount}/${lessons.length} lessons available`
    : `Lessons (${lessons.length})`;
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `${unitTitle} ${keyStageSlug.toUpperCase()} | Y${year} ${subjectTitle} Lesson Resources${paginationTitle}`,
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
          hasCurriculumDownload={isSlugLegacy(programmeSlug)}
          {...curriculumData}
          isGeorestrictedUnit={containsGeorestrictedLessons}
          isLoginRequiredUnit={containsLoginRequiredLessons}
          isNew={false}
        />
        <OakMaxWidth $ph={"inner-padding-m"}>
          <OakGrid>
            <OakGridArea
              $colSpan={[12, 9]}
              $mt={["space-between-s", "space-between-m2"]}
            >
              <LessonList
                {...curriculumData}
                lessonCount={lessons.length}
                lessonCountHeader={lessonCountHeader}
                currentPageItems={currentPageItems}
                paginationProps={paginationProps}
                headingTag={"h2"}
                unitTitle={unitTitle}
                onClick={(v) => console.log("clicked", v)}
                showCheckboxes={true}
                onCheckboxSelected={onLessonSelected}
              />
            </OakGridArea>
          </OakGrid>
        </OakMaxWidth>
        <TeacherRedirectedOverlay />
      </OakThemeProvider>
    </AppLayout>
  );
};
