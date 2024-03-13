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
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import { getCaptionsFromFile, formatSentences } from "@/utils/handleTranscript";
import SpecialistLesson from "@/components/TeacherViews/SpecialistLesson/SpecialistLesson.view";
import { SpecialistLessonOverviewData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonOverview/specialistLessonOverview.schema";

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

      const { videoTitle, transcriptSentences } = curriculumData;
      if (videoTitle && !isSlugLegacy(programmeSlug) && !transcriptSentences) {
        // For new content we need to fetch the captions file from gCloud and parse the result to generate
        // the transcript sentences.
        const fileName = `${videoTitle}.vtt`;
        const transcript = await getCaptionsFromFile(fileName);
        if (transcript) {
          curriculumData.transcriptSentences = transcript;
        }
      } else if (transcriptSentences && !Array.isArray(transcriptSentences)) {
        const splitTranscript = transcriptSentences.split(/\r?\n/);
        const formattedTranscript = formatSentences(splitTranscript);

        curriculumData.transcriptSentences = formattedTranscript;
      }

      const results: GetStaticPropsResult<SpecialistLessonOverviewPageProps> = {
        props: {
          curriculumData,
        },
      };

      return results;
    },
  });
};

export default SpecialistLessonOverviewPage;
