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
import { LessonDownloads } from "@/components/TeacherViews/LessonDownloads.view";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { allowNotFoundError } from "@/pages-helpers/shared/lesson-pages/allowNotFoundError";
import { getRedirect } from "@/pages-helpers/shared/lesson-pages/getRedirects";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

export type LessonDownloadsPageProps = {
  curriculumData: LessonDownloadsPageData;
  topNav: TopNavProps;
};

const LessonDownloadsPage = ({
  curriculumData,
  topNav,
}: LessonDownloadsPageProps) => {
  const { lessonTitle, keyStageSlug, subjectTitle } = curriculumData;

  return (
    <AppLayout
      topNavProps={topNav}
      seoProps={{
        ...getSeoProps({
          title: `Lesson Download: ${lessonTitle} | ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
          description:
            "Select and download free lesson resources, including slide decks, worksheets and quizzes",
          canonicalURL: `${getBrowserConfig("seoAppUrl")}/teachers/programmes/${
            curriculumData.programmeSlug
          }/units/${curriculumData.unitSlug}/lessons/${
            curriculumData.lessonSlug
          }`,
        }),
        noIndex: true,
        noFollow: true,
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

      let curriculumData;
      try {
        curriculumData =
          await curriculumApi2023.lessonDownloads<LessonDownloadsPageData>({
            programmeSlug,
            unitSlug,
            lessonSlug,
          });
      } catch (innerError) {
        allowNotFoundError(innerError);
      }

      if (!curriculumData) {
        const redirect = await getRedirect({
          isCanonical: false,
          context: context.params,
          isTeacher: true,
          isLesson: true,
        });
        return redirect ? { redirect } : { notFound: true };
      }

      const topNav = await curriculumApi2023.topNav();

      const results: GetStaticPropsResult<LessonDownloadsPageProps> = {
        props: {
          curriculumData,
          topNav,
        },
      };
      return results;
    },
  });
};

export default LessonDownloadsPage;
