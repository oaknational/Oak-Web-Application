import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
} from "next";
import { OakFlex } from "@oaknational/oak-components";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import {
  shouldSkipInitialBuild,
  getFallbackBlockingConfig,
} from "@/node-lib/isr";
import { LessonOverviewCanonical } from "@/node-lib/curriculum-api-2023/queries/lessonOverviewCanonical/lessonOverviewCanonical.schema";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import { LessonAppearsIn } from "@/components/TeacherComponents/LessonAppearsIn";
import { groupLessonPathways } from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { LessonOverview } from "@/components/TeacherViews/LessonOverview/LessonOverview.view";
import curriculumApi from "@/node-lib/curriculum-api";
import OakError from "@/errors/OakError";

type PageProps = {
  lesson: LessonOverviewCanonical;
};

export type URLParams = {
  lessonSlug: string;
};

export default function LessonOverviewCanonicalPage({
  lesson,
}: PageProps): JSX.Element {
  const pathwayGroups = groupLessonPathways(lesson.pathways);
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson: ${lesson.lessonTitle}`,
          description: "Overview of lesson",
        }),
        ...{ noFollow: true, noIndex: true },
      }}
    >
      <LessonOverview lesson={{ ...lesson, isCanonical: true }} />
      <OakFlex $background={"pink50"} $width={"100%"}>
        <MaxWidth $pv={96}>
          <LessonAppearsIn headingTag="h2" {...pathwayGroups} />
        </MaxWidth>
      </OakFlex>
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
) => {
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
        lesson = await curriculumApi2023.lessonOverviewCanonical({
          lessonSlug,
        });
      } catch (error) {
        /**
         * If the lesson is not found in the 2023 curriculum, try the 2020 api
         * instead. Otherwise rethrow the error.
         * This is temporary logic until the migration.
         */
        if (
          error instanceof OakError &&
          error.code === "curriculum-api/not-found"
        ) {
          try {
            lesson = await curriculumApi.lessonOverviewCanonical({
              lessonSlug,
            });
          } catch {
            if (
              error instanceof OakError &&
              error.code === "curriculum-api/not-found"
            ) {
              return {
                notFound: true,
              };
            } else {
              throw error;
            }
          }
        } else {
          throw error;
        }
      }

      if (!lesson) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<PageProps> = {
        props: {
          lesson,
        },
      };

      return results;
    },
  });
};
