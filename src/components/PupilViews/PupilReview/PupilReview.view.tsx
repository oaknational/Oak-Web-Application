import { useState } from "react";
import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHandDrawnCard,
  OakHeading,
  OakImage,
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonReviewIntroVideo,
  OakLessonReviewQuiz,
  OakPrimaryButton,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import {
  attemptDataCamelCaseSchema,
  useOakPupil,
} from "@oaknational/oak-pupil-client";
import { useFeatureFlagEnabled } from "posthog-js/react";

import { PupilExperienceViewProps } from "../PupilExperience";

import { useLessonReviewFeedback } from "./useLessonReviewFeedback";

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { useGetSectionLinkProps } from "@/components/PupilComponents/pupilUtils/lessonNavigation";
import { QuestionsArray } from "@/components/PupilComponents/QuizEngineProvider";
import { QuizResults } from "@/components/PupilComponents/QuizResults";
import { resolveOakHref } from "@/common-lib/urls";
import { CopyrightNotice } from "@/components/PupilComponents/CopyrightNotice";

type PupilViewsReviewProps = {
  lessonTitle: string;
  backUrl?: string | null;
  starterQuizQuestionsArray: QuestionsArray;
  exitQuizQuestionsArray: QuestionsArray;
  programmeSlug: string;
  unitSlug: string;
  browseData: PupilExperienceViewProps["browseData"];
  pageType: PupilExperienceViewProps["pageType"];
};

