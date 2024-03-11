import {
  NextPage,
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
import { LessonShare } from "@/components/TeacherViews/LessonShare/LessonShare.view";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { SpecialistLessonShareData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonShare/specialistLessonShare.schema";

export type SpecialistLessonSharePageProps = {
  curriculumData: SpecialistLessonShareData;
};

const SpecialistLessonSharePage: NextPage<SpecialistLessonSharePageProps> = ({
  curriculumData,
}) => {
  const { lessonTitle, subjectTitle } = curriculumData;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson Share: ${lessonTitle} | ${subjectTitle}`,
          description: "Lesson share",
        }),
        ...{ noFollow: true, noIndex: true },
      }}
    >
      <LessonShare isCanonical={false} lesson={curriculumData} />
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
  SpecialistLessonSharePageProps,
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

      const curriculumData = await curriculumApi2023.specialistLessonShare({
        programmeSlug,
        unitSlug,
        lessonSlug,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<SpecialistLessonSharePageProps> = {
        props: {
          curriculumData,
        },
      };
      return results;
    },
  });
};

export default SpecialistLessonSharePage;
