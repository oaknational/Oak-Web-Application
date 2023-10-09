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
import getPageProps from "@/node-lib/getPageProps";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import { LessonOverview } from "@/components/Lesson/LessonOverview/LessonOverview.page";
import { getCaptionsFromFile } from "@/utils/handleTranscript";

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
      <LessonOverview lesson={{ ...curriculumData, isCanonical: false }} />
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
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

      const curriculumData = isSlugLegacy(programmeSlug)
        ? await curriculumApi.lessonOverview({
            programmeSlug,
            lessonSlug,
            unitSlug,
          })
        : await curriculumApi2023.lessonOverview({
            programmeSlug,
            lessonSlug,
            unitSlug,
          });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const { videoTitle } = curriculumData;
      if (videoTitle && !isSlugLegacy(programmeSlug)) {
        // For new content we need to fetch the captions file from gCloud and parse the result to generate
        // the transcript sentences.
        const fileName = `${videoTitle}.vtt`;
        const transcript = await getCaptionsFromFile(fileName);
        if (transcript) {
          curriculumData.transcriptSentences = transcript;
        }
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
