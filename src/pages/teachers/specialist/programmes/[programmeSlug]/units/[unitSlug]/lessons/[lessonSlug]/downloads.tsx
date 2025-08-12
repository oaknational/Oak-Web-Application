import {
  GetStaticProps,
  GetStaticPathsResult,
  GetStaticPropsResult,
} from "next";

import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { SpecialistLessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonDownload/specialistLessonDownload.schema";
import SpecialistLessonDownloads from "@/components/TeacherViews/SpecialistLessonDownloads/SpecialistLessonDownloads.view";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { Wall } from "@/components/AppComponents/Wall";
import { withOnboardingRequired } from "@/hocs/withOnboardingRequired";

const SpecialistLessonDownloadsPage = ({
  curriculumData,
}: SpecialistLessonDownloadsPageData) => {
  const { lesson } = curriculumData;
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson Download: ${lesson.lessonTitle} | ${lesson.subjectTitle}`,
          description: "Lesson downloads",
        }),
      }}
    >
      <SpecialistLessonDownloads curriculumData={curriculumData} />
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
  SpecialistLessonDownloadsPageData,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "specialist-downloads::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug, programmeSlug, unitSlug } = context.params;

      try {
        const curriculumData =
          await curriculumApi2023.specialistLessonDownloads({
            programmeSlug,
            unitSlug,
            lessonSlug,
          });

        if (!curriculumData) {
          return {
            notFound: true,
          };
        }

        const results: GetStaticPropsResult<SpecialistLessonDownloadsPageData> =
          {
            props: {
              curriculumData,
            },
          };
        return results;
      } catch {
        return {
          notFound: true,
        };
      }
    },
  });
};

export default withOnboardingRequired(SpecialistLessonDownloadsPage, Wall);
