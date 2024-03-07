import {
  NextPage,
  GetStaticProps,
  GetStaticPathsResult,
  GetStaticPropsResult,
} from "next";

import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import curriculumApi from "@/node-lib/curriculum-api";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import getPageProps from "@/node-lib/getPageProps";
import { LessonShare } from "@/components/TeacherViews/LessonShare/LessonShare.view";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { LessonShareData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";
import shouldUseLegacyApi from "@/utils/slugModifiers/shouldUseLegacyApi";

export type LessonSharePageProps = {
  curriculumData: LessonShareData;
};

const LessonSharePage: NextPage<LessonSharePageProps> = ({
  curriculumData,
}) => {
  const { lessonTitle, keyStageSlug, subjectTitle } = curriculumData;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson Share: ${lessonTitle} | ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
          description: "Lesson share",
        }),
        ...{ noFollow: true, noIndex: true },
      }}
    >
      <LessonShare isCanonical={false} lesson={curriculumData} />
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
  LessonSharePageProps,
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

      const curriculumData = shouldUseLegacyApi(programmeSlug)
        ? await curriculumApi.lessonShare({
            programmeSlug,
            unitSlug,
            lessonSlug,
          })
        : await curriculumApi2023.lessonShare({
            programmeSlug,
            unitSlug,
            lessonSlug,
          });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<LessonSharePageProps> = {
        props: {
          curriculumData,
        },
      };
      return results;
    },
  });
};

export default LessonSharePage;
