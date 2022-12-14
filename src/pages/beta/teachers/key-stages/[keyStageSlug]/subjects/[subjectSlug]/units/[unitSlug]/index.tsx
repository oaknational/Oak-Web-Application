import React from "react";
import { NextPage, GetServerSideProps, GetServerSidePropsResult } from "next";

import { getSeoProps } from "../../../../../../../../../browser-lib/seo/getSeoProps";
import AppLayout from "../../../../../../../../../components/AppLayout";
import MaxWidth from "../../../../../../../../../components/MaxWidth/MaxWidth";
import { Heading } from "../../../../../../../../../components/Typography";
import teachersKeyStageSubjectUnitsLessonsFixture from "../../../../../../../../../node-lib/curriculum-api/fixtures/teachersLessons.fixture";
import { TeachersKeyStageSubjectUnitsLessonsData } from "../../../../../../../../../node-lib/curriculum-api";

type LessonListPageProps = {
  curriculumData: TeachersKeyStageSubjectUnitsLessonsData;
};

const LessonListPage: NextPage<LessonListPageProps> = (props) => {
  const { curriculumData } = props;
  return (
    <AppLayout
      seoProps={getSeoProps({
        title: "Lesson Listing", // @todo add real data
        description: "Lessons in Unit",
      })}
      $background="white"
    >
      <MaxWidth $ph={12} $pt={48} $maxWidth={[480, 840, 1280]}>
        <Heading tag={"h1"} $font={"heading-4"}>
          {curriculumData.unitTitle}
        </Heading>
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
