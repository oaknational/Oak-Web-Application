import React from "react";
import { NextPage, GetServerSideProps, GetServerSidePropsResult } from "next";

import { getSeoProps } from "../../../../../../../../../browser-lib/seo/getSeoProps";
import AppLayout from "../../../../../../../../../components/AppLayout";
import MaxWidth from "../../../../../../../../../components/MaxWidth/MaxWidth";
import teachersKeyStageSubjectUnitsLessonsFixture from "../../../../../../../../../node-lib/curriculum-api/fixtures/teachersLessons.fixture";
import { TeachersKeyStageSubjectUnitsLessonsData } from "../../../../../../../../../node-lib/curriculum-api";
import SubjectErrorCard from "../../../../../../../../../components/Card/SubjectErrorCard";
import Flex from "../../../../../../../../../components/Flex";
import TitleCard from "../../../../../../../../../components/Card/TitleCard";
import LessonList from "../../../../../../../../../components/Lessons/LessonList/LessonList";
import usePagination from "../../../../../../../../../components/Pagination/usePagination";

type LessonListPageProps = {
  curriculumData: TeachersKeyStageSubjectUnitsLessonsData;
};

const LessonListPage: NextPage<LessonListPageProps> = ({ curriculumData }) => {
  const {
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
      seoProps={getSeoProps({
        title: "Lesson Listing", // @todo add real data
        description: "Lessons in Unit",
      })}
      $background="white"
    >
      <MaxWidth $ph={16}>
        <Flex $mt={24} $mb={32}>
          <SubjectErrorCard
            buttonProps={{
              label: "Find out why",
              page: null,
              href: "/",
            }}
            headingTag={"h3"}
            heading={"Some subjects unavailable"}
            text={"Unfortunately some subjects are now unavailable."}
          />
        </Flex>
        <TitleCard
          page={"lesson"}
          keyStage={keyStageTitle}
          keyStageSlug={keyStageSlug}
          subjectSlug={subjectSlug}
          subject={subjectTitle}
          title={unitTitle}
          iconName={"Rocket"}
          $mb={24}
          $alignSelf={"flex-start"}
        />
        <LessonList
          {...curriculumData}
          currentPageItems={currentPageItems}
          paginationProps={paginationProps}
          headingTag={"h2"}
        />
      </MaxWidth>
    </AppLayout>
  );
};

type URLParams = { unitSlug: string };

export const getServerSideProps: GetServerSideProps<
  LessonListPageProps,
  URLParams
> = async () => {
  const curriculumData = teachersKeyStageSubjectUnitsLessonsFixture();

  const results: GetServerSidePropsResult<LessonListPageProps> = {
    props: {
      curriculumData,
    },
  };
  return results;
};

export default LessonListPage;
