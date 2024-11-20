import { useFeatureFlagEnabled } from "posthog-js/react";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

type LessonMediaData = {
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
  keyStageSlug: string;
  subjectTitle: string;
  subjectSlug: string;
  unitTitle: string;
  lessonTitle: string;
};

export type LessonMediaPageProps = {
  curriculumData: LessonMediaData;
};

/**
 * TODO: Update schema definitions for LessonMediaData
 * TODO: Add test file for LessonMediaPage
 * TODO: Extrapolate schema definitions, functions etc into correct areas
 * @returns
 */

const LessonMediaPage: NextPage<LessonMediaPageProps> = ({
  curriculumData,
}) => {
  const isMediaPageContentEnabled = useFeatureFlagEnabled(
    "is_media_page_content_enabled",
  );
  if (!isMediaPageContentEnabled) return null;

  const {
    lessonTitle,
    keyStageSlug,
    subjectTitle,
    programmeSlug,
    unitSlug,
    lessonSlug,
  } = curriculumData;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson Media: ${lessonTitle} | ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
          description: "Extra video and audio for the lesson",
          canonicalURL: `${getBrowserConfig("seoAppUrl")}/teachers/programmes/${
            programmeSlug
          }/units/${unitSlug}/lessons/${lessonSlug}`,
        }),
      }}
    >
      <LessonMedia isCanonical={false} lesson={curriculumData} />
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
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
  LessonMediaPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "lessonMedia::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug, programmeSlug, unitSlug } = context.params;

      const curriculumData = await curriculumApi2023.mediaClips({
        lessonSlug,
        programmeSlug,
        unitSlug,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<LessonMediaPageProps> = {
        props: {
          curriculumData: { ...curriculumData.browseData },
        },
      };
      return results;
    },
  });
};

export default LessonMediaPage;
