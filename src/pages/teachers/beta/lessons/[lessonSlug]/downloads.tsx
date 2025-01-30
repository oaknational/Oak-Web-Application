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

export type BetaLessonDownloadsPageProps = {
  curriculumData: LessonDownloadsPageData;
};

const BetaLessonDownloadsPage = ({
  curriculumData,
}: BetaLessonDownloadsPageProps) => {
  const { lessonTitle, subjectTitle } = curriculumData;
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Beta Lesson Download: ${lessonTitle} | ${subjectTitle}`,
          description: "View downloads for new lessons",
          canonicalURL: `${getBrowserConfig("seoAppUrl")}/teachers/beta/lessons/${
            curriculumData.lessonSlug
          }/downloads`,
        }),
      }}
    >
      <LessonDownloads isCanonical={false} lesson={curriculumData} />
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
  BetaLessonDownloadsPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "beta-downloads::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug } = context.params;
      const curriculumData =
        await curriculumApi2023.betaLessonDownloadsQuery<LessonDownloadsPageData>(
          {
            lessonSlug,
          },
        );
      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<BetaLessonDownloadsPageProps> = {
        props: {
          curriculumData,
        },
      };
      return results;
    },
  });
};

export default BetaLessonDownloadsPage;
