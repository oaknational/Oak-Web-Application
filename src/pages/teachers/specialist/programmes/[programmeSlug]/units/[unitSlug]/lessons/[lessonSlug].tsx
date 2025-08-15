import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import SpecialistLesson from "@/components/TeacherViews/SpecialistLesson/SpecialistLesson.view";
import { SpecialistLessonOverviewData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonOverview/specialistLessonOverview.schema";
import { withOnboardingRequired } from "@/hocs/withOnboardingRequired";

export type SpecialistLessonOverviewPageProps = {
  curriculumData: SpecialistLessonOverviewData;
};

const SpecialistLessonOverviewPage: NextPage<
  SpecialistLessonOverviewPageProps
> = ({ curriculumData }) => {
  const { lessonTitle, developmentStageTitle, subjectTitle } = curriculumData;
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson: ${lessonTitle} | ${developmentStageTitle.toUpperCase()} ${subjectTitle}`,
          description: "Overview of lesson",
        }),
        ...{ noFollow: true, noIndex: true },
      }}
    >
      <SpecialistLesson lesson={{ ...curriculumData, isCanonical: false }} />
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
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
  SpecialistLessonOverviewPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "specialist-lesson-overview::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug, unitSlug, programmeSlug } = context.params;
      const curriculumData = await curriculumApi2023.specialistLessonOverview({
        programmeSlug,
        lessonSlug,
        unitSlug,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }
      const results: GetStaticPropsResult<SpecialistLessonOverviewPageProps> = {
        props: {
          curriculumData: { ...curriculumData, lessonMediaClips: null },
        },
      };

      return results;
    },
  });
};

export default withOnboardingRequired(SpecialistLessonOverviewPage);
