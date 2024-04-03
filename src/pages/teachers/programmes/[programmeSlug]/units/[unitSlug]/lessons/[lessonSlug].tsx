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
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import { LessonOverview } from "@/components/TeacherViews/LessonOverview/LessonOverview.view";
import { getCaptionsFromFile, formatSentences } from "@/utils/handleTranscript";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

export type LessonOverviewPageProps = {
  curriculumData: LessonOverviewPageData;
};

const LessonOverviewPage: NextPage<LessonOverviewPageProps> = ({
  curriculumData,
}) => {
  const { lessonTitle, keyStageSlug, subjectTitle, tierTitle, examBoardTitle } =
    curriculumData;

  const getLessonData = () => {
    if (tierTitle && examBoardTitle) {
      return ` | ${tierTitle} | ${examBoardTitle}`;
    } else if (tierTitle) {
      return ` | ${tierTitle}`;
    } else if (examBoardTitle) {
      return ` | ${examBoardTitle}`;
    } else return "";
  };

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson: ${lessonTitle}${getLessonData()} | ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
          description:
            "View lesson content and choose resources to download or share",
        }),
      }}
    >
      <LessonOverview
        lesson={{ ...curriculumData, isCanonical: false, isSpecialist: false }}
      />
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

      const curriculumData = await curriculumApi2023.lessonOverview({
        programmeSlug,
        lessonSlug,
        unitSlug,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const { videoTitle, transcriptSentences } = curriculumData;
      if (videoTitle && !isSlugLegacy(programmeSlug) && !transcriptSentences) {
        // For new content we need to fetch the captions file from gCloud and parse the result to generate
        // the transcript sentences.
        const fileName = `${videoTitle}.vtt`;
        const transcript = await getCaptionsFromFile(fileName);
        if (transcript) {
          curriculumData.transcriptSentences = transcript;
        }
      } else if (transcriptSentences && !Array.isArray(transcriptSentences)) {
        const splitTranscript = transcriptSentences.split(/\r?\n/);
        const formattedTranscript = formatSentences(splitTranscript);

        curriculumData.transcriptSentences = formattedTranscript;
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
