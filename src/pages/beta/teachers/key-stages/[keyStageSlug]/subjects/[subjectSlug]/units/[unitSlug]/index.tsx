import React from "react";
import { NextPage, GetServerSideProps, GetServerSidePropsResult } from "next";

import { getSeoProps } from "../../../../../../../../../browser-lib/seo/getSeoProps";
import AppLayout from "../../../../../../../../../components/AppLayout";
import MaxWidth from "../../../../../../../../../components/MaxWidth/MaxWidth";
import curriculumApi, {
  TeachersKeyStageSubjectUnitsLessonsData,
} from "../../../../../../../../../node-lib/curriculum-api";
import TitleCard from "../../../../../../../../../components/Card/SubjectUnitLessonTitleCard";
import usePagination from "../../../../../../../../../components/Pagination/usePagination";
import Box from "../../../../../../../../../components/Box";
import LessonList from "../../../../../../../../../components/UnitAndLessonLists/LessonList";
import Breadcrumbs from "../../../../../../../../../components/Breadcrumbs";
import CurriculumDownloadButton from "../../../../../../../../../components/CurriculumDownloadButtons/CurriculumDownloadButton";
export type LessonListPageProps = {
  curriculumData: TeachersKeyStageSubjectUnitsLessonsData;
};

const LessonListPage: NextPage<LessonListPageProps> = ({ curriculumData }) => {
  const {
    unitSlug,
    keyStageTitle,
    keyStageSlug,
    unitTitle,
    lessons,
    subjectSlug,
    subjectTitle,
  } = curriculumData;

  const paginationProps = usePagination({
    totalResults: lessons.length,
    pageSize: 20,
    items: lessons,
  });

  const { currentPageItems } = paginationProps;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: "Lesson Listing", // @todo add real data
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
              { oakLinkProps: { page: "beta-teachers-home" }, label: "Home" },
              {
                oakLinkProps: { page: "subject-index", slug: keyStageSlug },
                label: keyStageTitle,
              },
              {
                oakLinkProps: {
                  page: "unit-index",
                  keyStage: keyStageSlug,
                  subject: subjectSlug,
                },
                label: subjectTitle,
              },

              {
                oakLinkProps: {
                  page: "lesson-index",
                  slug: unitSlug,
                  keyStage: keyStageSlug,
                  subject: subjectSlug,
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
          keyStage={keyStageSlug}
          subject={subjectSlug}
          lessonPage={true}
        />

        <Box $mt={56}>
          <LessonList
            {...curriculumData}
            currentPageItems={currentPageItems}
            paginationProps={paginationProps}
            headingTag={"h2"}
          />
        </Box>
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  keyStageSlug: string;
  subjectSlug: string;
  unitSlug: string;
};

export const getServerSideProps: GetServerSideProps<
  LessonListPageProps,
  URLParams
> = async (context) => {
  if (!context.params) {
    throw new Error("no context.params");
  }
  const { keyStageSlug, subjectSlug, unitSlug } = context.params;
  if (!keyStageSlug || !subjectSlug || !unitSlug) {
    throw new Error("unexpected context.params");
  }
  const curriculumData = await curriculumApi.teachersKeyStageSubjectUnitLessons(
    {
      keyStageSlug,
      subjectSlug,
      unitSlug,
    }
  );

  const results: GetServerSidePropsResult<LessonListPageProps> = {
    props: {
      curriculumData,
    },
  };
  return results;
};

export default LessonListPage;