export const PupilViewsReview = (props: PupilViewsReviewProps) => {
  const {
    lessonTitle,
    backUrl,
    starterQuizQuestionsArray,
    exitQuizQuestionsArray,
    browseData: { programmeFields, lessonSlug, isLegacy },
  } = props;
  const { phase = "primary", yearDescription, subject } = programmeFields;
  const {
    updateCurrentSection,
    sectionResults,
    isLessonComplete,
    lessonReviewSections,
  } = useLessonEngineContext();
  const getSectionLinkProps = useGetSectionLinkProps();

  const { finalFeedback } = useLessonReviewFeedback(
    isLessonComplete,
    sectionResults,
  );

  const pupilClient = useOakPupil();
  const { logAttempt } = pupilClient;
  const isShowShareButtons = useFeatureFlagEnabled("share-results-button");
  const [isAttemptingShare, setIsAttemptingShare] = useState<boolean>(false);

  const bottomNavSlot = (
    <OakLessonBottomNav>
      <OakPrimaryButton
        element="a"
        href={backUrl || undefined}
        iconName="arrow-right"
        isTrailingIcon
        width={["100%", "max-content"]}
      >
        View all lessons
      </OakPrimaryButton>
    </OakLessonBottomNav>
  );
  const handleShareResultsClick = async () => {
    setIsAttemptingShare(true);
    const attemptData = {
      lessonData: { slug: lessonSlug, title: lessonTitle },
      browseData: { subject: subject, yearDescription: yearDescription ?? "" },
      sectionResults: sectionResults,
    };
    try {
      const parsedAttemptData = attemptDataCamelCaseSchema.parse(attemptData);
      const attemptId = await logAttempt(parsedAttemptData, false);
      if (!attemptId) {
        throw new Error("Failed to log attempt");
      }
      setIsAttemptingShare(false);
      const shareUrl = `${
        process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL
      }${resolveOakHref({
        page: "pupil-lesson-results-canonical-share",
        lessonSlug,
        attemptId,
      })}`;
      setTimeout(() => {
        alert("See results at " + shareUrl);
      }, 0);
    } catch (e) {
      setIsAttemptingShare(false);
      console.error(e);
      setTimeout(() => {
        alert("Failed to log attempt");
      }, 0);
    }
  };

  const handlePrintableResultsClick = async () => {
    const attemptData = {
      lessonData: { slug: lessonSlug, title: lessonTitle },
      browseData: { subject: subject, yearDescription: yearDescription ?? "" },
      sectionResults: sectionResults,
    };
    const parsedAttemptData = attemptDataCamelCaseSchema.parse(attemptData);
    const attemptId = await logAttempt(parsedAttemptData, true);
    if (attemptId)
      window.open(
        resolveOakHref({
          page: "pupil-lesson-results-canonical-printable",
          lessonSlug,
          attemptId,
        }),
        "_blank",
      );
  };

  if (phase === "foundation") {
    throw new Error("Foundation phase is not supported");
  }

  return (
    <OakLessonLayout
      bottomNavSlot={bottomNavSlot}
      lessonSectionName={"review"}
      phase={phase}
      topNavSlot={null}
    >
      <OakGrid
        $maxWidth={["100%", "all-spacing-23", "100%"]}
        $mt="space-between-m"
        $mb={["space-between-none", "space-between-s"]}
        $mh="auto"
        $ph={["inner-padding-m", "inner-padding-xl", "inner-padding-none"]}
      >
        <OakGridArea $colStart={[1, 1, 2]} $colSpan={[12, 12, 10]}>
          <OakTertiaryButton
            iconName="arrow-left"
            element="a"
            {...getSectionLinkProps("overview", updateCurrentSection)}
          >
            Lesson overview
          </OakTertiaryButton>

          <OakFlex $mv="space-between-xl">
            <OakFlex
              $flexDirection={"column"}
              $flexGrow={2}
              $gap={"space-between-l"}
              $justifyContent={"center"}
            >
              <OakHeading tag="h1" $font={["heading-4", "heading-3"]}>
                Lesson review
              </OakHeading>
              {isShowShareButtons && (
                <OakFlex $gap={"space-between-s"}>
                  <OakPrimaryButton
                    type="button"
                    role="button"
                    aria-label="Printable results, opens in a new tab"
                    title="Printable results (opens in a new tab)"
                    iconName={"external"}
                    isTrailingIcon
                    onClick={handlePrintableResultsClick}
                    data-testid="printable-results-button"
                  >
                    Printable results
                  </OakPrimaryButton>
                  <OakPrimaryButton
                    type="button"
                    role="button"
                    aria-label="Share results"
                    title="Share results"
                    onClick={handleShareResultsClick}
                    data-testid="share-results-button"
                    isLoading={isAttemptingShare}
                  >
                    Share results
                  </OakPrimaryButton>
                </OakFlex>
              )}
              <OakHeading tag="h2" $font={"heading-light-7"}>
                {lessonTitle}
              </OakHeading>
            </OakFlex>

            <OakFlex $flexGrow={1}>
              <OakImage
                $display={["none", "none", "block"]}
                $height={"all-spacing-19"}
                alt="a man standing in front of a blackboard with a bunch of objects on top of his head and hands in the air"
                src={`https://${process.env.NEXT_PUBLIC_OAK_ASSETS_HOST}/${process.env.NEXT_PUBLIC_OAK_ASSETS_PATH}/v1699887218/svg-illustrations/xrazqgtjmbdf1clz8wic`}
              />
            </OakFlex>
          </OakFlex>
          <OakFlex
            $flexDirection={"column"}
            $alignItems={"stretch"}
            $gap={"space-between-s"}
            $mb="space-between-xl"
          >
            {lessonReviewSections.map((lessonSection) => {
              if (lessonSection === "intro" || lessonSection === "video") {
                return (
                  <OakLessonReviewIntroVideo
                    key={lessonSection}
                    lessonSectionName={lessonSection}
                    completed={!!sectionResults[lessonSection]?.isComplete}
                  />
                );
              } else if (
                lessonSection === "exit-quiz" ||
                lessonSection === "starter-quiz"
              ) {
                const quizArray =
                  lessonSection === "exit-quiz"
                    ? exitQuizQuestionsArray
                    : starterQuizQuestionsArray;
                return (
                  <OakLessonReviewQuiz
                    key={lessonSection}
                    lessonSectionName={lessonSection}
                    completed={!!sectionResults[lessonSection]?.isComplete}
                    grade={sectionResults[lessonSection]?.grade ?? 0}
                    numQuestions={
                      sectionResults[lessonSection]?.numQuestions ?? 0
                    }
                    resultsSlot={
                      <QuizResults
                        sectionResults={sectionResults}
                        quizArray={quizArray}
                        lessonSection={lessonSection}
                        copyrightNotice={
                          <CopyrightNotice isLegacyLicense={isLegacy} />
                        }
                      />
                    }
                  />
                );
              }
            })}
          </OakFlex>

          <OakFlex
            $flexGrow={1}
            $flexDirection={["row", "column"]}
            $alignItems={["center", "flex-end"]}
          >
            <OakHandDrawnCard
              $pv={"inner-padding-xl"}
              $ph={"inner-padding-xl"}
              $alignItems={"center"}
            >
              <OakFlex
                $font="heading-5"
                $textAlign={["center", "left", "left"]}
              >
                {finalFeedback}
              </OakFlex>
            </OakHandDrawnCard>
          </OakFlex>
        </OakGridArea>
      </OakGrid>
    </OakLessonLayout>
  );
};
