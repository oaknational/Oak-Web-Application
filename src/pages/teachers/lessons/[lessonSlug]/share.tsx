import {
  NextPage,
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
import { LessonShare } from "@/components/TeacherViews/LessonShare/LessonShare.view";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { LessonShareCanonical } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";

export type LessonSharePageProps = {
  curriculumData: LessonShareCanonical;
};

const LessonSharePage: NextPage<LessonSharePageProps> = ({
  curriculumData,
}) => {
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
      <LessonShare isCanonical={true} lesson={curriculumData} />
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
      const { lessonSlug } = context.params;

      const curriculumData =
        await curriculumApi2023.lessonShare<LessonShareCanonical>({
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
