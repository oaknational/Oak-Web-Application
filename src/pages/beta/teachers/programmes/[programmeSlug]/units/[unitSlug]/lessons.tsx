import React from "react";
import {
  NextPage,
  GetStaticProps,
  GetStaticPropsResult,
  GetStaticPathsResult,
} from "next";

import curriculumApi, {
  LessonListing,
} from "../../../../../../../node-lib/curriculum-api";
import useTrackPageView from "../../../../../../../hooks/useTrackPageView";
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

export type LessonListPageProps = {
  curriculumData: LessonListing;
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

  useTrackPageView({ pageName: "Lesson Listing" });

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
              {
                oakLinkProps: { page: "home", viewType: "teachers" },
                label: "Home",
              },
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
          keyStageSlug={keyStageSlug}
          keyStageTitle={keyStageTitle}
          subjectSlug={subjectSlug}
          subjectTitle={subjectTitle}
          lessonPage={true}
        />

        <Box $mt={56}>
          <LessonList
            {...curriculumData}
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
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const { units } = await curriculumApi.getLessonListingPaths();
  const paths = units.map((params: URLParams) => ({ params: params }));

  const config: GetStaticPathsResult<URLParams> = {
    fallback: false,
    paths,
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  LessonListPageProps,
  URLParams
> = async (context) => {
  if (!context.params) {
    throw new Error("no context.params");
  }
  const { programmeSlug, unitSlug } = context.params;
  if (!programmeSlug || !unitSlug) {
    throw new Error("unexpected context.params");
  }

  const curriculumData = await curriculumApi.getLessonListing({
    programmeSlug,
    unitSlug,
  });

  const results: GetStaticPropsResult<LessonListPageProps> = {
    props: {
      curriculumData,
    },
  };
  return results;
};

export default LessonListPage;
