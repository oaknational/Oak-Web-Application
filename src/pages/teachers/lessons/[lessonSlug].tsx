import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
} from "next";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import {
  shouldSkipInitialBuild,
  getFallbackBlockingConfig,
} from "@/node-lib/isr";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { LessonOverviewCanonical } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getRedirect } from "@/pages-helpers/shared/lesson-pages/getRedirects";
import OakError from "@/errors/OakError";
import { allowNotFoundError } from "@/pages-helpers/shared/lesson-pages/allowNotFoundError";

type PageProps = {
  lesson: LessonOverviewCanonical;
};

export type URLParams = {
  lessonSlug: string;
};

export default function LessonOverviewCanonicalPage({
  lesson,
}: PageProps): JSX.Element {
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson: ${lesson.lessonTitle}`,
          description: "Overview of lesson",
          canonicalURL: `${getBrowserConfig("seoAppUrl")}/teachers/lessons/${lesson.lessonSlug}`,
        }),
      }}
    >
      <OakThemeProvider theme={oakDefaultTheme}>
        <OakBox>You should not see this</OakBox>
      </OakThemeProvider>
    </AppLayout>
  );
}

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

export const getStaticProps: GetStaticProps<PageProps, URLParams> = async (
  context,
): Promise<GetStaticPropsResult<PageProps>> => {
  return getPageProps({
    page: "lesson-overview-canonical::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug } = context.params;

      let lesson;
      try {
        const res = await curriculumApi2023.lessonOverview({
          lessonSlug,
        });
        lesson = res;
      } catch (err) {
        if (
          err instanceof OakError &&
          err.code === "curriculum-api/not-found"
        ) {
          allowNotFoundError(err);
        }
      }

      if (!lesson) {
        const redirect = await getRedirect({
          isCanonical: true,
          context: context.params,
          isTeacher: true,
          isLesson: true,
        });
        return redirect ? { redirect } : { notFound: true };
      }

      const programmeSlug = lesson.programmeSlug;
      const unitSlug = lesson.unitSlug;

      return {
        redirect: {
          statusCode: 308,
          destination: `/teachers/programmes/${programmeSlug}/units/${unitSlug}/lessons/${lessonSlug}`,
        },
      };
    },
  });
};
