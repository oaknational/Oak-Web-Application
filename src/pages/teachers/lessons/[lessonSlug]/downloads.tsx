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
import { LessonDownloads } from "@/components/TeacherViews/LessonDownloads.view";
import { allowNotFoundError } from "@/pages-helpers/shared/lesson-pages/allowNotFoundError";
import { getRedirect } from "@/pages-helpers/shared/lesson-pages/getRedirects";

export type LessonDownloadsCanonicalPageProps = {
  curriculumData: LessonDownloadsCanonical;
};

const LessonDownloadsCanonicalPage = (
  props: LessonDownloadsCanonicalPageProps,
) => {
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
        noIndex: true,
        noFollow: true,
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

      let curriculumData;
      try {
        curriculumData =
          await curriculumApi2023.lessonDownloads<LessonDownloadsCanonical>({
            lessonSlug,
          });
      } catch (innerError) {
        allowNotFoundError(innerError);
      }

      if (!curriculumData) {
        const redirect = await getRedirect({
          isCanonical: true,
          context: context.params,
          isTeacher: true,
          isLesson: true,
        });
        return redirect ? { redirect } : { notFound: true };
      }

      const results: GetStaticPropsResult<LessonDownloadsCanonicalPageProps> = {
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

export default LessonDownloadsCanonicalPage;
