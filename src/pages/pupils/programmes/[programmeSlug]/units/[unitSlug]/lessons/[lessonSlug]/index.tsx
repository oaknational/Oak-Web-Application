import { useState } from "react";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { useSearchParams } from "next/navigation";
import { oakDefaultTheme, OakThemeProvider } from "@oak-academy/oak-components";

import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { PupilLessonOverviewData } from "@/node-lib/curriculum-api";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import {
  LessonEngineProvider,
  isLessonSection,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";
import { PupilViewsQuiz } from "@/components/PupilViews/PupilQuiz";
import { PupilViewsVideo } from "@/components/PupilViews/PupilVideo/PupilVideo.view";
import { PupilViewsLessonOverview } from "@/components/PupilViews/PupilLessonOverview";
import { PupilViewsReview } from "@/components/PupilViews/PupilReview/PupilReview.view";
import { PupilViewsIntro } from "@/components/PupilViews/PupilIntro/PupilIntro.view";

export type PupilLessonOverviewPageProps = {
  curriculumData: PupilLessonOverviewData;
};

const PupilPageContent = ({
  curriculumData,
}: {
  curriculumData: PupilLessonOverviewData;
}) => {
  const { currentSection, updateCurrentSection } = useLessonEngineContext();
  const searchParams = useSearchParams();
  const [overrideApplied, setOverrideApplied] = useState(false);

  const overrideSection = searchParams.get("section");
  if (overrideSection && isLessonSection(overrideSection) && !overrideApplied) {
    setOverrideApplied(true);
    updateCurrentSection(overrideSection);
  }

  const { starterQuiz, exitQuiz } = curriculumData;

  switch (currentSection) {
    case "overview":
      return <PupilViewsLessonOverview />;
    case "intro":
      return <PupilViewsIntro />;
    case "starter-quiz":
      return <PupilViewsQuiz questionsArray={starterQuiz ?? []} />;
    case "video":
      return <PupilViewsVideo />;
    case "exit-quiz":
      return <PupilViewsQuiz questionsArray={exitQuiz ?? []} />;
    case "review":
      return <PupilViewsReview />;
    default:
      return null;
  }
};

const PupilsPage: NextPage<PupilLessonOverviewPageProps> = ({
  curriculumData,
}) => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <LessonEngineProvider>
        <PupilPageContent curriculumData={curriculumData} />
      </LessonEngineProvider>
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
