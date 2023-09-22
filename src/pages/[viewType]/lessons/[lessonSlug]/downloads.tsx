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
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import LessonDownloads from "@/components/Lesson/LessonDownloads/LessonDownloads.page";
import { LessonDownloadsCanonical } from "@/node-lib/curriculum-api-2023/queries/lessonDownloadsCanonical/lessonDownloadsCanonical.schema";
import { getCommonPathway } from "@/components/pages/TeachersLessonOverview/teachersLessonOverview.helpers";
import curriculumApi from "@/node-lib/curriculum-api";

export type LessonDownloadsCanonicalPageProps = {
  curriculumData: LessonDownloadsCanonical;
};

const LessonDownloadsCanonicalPage: NextPage<
  LessonDownloadsCanonicalPageProps
> = (props) => {
  const { curriculumData } = props;
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
      <LessonDownloads isCanonical lesson={curriculumData} />
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

      const curriculumData =
        (await curriculumApi2023.lessonDownloadsCanonical({
          lessonSlug,
        })) ||
        (await curriculumApi.lessonDownloadsCanonical({
          lessonSlug,
        }));

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<LessonDownloadsCanonicalPageProps> = {
        props: {
          curriculumData,
        },
      };
      return results;
    },
  });
};

export default LessonDownloadsCanonicalPage;
