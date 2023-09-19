import {
  NextPage,
  GetStaticProps,
  GetStaticPathsResult,
  GetStaticPropsResult,
} from "next";

import AppLayout from "@/components/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import { ViewType } from "@/common-lib/urls";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import LessonDownloads from "@/components/Lesson/LessonDownloads/LessonDownloads.page";
import { LessonDownloadsCanonical } from "@/node-lib/curriculum-api-2023/queries/lessonDownloadsCanonical/lessonDownloadsCanonical.schema";
import { getCommonPathway } from "@/components/pages/TeachersLessonOverview/teachersLessonOverview.helpers";

export type LessonDownloadsCanonicalPageProps = {
  curriculumData: LessonDownloadsCanonical;
  viewType: ViewType;
};

const LessonDownloadsCanonicalPage: NextPage<
  LessonDownloadsCanonicalPageProps
> = ({ curriculumData, viewType }) => {
  const { lessonTitle, pathways } = curriculumData;
  const commonPathway = getCommonPathway(pathways);
  const { keyStageSlug, subjectTitle } = commonPathway;
  const pathwayLabel = [keyStageSlug?.toUpperCase(), subjectTitle]
    .filter(Boolean)
    .join(" ");
  const seoTitle = [`Lesson Download: ${lessonTitle}`, pathwayLabel]
    .filter(Boolean)
    .join(" | ");

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: seoTitle,
          description: "Lesson downloads",
        }),
        ...{ noFollow: true, noIndex: true },
      }}
    >
      <LessonDownloads
        isCanonical
        lesson={curriculumData}
        viewType={viewType}
      />
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
  viewType: ViewType;
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
  LessonDownloadsCanonicalPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "downloads-canonical::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug } = context.params;

      const curriculumData = await curriculumApi2023.lessonDownloadsCanonical({
        lessonSlug,
      });

      //   const curriculumData =
      //     context?.params?.viewType === "teachers-2023"
      //       ? await curriculumApi2023.lessonDownloads({
      //           programmeSlug,
      //           unitSlug,
      //           lessonSlug,
      //         })
      //       : await curriculumApi.lessonDownloads({
      //           programmeSlug,
      //           unitSlug,
      //           lessonSlug,
      //         });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<LessonDownloadsCanonicalPageProps> = {
        props: {
          curriculumData,
          viewType: context?.params?.viewType,
        },
      };
      return results;
    },
  });
};

export default LessonDownloadsCanonicalPage;
