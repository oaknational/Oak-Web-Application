import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import {
  oakDefaultTheme,
  OakFlex,
  OakThemeProvider,
} from "@oak-academy/oak-components";

import { QuizEngineProvider } from "@/components/PupilJourneyComponents/QuizEngineProvider/QuizEngineProvider";
import { QuizRenderer } from "@/components/PupilJourneyComponents/QuizRenderer/QuizRenderer";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { PupilLessonOverviewData } from "@/node-lib/curriculum-api";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";

export type PupilLessonOverviewPageProps = {
  curriculumData: PupilLessonOverviewData;
};

const PupilsPage: NextPage<PupilLessonOverviewPageProps> = ({
  curriculumData,
}) => {
  const { starterQuiz } = curriculumData;

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <QuizEngineProvider questionsArray={starterQuiz ?? []}>
        <OakFlex
          $width={"100vw"}
          $height={"100vh"}
          $background={"bg-decorative1–main"}
          $flexDirection={"column"}
          $alignItems={"center"}
          $pt="inner-padding-xl"
        >
          <QuizRenderer />
        </OakFlex>
      </QuizEngineProvider>
    </OakThemeProvider>
  );
};

export type PupilPageURLParams = {
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<PupilPageURLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  PupilLessonOverviewPageProps,
  PupilPageURLParams
> = async (context) => {
  return getPageProps({
    page: "lesson-overview::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug, unitSlug, programmeSlug } = context.params;

      const curriculumData = await curriculumApi2023.pupilLessonOverview({
        programmeSlug,
        lessonSlug,
        unitSlug,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<PupilLessonOverviewPageProps> = {
        props: {
          curriculumData,
        },
      };

      return results;
    },
  });
};

export default PupilsPage;
