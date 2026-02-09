import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { LessonOverview } from "@/components/TeacherViews/LessonOverview/LessonOverview.view";
import { convertQuestionMathIdentity } from "@/pages-helpers/shared/lesson-pages/quizMathjax";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

export type TeacherPreviewLessonPageProps = {
  curriculumData: LessonOverviewPageData;
  topNav: TopNavProps;
};

/*
Example URL:
http://localhost:3000/teachers/beta/lessons/running-as-a-team
**/

const TeacherPreviewLessonPage: NextPage<TeacherPreviewLessonPageProps> = ({
  curriculumData,
  topNav,
}) => {
  const { lessonTitle } = curriculumData;
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson: ${lessonTitle} preview`,
          description:
            "View lesson content and choose resources to download or share",
        }),
      }}
      topNavProps={topNav}
    >
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonOverview
          lesson={{
            ...curriculumData,
            isCanonical: false,
            isSpecialist: false,
          }}
          isBeta={true}
        />
      </OakThemeProvider>
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
};

export const getStaticPaths = getStaticPathsTemplate<URLParams>;

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

      const topNav = await curriculumApi2023.topNav();
      const results: GetStaticPropsResult<TeacherPreviewLessonPageProps> = {
        props: {
          topNav,
          curriculumData: {
            ...curriculumData,
            starterQuiz: convertQuestionMathIdentity(
              curriculumData.starterQuiz,
            ),
            exitQuiz: convertQuestionMathIdentity(curriculumData.exitQuiz),
          },
        },
      };

      return results;
    },
  });
};

export default TeacherPreviewLessonPage;
