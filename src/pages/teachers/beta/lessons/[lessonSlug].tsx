import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { LessonOverview } from "@/components/TeacherViews/LessonOverview/LessonOverview.view";

export type TeacherPreviewLessonPageProps = {
  curriculumData: LessonOverviewPageData;
};

const TeacherPreviewLessonPage: NextPage<TeacherPreviewLessonPageProps> = ({
  curriculumData,
}) => {
  const { lessonTitle } = curriculumData;
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson: ${lessonTitle} preview}`,
          description:
            "View lesson content and choose resources to download or share",
        }),
      }}
    >
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonOverview
          lesson={{
            ...curriculumData,
            isCanonical: false,
            isSpecialist: false,
          }}
        />
      </OakThemeProvider>
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
  TeacherPreviewLessonPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "teachers-preview-lesson::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug } = context.params;

      const curriculumData = await curriculumApi2023.teacherPreviewLesson({
        lessonSlug,
      });

      const results: GetStaticPropsResult<TeacherPreviewLessonPageProps> = {
        props: {
          curriculumData,
        },
      };

      return results;
    },
  });
};

export default TeacherPreviewLessonPage;
