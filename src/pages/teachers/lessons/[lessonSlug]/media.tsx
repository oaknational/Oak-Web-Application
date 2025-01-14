import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import { CanonicalLessonMediaClips } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import withFeatureFlag from "@/hocs/withFeatureFlag";

export type CanonicalLessonMediaClipsPageProps = {
  curriculumData: CanonicalLessonMediaClips;
};

export const CanonicalLessonMediaClipsPage: NextPage<
  CanonicalLessonMediaClipsPageProps
> = ({ curriculumData }) => {
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
  CanonicalLessonMediaClipsPageProps,
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
        await curriculumApi2023.lessonMediaClips<CanonicalLessonMediaClips>({
          lessonSlug,
        });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<CanonicalLessonMediaClipsPageProps> =
        {
          props: {
            curriculumData,
          },
        };
      return results;
    },
  });
};

const CanoncicalLessonMediaPageWithFeatureFlag = withFeatureFlag(
  CanonicalLessonMediaClipsPage,
  "is_media_page_content_enabled",
);

export default CanoncicalLessonMediaPageWithFeatureFlag;
