import {
  NextPage,
  GetStaticProps,
  GetStaticPathsResult,
  GetStaticPropsResult,
} from "next";

import AppLayout from "@/components/SharedComponents/AppLayout";
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
import { LessonDownloads } from "@/components/TeacherViews/LessonDownloads.view";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import { LEGACY_COHORT } from "@/config/cohort";

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
      const isEyfs = programmeSlug.endsWith("early-years-foundation-stage");

      // TODO: is there a better way to do this
      const cohortRegex = isEyfs ? `${LEGACY_COHORT}` : `(?!${LEGACY_COHORT})`;

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
            lessonCohort: cohortRegex,
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
