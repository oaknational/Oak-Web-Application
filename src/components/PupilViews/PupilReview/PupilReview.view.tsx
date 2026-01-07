import { useState } from "react";
import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHandDrawnCard,
  OakHeading,
  OakIcon,
  OakImage,
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonReviewIntroVideo,
  OakLessonReviewQuiz,
  OakPrimaryButton,
  OakTertiaryButton,
  OakSecondaryButton,
  OakBox,
} from "@oaknational/oak-components";
import { useSearchParams } from "next/navigation";

import { PupilExperienceViewProps } from "../PupilExperience";

import { useLessonReviewFeedback } from "./useLessonReviewFeedback";

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { useGetSectionLinkProps } from "@/components/PupilComponents/pupilUtils/lessonNavigation";
import { QuestionsArray } from "@/components/PupilComponents/QuizEngineProvider";
import { QuizResults } from "@/components/PupilComponents/QuizResults";
import { resolveOakHref } from "@/common-lib/urls";
import { CopyrightNotice } from "@/components/PupilComponents/CopyrightNotice";
import { usePupilAnalytics } from "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics";
import { LessonSummaryReviewedProperties } from "@/browser-lib/avo/Avo";
import { useOakPupil } from "@/hooks/useOakPupil";
import { attemptDataCamelCaseSchema } from "@/node-lib/pupil-api/types";

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
  const searchParams = useSearchParams();
  const itemId = searchParams?.get("itemId");
  const itemType = searchParams?.get("itemType");
  const isClassroomAssignment = itemType === "courseWork" && itemId !== null;
  const { phase = "primary", yearDescription, subject } = programmeFields;
  const [trackingSent, setTrackingSent] = useState<boolean>(false);
  const {
    updateCurrentSection,
    sectionResults,
    isLessonComplete,
    lessonReviewSections,
  } = useLessonEngineContext();
  const { track } = usePupilAnalytics();
  const getSectionLinkProps = useGetSectionLinkProps();

  const { finalFeedback } = useLessonReviewFeedback(
    isLessonComplete,
    sectionResults,
  );

  const pupilClient = useOakPupil();
  const { logAttempt } = pupilClient;
  const hasQuiz =
    lessonReviewSections.includes("exit-quiz") ||
    lessonReviewSections.includes("starter-quiz");
  const [isAttemptingShare, setIsAttemptingShare] = useState<
    "failed" | "shared" | "initial"
  >("initial");
  const [storedAttemptLocally, setStoredAttemptLocally] = useState<{
    stored: boolean;
    attemptId: string;
  }>({ stored: false, attemptId: "" });

  const storeResultsInLocalStorage = () => {
    const attemptData = {
      lessonData: { slug: lessonSlug, title: lessonTitle },
      browseData: {
        subject: subject,
        yearDescription: yearDescription ?? "",
      },
      sectionResults: sectionResults,
    };
    const parsedAttemptData = attemptDataCamelCaseSchema.parse(attemptData);
    const attemptId = logAttempt(parsedAttemptData, true);
    if (typeof attemptId === "string") {
      setStoredAttemptLocally({ stored: true, attemptId });
    }
  };

  if (storedAttemptLocally.stored === false && isLessonComplete) {
    storeResultsInLocalStorage();
  }

  const bottomNavSlot = !isClassroomAssignment && (
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
  const handleShareResultsClick = () => {
    const attemptData = {
      lessonData: { slug: lessonSlug, title: lessonTitle },
      browseData: { subject: subject, yearDescription: yearDescription ?? "" },
      sectionResults: sectionResults,
    };
    const parsedAttemptData = attemptDataCamelCaseSchema.parse(attemptData);
    const res = logAttempt(parsedAttemptData, false);
    if (typeof res === "string") {
      const shareUrl = `${
        process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL
      }${resolveOakHref({
        page: "pupil-lesson-results-canonical-share",
        lessonSlug,
        attemptId: res,
      })}`;
      navigator.clipboard.writeText(shareUrl);
      setIsAttemptingShare("shared");
    } else {
      const { promise, attemptId } = res;
      promise.catch((e) => {
        console.error(e);
        setIsAttemptingShare("failed");
      });
      const shareUrl = `${
        process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL
      }${resolveOakHref({
        page: "pupil-lesson-results-canonical-share",
        lessonSlug,
        attemptId,
      })}`;
      navigator.clipboard.writeText(shareUrl);
      setIsAttemptingShare("shared");
      if (sectionResults["exit-quiz"]?.isComplete) {
        track.activityResultsShared({
          shareMedium: "copy-link",
          pupilExitQuizGrade: sectionResults["exit-quiz"]?.grade ?? 0,
          pupilExitQuizNumQuestions:
            sectionResults["exit-quiz"]?.numQuestions ?? 0,
          pupilStarterQuizGrade: sectionResults["starter-quiz"]?.grade ?? 0,
          pupilStarterQuizNumQuesions:
            sectionResults["starter-quiz"]?.numQuestions ?? 0,
          pupilExitQuiz: pupilExitQuiz,
          pupilStarterQuiz: pupilStarterQuiz,
        });
      }
    }
  };

  if (phase === "foundation") {
    throw new Error("Foundation phase is not supported");
  }

  const pupilExitQuiz: LessonSummaryReviewedProperties["pupilExitQuiz"] =
    sectionResults["exit-quiz"]?.questionResults
      ? sectionResults["exit-quiz"]?.questionResults.map((result, index) => {
          return {
            pupilExperienceLessonActivity: "exit-quiz",
            questionNumber: index + 1,
            questionType: starterQuizQuestionsArray[index]?.questionType
              ? starterQuizQuestionsArray[index]?.questionType
              : "",
            questionResult: result.grade === 1 ? "correct" : "incorrect",
            hintOffered: starterQuizQuestionsArray[index]?.hint ? true : false,
            hintAccessed: result.offerHint,
            activityTimeSpent: 0,
          };
        })
      : undefined;

  const pupilStarterQuiz: LessonSummaryReviewedProperties["pupilStarterQuiz"] =
    sectionResults["starter-quiz"]?.questionResults
      ? sectionResults["starter-quiz"]?.questionResults.map((result, index) => {
          return {
            pupilExperienceLessonActivity: "starter-quiz",
            questionNumber: index + 1,
            questionType: starterQuizQuestionsArray[index]?.questionType
              ? starterQuizQuestionsArray[index]?.questionType
              : "",
            questionResult: result.grade === 1 ? "correct" : "incorrect",
            hintOffered: starterQuizQuestionsArray[index]?.hint ? true : false,
            hintAccessed: result.offerHint,
            activityTimeSpent: 0,
          };
        })
      : undefined;

  if (trackingSent === false) {
    track.lessonSummaryReviewed({
      pupilWorksheetAvailable:
        sectionResults.intro?.worksheetAvailable ?? false,
      pupilWorksheetDownloaded:
        sectionResults.intro?.worksheetDownloaded ?? false,
      pupilExitQuizGrade: sectionResults["exit-quiz"]?.grade ?? null,
      pupilExitQuizNumQuestions:
        sectionResults["exit-quiz"]?.numQuestions ?? null,
      pupilStarterQuizGrade: sectionResults["starter-quiz"]?.grade ?? null,
      pupilStarterQuizNumQuesions:
        sectionResults["starter-quiz"]?.numQuestions ?? null,
      pupilVideoPlayed: sectionResults.video?.played ?? false,
      pupilVideoDurationSeconds: sectionResults.video?.duration ?? 0,
      pupilVideoTimeElapsedSeconds: sectionResults.video?.timeElapsed ?? 0,
      pupilExitQuiz: pupilExitQuiz,
      pupilStarterQuiz: pupilStarterQuiz,
    });
    setTrackingSent(true);
  }

  return (
    <OakLessonLayout
      bottomNavSlot={bottomNavSlot}
      lessonSectionName={"review"}
      phase={phase}
      topNavSlot={null}
    >
      <OakGrid
        $maxWidth={["100%", "spacing-960", "100%"]}
        $mt="spacing-24"
        $mb={["spacing-0", "spacing-16"]}
        $mh="auto"
        $ph={["spacing-16", "spacing-24", "spacing-0"]}
      >
        <OakGridArea $colStart={[1, 1, 2]} $colSpan={[12, 12, 10]}>
          <OakTertiaryButton
            iconName="arrow-left"
            element="a"
            {...getSectionLinkProps("overview", updateCurrentSection)}
          >
            Lesson overview
          </OakTertiaryButton>

          <OakFlex $mv="spacing-56">
            <OakFlex
              $flexDirection={"column"}
              $flexGrow={2}
              $gap={"spacing-48"}
              $justifyContent={"center"}
            >
              <OakHeading tag="h1" $font={["heading-4", "heading-3"]}>
                Lesson review
              </OakHeading>
              {hasQuiz && !isClassroomAssignment && (
                <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
                  <OakHeading tag="h2" $font={"body-2-bold"}>
                    Share options:
                  </OakHeading>
                  <OakFlex
                    $gap={"spacing-16"}
                    $flexDirection={["column", "row"]}
                  >
                    {storedAttemptLocally.stored && (
                      <OakBox $display={["none", "flex"]}>
                        <OakSecondaryButton
                          element="a"
                          href={resolveOakHref({
                            page: "pupil-lesson-results-canonical-printable",
                            lessonSlug,
                            attemptId: storedAttemptLocally.attemptId,
                          })}
                          target="_blank"
                          aria-label="Printable results, opens in a new tab"
                          title="Printable results (opens in a new tab)"
                          iconName={"external"}
                          isTrailingIcon
                          data-testid="printable-results-button"
                        >
                          Printable results
                        </OakSecondaryButton>
                      </OakBox>
                    )}
                    <OakSecondaryButton
                      type="button"
                      role="button"
                      aria-label="Copy link to clipboard"
                      title="Copy link to clipboard"
                      onClick={handleShareResultsClick}
                      iconName={"copy"}
                      isTrailingIcon
                      data-testid="share-results-button"
                    >
                      Copy link
                    </OakSecondaryButton>
                  </OakFlex>
                  {isAttemptingShare === "shared" && (
                    <OakFlex $gap={"spacing-4"} $alignItems={"center"}>
                      <OakIcon
                        iconName={"tick"}
                        $colorFilter={"text-success"}
                      />
                      <OakHeading
                        tag="h2"
                        $font={"heading-light-7"}
                        $color={"text-success"}
                      >
                        Link copied to clipboard! You can share this with your
                        teacher.
                      </OakHeading>
                    </OakFlex>
                  )}
                  {isAttemptingShare === "failed" && (
                    <OakFlex $gap={"spacing-4"} $alignItems={"center"}>
                      <OakIcon iconName={"cross"} $colorFilter={"text-error"} />
                      <OakHeading
                        tag="h2"
                        $font={"heading-light-7"}
                        $color={"text-error"}
                      >
                        Failed to share results. Please try again.
                      </OakHeading>
                    </OakFlex>
                  )}
                </OakFlex>
              )}
              <OakHeading tag="h2" $font={"heading-light-7"}>
                {lessonTitle}
              </OakHeading>
            </OakFlex>

            <OakFlex $flexGrow={1}>
              <OakImage
                $display={["none", "none", "block"]}
                $height={"spacing-240"}
                alt="a man standing in front of a blackboard with a bunch of objects on top of his head and hands in the air"
                src={`https://${process.env.NEXT_PUBLIC_OAK_ASSETS_HOST}/${process.env.NEXT_PUBLIC_OAK_ASSETS_PATH}/v1699887218/svg-illustrations/xrazqgtjmbdf1clz8wic`}
              />
            </OakFlex>
          </OakFlex>
          <OakFlex
            $flexDirection={"column"}
            $alignItems={"stretch"}
            $gap={"spacing-16"}
            $mb="spacing-56"
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
              $pv={"spacing-24"}
              $ph={"spacing-24"}
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
