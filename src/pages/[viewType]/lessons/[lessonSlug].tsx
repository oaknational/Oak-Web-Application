import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
} from "next";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import {
  shouldSkipInitialBuild,
  getFallbackBlockingConfig,
} from "@/node-lib/isr";
import { LessonOverviewCanonical } from "@/node-lib/curriculum-api-2023/queries/lessonOverviewCanonical/lessonOverviewCanonical.schema";
import AppLayout from "@/components/AppLayout/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import OakLink from "@/components/OakLink/OakLink";
import TeachersLessonOverviewPage from "@/components/pages/TeachersLessonOverview/TeachersLessonOverview";

type PageProps = {
  lesson: LessonOverviewCanonical;
};

type URLParams = {
  lessonSlug: string;
};

export default function LessonOverviewCanonicalPage({
  lesson,
}: PageProps): JSX.Element {
  console.log(lesson.pathways);

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
      <TeachersLessonOverviewPage lesson={{ ...lesson, isCanonical: true }} />
      <MaxWidth $pv={20}>
        <p>This is the canonical page for this lesson.</p>
        <p>
          It exists in the following learning pathways:
          <ul>
            {lesson.pathways.map((pathway) => {
              return (
                <li>
                  <OakLink
                    page="lesson-overview"
                    viewType="teachers-2023"
                    lessonSlug={lesson.lessonSlug}
                    programmeSlug={pathway.programmeSlug}
                    unitSlug={pathway.unitSlug}
                  >
                    {[
                      pathway.keyStageTitle,
                      pathway.subjectTitle,
                      pathway.unitTitle,
                    ].join(" => ")}
                  </OakLink>
                </li>
              );
            })}
          </ul>
        </p>
        <p>
          This page will mostly be the same as the pages for lessons in their
          pathway context
        </p>
      </MaxWidth>
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

      const lesson = await curriculumApi2023.lessonOverviewCanonical({
        lessonSlug,
      });

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
