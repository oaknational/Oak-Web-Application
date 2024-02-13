import { useState } from "react";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { useSearchParams } from "next/navigation";
import {
  oakDefaultTheme,
  OakThemeProvider,
  OakBox,
} from "@oaknational/oak-components";

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
  allLessonReviewSections,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";
import { PupilViewsQuiz } from "@/components/PupilViews/PupilQuiz";
import { PupilViewsVideo } from "@/components/PupilViews/PupilVideo/PupilVideo.view";
import { PupilViewsLessonOverview } from "@/components/PupilViews/PupilLessonOverview";
import { PupilViewsReview } from "@/components/PupilViews/PupilReview/PupilReview.view";
import { PupilViewsIntro } from "@/components/PupilViews/PupilIntro/PupilIntro.view";
import { getCaptionsFromFile } from "@/utils/handleTranscript";
import getDownloadResourcesExistence from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
export type PupilLessonOverviewPageProps = {
  curriculumData: PupilLessonOverviewData;
  hasWorksheet: boolean;
};

const PupilPageContent = ({
  curriculumData,
  hasWorksheet,
}: PupilLessonOverviewPageProps) => {
  const { currentSection, updateCurrentSection } = useLessonEngineContext();
  const searchParams = useSearchParams();
  const [overrideApplied, setOverrideApplied] = useState(false);

  // temporary hack to allow overriding the current section - will be removed on moving to page navigation
  const overrideSection = searchParams.get("section");
  if (overrideSection && isLessonSection(overrideSection) && !overrideApplied) {
    setOverrideApplied(true);
    updateCurrentSection(overrideSection);
  }

  const {
    starterQuiz,
    exitQuiz,
    lessonTitle,
    subjectTitle,
    subjectSlug,
    yearTitle,
    pupilLessonOutcome,
    videoMuxPlaybackId,
    videoWithSignLanguageMuxPlaybackId,
    isLegacy,
  } = curriculumData;

  switch (currentSection) {
    case "overview":
      return (
        <PupilViewsLessonOverview
          lessonTitle={lessonTitle}
          subjectTitle={subjectTitle}
          subjectSlug={subjectSlug}
          yearTitle={yearTitle ?? undefined}
          pupilLessonOutcome={pupilLessonOutcome ?? undefined}
          starterQuizNumQuestions={starterQuiz?.length ?? 0}
          exitQuizNumQuestions={exitQuiz?.length ?? 0}
        />
      );
    case "intro":
      return (
        <PupilViewsIntro {...curriculumData} hasWorksheet={hasWorksheet} />
      );
    case "starter-quiz":
      return <PupilViewsQuiz questionsArray={starterQuiz ?? []} />;
    case "video":
      return (
        <PupilViewsVideo
          lessonTitle={lessonTitle}
          videoMuxPlaybackId={videoMuxPlaybackId ?? undefined}
          videoWithSignLanguageMuxPlaybackId={
            videoWithSignLanguageMuxPlaybackId ?? undefined
          }
          transcriptSentences={curriculumData.transcriptSentences ?? []}
          isLegacy={isLegacy}
        />
      );
    case "exit-quiz":
      return <PupilViewsQuiz questionsArray={exitQuiz ?? []} />;
    case "review":
      return <PupilViewsReview lessonTitle={lessonTitle} />;
    default:
      return null;
  }
};

const PupilsPage: NextPage<PupilLessonOverviewPageProps> = ({
  curriculumData,
  hasWorksheet,
}) => {
  const availableSections = pickAvailableSectionsForLesson(curriculumData);

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <LessonEngineProvider initialLessonReviewSections={availableSections}>
        <OakBox $height={"100vh"}>
          <PupilPageContent
            curriculumData={curriculumData}
            hasWorksheet={hasWorksheet}
          />
        </OakBox>
      </LessonEngineProvider>
    </OakThemeProvider>
  );
};

export type PupilPageURLParams = {
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
};

export const pickAvailableSectionsForLesson = (
  curriculumData: PupilLessonOverviewData,
) =>
  allLessonReviewSections.filter((section) => {
    switch (section) {
      case "starter-quiz":
        return !!curriculumData?.starterQuiz?.length;
      case "exit-quiz":
        return !!curriculumData?.exitQuiz?.length;
      case "video":
        return !!curriculumData.videoMuxPlaybackId;
      default:
        return true;
    }
  });

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

      // For new content we need to fetch the captions file from gCloud and parse the result to generate
      // the transcript sentences.
      const resolveTranscriptSentences = (() => {
        if (curriculumData.videoTitle && !curriculumData.isLegacy) {
          return getCaptionsFromFile(`${curriculumData.videoTitle}.vtt`);
        }

        return curriculumData.transcriptSentences;
      })();

      // Resolve the requests for the transcript and worksheet existence in parallel
      const [transcriptSentences, downloadExistence] = await Promise.all([
        resolveTranscriptSentences,
        getDownloadResourcesExistence(
          lessonSlug,
          "worksheet-pdf",
          curriculumData.isLegacy,
        ),
      ]);

      const results: GetStaticPropsResult<PupilLessonOverviewPageProps> = {
        props: {
          curriculumData: {
            ...curriculumData,
            transcriptSentences: transcriptSentences ?? [],
          },
          hasWorksheet: downloadExistence.resources.some(
            ([type, result]) => type === "worksheet-pdf" && result.exists,
          ),
        },
      };

      return results;
    },
  });
};

export default PupilsPage;
