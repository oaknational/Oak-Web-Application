import {
  NextPage,
  GetStaticProps,
  GetStaticPathsResult,
  GetStaticPropsResult,
} from "next";

import AppLayout from "@/components/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import curriculumApi, {
  type LessonDownloadsData,
} from "@/node-lib/curriculum-api";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import LessonDownloads from "@/components/Lesson/LessonDownloads/LessonDownloads.page";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";

export type LessonDownloadsPageProps = {
  curriculumData: LessonDownloadsData;
};

const LessonDownloadsPage: NextPage<LessonDownloadsPageProps> = ({
  curriculumData,
}) => {
  const { lessonTitle, keyStageSlug, subjectTitle } = curriculumData;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson Download: ${lessonTitle} | ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
          description: "Lesson downloads",
        }),
        ...{ noFollow: true, noIndex: true },
      }}
    >
      <LessonDownloads isCanonical={false} lesson={curriculumData} />
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
  LessonDownloadsPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "downloads::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug, programmeSlug, unitSlug } = context.params;

      const isLegacy = isSlugLegacy(programmeSlug);

      const curriculumData = isLegacy
        ? await curriculumApi.lessonDownloads({
            programmeSlug,
            unitSlug,
            lessonSlug,
          })
        : await curriculumApi2023.lessonDownloads({
            programmeSlug,
            unitSlug,
            lessonSlug,
          });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<LessonDownloadsPageProps> = {
        props: {
          curriculumData,
        },
      };
      return results;
    },
  });
};

export default LessonDownloadsPage;
