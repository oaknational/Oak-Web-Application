import React from "react";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import AppLayout from "@/components/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import curriculumApi, { LessonOverviewData } from "@/node-lib/curriculum-api";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { ViewType } from "@/common-lib/urls";
import getPageProps from "@/node-lib/getPageProps";
import TeachersLessonOverviewPage from "@/components/pages/TeachersLessonOverview/TeachersLessonOverview";

export type LessonOverviewPageProps = {
  curriculumData: LessonOverviewData;
};

const LessonOverviewPage: NextPage<LessonOverviewPageProps> = ({
  curriculumData,
}) => {
  const { lessonTitle, keyStageSlug, subjectTitle } = curriculumData;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson: ${lessonTitle} | ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
          description: "Overview of lesson",
        }),
        ...{ noFollow: true, noIndex: true },
      }}
    >
      <TeachersLessonOverviewPage
        lesson={{ ...curriculumData, isCanonical: false }}
      />
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
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
  LessonOverviewPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "lesson-overview::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug, unitSlug, programmeSlug } = context.params;

      const curriculumData =
        context?.params.viewType === "teachers-2023"
          ? await curriculumApi2023.lessonOverview({
              programmeSlug,
              lessonSlug,
              unitSlug,
            })
          : await curriculumApi.lessonOverview({
              programmeSlug,
              lessonSlug,
              unitSlug,
            });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<LessonOverviewPageProps> = {
        props: {
          curriculumData,
        },
      };

      return results;
    },
  });
};

export default LessonOverviewPage;
