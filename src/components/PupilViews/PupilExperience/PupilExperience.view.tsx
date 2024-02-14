import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilLessonOverviewData } from "@/node-lib/curriculum-api";
import {
  LessonEngineProvider,
  allLessonReviewSections,
  isLessonSection,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";
import { PupilViewsIntro } from "@/components/PupilViews/PupilIntro";
import { PupilViewsLessonOverview } from "@/components/PupilViews/PupilLessonOverview";
import { PupilViewsReview } from "@/components/PupilViews/PupilReview";
import { PupilViewsQuiz } from "@/components/PupilViews/PupilQuiz";
import { PupilViewsVideo } from "@/components/PupilViews/PupilVideo";

const pickAvailableSectionsForLesson = (
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

export type PupilExperienceViewProps = {
  curriculumData: PupilLessonOverviewData;
  hasWorksheet: boolean;
  backUrl?: string;
};

const PupilPageContent = ({
  curriculumData,
  hasWorksheet,
  backUrl,
}: PupilExperienceViewProps) => {
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

export const PupilExperienceView = ({
  curriculumData,
  hasWorksheet,
  backUrl,
}: PupilExperienceViewProps) => {
  console.log("backUrl", backUrl);
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
