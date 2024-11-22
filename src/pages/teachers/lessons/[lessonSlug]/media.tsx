import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { useFeatureFlagEnabled } from "posthog-js/react";

import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import { LessonMediaClipsCanonical } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

type LessonMediaCanonicalPageProps = {
  curriculumData: LessonMediaClipsCanonical;
};

const LessonMediaCanonicalPage: NextPage<LessonMediaCanonicalPageProps> = ({
  curriculumData,
}) => {
  const isMediaPageContentEnabled = useFeatureFlagEnabled(
    "is_media_page_content_enabled",
  );
  if (!isMediaPageContentEnabled) null;

  const { lessonTitle } = curriculumData;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson Share: ${lessonTitle}`,
          description:
            "Share online lesson activities with your students, such as videos, worksheets and quizzes.",
        }),
      }}
    >
      <LessonMedia isCanonical={true} lesson={curriculumData} />
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
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
  LessonMediaCanonicalPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "share::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug } = context.params;

      const curriculumData =
        await curriculumApi2023.lessonMediaClips<LessonMediaClipsCanonical>({
          lessonSlug,
        });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<LessonMediaCanonicalPageProps> = {
        props: {
          curriculumData,
        },
      };
      return results;
    },
  });
};

export default LessonMediaCanonicalPage;
