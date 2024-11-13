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
import { LessonDownloadsCanonical } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloadsCanonical.schema";
import { getCommonPathway } from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { LessonMedia } from "@/components/TeacherViews/LessonMedia/LessonMedia.view";

export type LessonMediaCanonicalPageProps = {
  curriculumData: LessonDownloadsCanonical;
};

const LessonMediaCanonicalPage = (props: LessonMediaCanonicalPageProps) => {
  const { curriculumData } = props;
  const { lessonTitle, pathways } = curriculumData;
  const commonPathway = getCommonPathway(pathways);
  const { keyStageSlug, subjectTitle } = commonPathway;
  const pathwayLabel = [keyStageSlug?.toUpperCase(), subjectTitle]
    .filter(Boolean)
    .join(" ");
  const seoTitle = [`Lesson Media: ${lessonTitle}`, pathwayLabel]
    .filter(Boolean)
    .join(" | ");

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: seoTitle,
          description: "Extra video and audio for the lesson",
        }),
      }}
    >
      <LessonMedia isCanonical lesson={curriculumData} />
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
  LessonMediaCanonicalPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "media-canonical::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug } = context.params;

      const curriculumData =
        await curriculumApi2023.lessonDownloads<LessonDownloadsCanonical>({
          lessonSlug,
        });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<LessonMediaCanonicalPageProps> = {
        props: {
          curriculumData: {
            ...curriculumData,
          },
        },
      };
      return results;
    },
  });
};

export default LessonMediaCanonicalPage;
