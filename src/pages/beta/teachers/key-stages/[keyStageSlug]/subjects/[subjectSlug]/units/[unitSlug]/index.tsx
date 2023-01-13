import React from "react";
import { NextPage, GetServerSideProps, GetServerSidePropsResult } from "next";

import { getSeoProps } from "../../../../../../../../../browser-lib/seo/getSeoProps";
import AppLayout from "../../../../../../../../../components/AppLayout";
import MaxWidth from "../../../../../../../../../components/MaxWidth/MaxWidth";
import curriculumApi, {
  TeachersKeyStageSubjectUnitsLessonsData,
} from "../../../../../../../../../node-lib/curriculum-api";
import SubjectErrorCard from "../../../../../../../../../components/Card/SubjectErrorCard";
import Flex from "../../../../../../../../../components/Flex";
import TitleCard from "../../../../../../../../../components/Card/TitleCard";
import usePagination from "../../../../../../../../../components/Pagination/usePagination";
import Box from "../../../../../../../../../components/Box";
import LessonList from "../../../../../../../../../components/UnitAndLessonLists/LessonList";

export type LessonListPageProps = {
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
