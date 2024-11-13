import {
  GetStaticProps,
  GetStaticPathsResult,
  GetStaticPropsResult,
} from "next";

import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";

export type LessonMediaPageProps = {
  curriculumData: LessonDownloadsPageData;
};

const LessonMediaPage = ({ curriculumData }: LessonMediaPageProps) => {
  const { lessonTitle, keyStageSlug, subjectTitle } = curriculumData;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson Media: ${lessonTitle} | ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
          description: "Extra video and audio for the lesson",
          canonicalURL: `${getBrowserConfig("seoAppUrl")}/teachers/programmes/${
            curriculumData.programmeSlug
          }/units/${curriculumData.unitSlug}/lessons/${
            curriculumData.lessonSlug
          }`,
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
    page: "media::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug, programmeSlug, unitSlug } = context.params;

      const curriculumData =
        await curriculumApi2023.lessonDownloads<LessonDownloadsPageData>({
          programmeSlug,
          unitSlug,
          lessonSlug,
        });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<LessonMediaPageProps> = {
        props: {
          curriculumData,
        },
      };
      return results;
    },
  });
};

export default LessonMediaPage;
