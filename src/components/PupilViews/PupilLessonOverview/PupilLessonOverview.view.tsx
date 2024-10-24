import { isString } from "lodash";
import { useEffect, useState } from "react";
import {
  OakBox,
  OakBulletList,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakIcon,
  OakInlineBanner,
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonNavItem,
  OakP,
  OakPrimaryButton,
  OakPupilContentGuidance,
  OakSecondaryLink,
  OakSpan,
  OakSubjectIcon,
  isValidIconName,
} from "@oaknational/oak-components";

import {
  LessonReviewSection,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";
import { ViewAllLessonsButton } from "@/components/PupilComponents/ViewAllLessonsButton/ViewAllLessonsButton";
import { useGetSectionLinkProps } from "@/components/PupilComponents/pupilUtils/lessonNavigation";
import { LessonBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { useTrackSectionStarted } from "@/hooks/useTrackSectionStarted";

type PupilViewsLessonOverviewProps = {
  browseData: LessonBrowseData;
  lessonTitle: string;
  pupilLessonOutcome?: string;
  phonicsOutcome?: string;
  contentGuidance?: OakPupilContentGuidance[] | null;
  supervisionLevel?: string;
  starterQuizNumQuestions: number;
  exitQuizNumQuestions: number;
  backUrl?: string | null;
};

export const PupilViewsLessonOverview = ({
  lessonTitle,
  pupilLessonOutcome,
  phonicsOutcome,
  contentGuidance,
  supervisionLevel,
  exitQuizNumQuestions,
  starterQuizNumQuestions,
  backUrl,
  browseData,
}: PupilViewsLessonOverviewProps) => {
  const { programmeFields, lessonData } = browseData;
  const {
    subjectSlug,
    phase = "primary",
    yearDescription,
    subject,
  } = programmeFields;
  const { expirationDate } = lessonData;
  const {
    sectionResults,
    proceedToNextSection,
    lessonReviewSections,
    isLessonComplete,
    lessonStarted,
    updateCurrentSection,
  } = useLessonEngineContext();
  const getSectionLinkProps = useGetSectionLinkProps();
  const { trackSectionStarted } = useTrackSectionStarted();
  const subjectIconName: `subject-${string}` = `subject-${subjectSlug}`;
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [showExpiredLessonsBanner, setShowExpiredLessonsBanner] =
    useState<boolean>(
      expirationDate !== null ||
        browseData.actions?.displayExpiringBanner === true,
    );

  function pickProgressForSection(section: LessonReviewSection) {
    if (sectionResults[section]?.isComplete) {
      return "complete";
    }

    if (sectionResults[section]) {
      return "in-progress";
    }

    return "not-started";
  }

  const handleProceedToNextSectionClick = () => {
    const nextSection =
      lessonReviewSections.find(
        (section) => !sectionResults[section]?.isComplete,
      ) ?? "review";
    proceedToNextSection();
    trackSectionStarted(nextSection);
  };

  const lessonOutcomes = [pupilLessonOutcome, phonicsOutcome]
    .filter(Boolean)
    .map((outcome) => (
      <OakP key={outcome} $font="body-1" $mb="space-between-s">
        {outcome}
      </OakP>
    ));

  return (
    <OakLessonLayout
      lessonSectionName={"overview"}
      phase={phase as "primary" | "secondary"}
      topNavSlot={null}
      bottomNavSlot={
        <OakLessonBottomNav>
          <OakPrimaryButton
            onClick={handleProceedToNextSectionClick}
            width={["100%", "max-content"]}
            iconName="arrow-right"
            isTrailingIcon
            data-testid="proceed-to-next-section"
            disabled={!isMounted}
          >
            {pickProceedToNextSectionLabel(
              lessonStarted,
              isLessonComplete,
              sectionResults,
            )}
          </OakPrimaryButton>
        </OakLessonBottomNav>
      }
    >
      <OakGrid
        $maxWidth={["100%", "all-spacing-23", "100%"]}
        $mt="space-between-m"
        $mb={["space-between-none", "space-between-s"]}
        $mh="auto"
        $ph={["inner-padding-m", "inner-padding-xl", "inner-padding-none"]}
      >
        <OakGridArea $colStart={[1, 1, 2]} $colSpan={[12, 12, 10]}>
          <ViewAllLessonsButton href={backUrl} />
        </OakGridArea>
        <OakGridArea $colStart={[1, 1, 2]} $colSpan={[12, 12, 10]}>
          <OakInlineBanner
            canDismiss
            cta={
              <OakSecondaryLink
                href="https://support.thenational.academy/lesson-unavailable"
                iconName="chevron-right"
                isTrailingIcon
              >
                Read the help article
              </OakSecondaryLink>
            }
            isOpen={showExpiredLessonsBanner}
            message="We've made brand new and improved lessons for you."
            onDismiss={() => {
              setShowExpiredLessonsBanner(false);
            }}
            title="This lesson will soon be taken down."
            type="alert"
            $mt={"space-between-m"}
          />
        </OakGridArea>
      </OakGrid>

      <OakFlex
        $alignItems={["flex-start", "flex-start", "center"]}
        $pv="inner-padding-xl"
        $ph={["inner-padding-none", "inner-padding-xl", "inner-padding-none"]}
        $width="100%"
        $maxWidth={["100%", "all-spacing-23", "100%"]}
        $mh="auto"
      >
        <OakGrid $cg="space-between-s">
          <OakGridArea
            $colStart={[1, 1, 2]}
            $colSpan={[12, 12, 5]}
            $mb={["space-between-xl", "space-between-xl", "space-between-none"]}
          >
            <OakFlex
              $flexDirection={["row", "row", "column"]}
              $alignItems={["center", "center", "flex-start"]}
              $gap={[
                "space-between-s",
                "space-between-m",
                "space-between-none",
              ]}
              $borderColor="bg-decorative1-main"
              $pb={["inner-padding-l", "inner-padding-none"]}
              $ph={["inner-padding-m", "inner-padding-none"]}
              $bb={["border-solid-l", "border-solid-none", "border-solid-none"]}
            >
              {isValidIconName(subjectIconName) && (
                <OakBox
                  $mb={[
                    "space-between-none",
                    "space-between-none",
                    "space-between-m",
                  ]}
                >
                  <OakSubjectIcon
                    iconName={subjectIconName}
                    alt=""
                    fill={
                      phase === "primary"
                        ? "bg-decorative4-main"
                        : "bg-decorative3-main"
                    }
                  />
                </OakBox>
              )}
              <OakBox>
                <OakBox $mb="space-between-s" $display={["none", "block"]}>
                  <OakBulletList
                    listItems={[yearDescription, subject].filter(isString)}
                    $color="text-subdued"
                  />
                </OakBox>
                <OakHeading
                  tag="h1"
                  $font={["heading-7", "heading-5", "heading-3"]}
                >
                  {lessonTitle}
                </OakHeading>
              </OakBox>
            </OakFlex>
            {lessonOutcomes && (
              <OakBox $display={["none", "block"]} $mt="space-between-xl">
                <OakHeading tag="h2" $font="heading-7" $mb="space-between-s">
                  Lesson outcome
                </OakHeading>
                {lessonOutcomes}
              </OakBox>
            )}

            {contentGuidance && (
              <OakBox
                $display={["none", "block"]}
                $mt="space-between-xl"
                data-testid="content-guidance-info"
              >
                <OakFlex
                  $gap="space-between-ssx"
                  $flexDirection="row"
                  $alignItems="center"
                  $mb="space-between-s"
                >
                  <OakIcon iconName="warning" $colorFilter="amber" />
                  <OakHeading tag="h2" $font="heading-7">
                    Content guidance
                  </OakHeading>
                </OakFlex>
                <OakSpan $font="body-1">
                  {contentGuidance.map(
                    (item) => item.contentguidanceLabel + " ",
                  )}
                  {supervisionLevel}
                </OakSpan>
              </OakBox>
            )}
          </OakGridArea>
          <OakGridArea
            $colStart={[1, 1, 7]}
            $colSpan={[12, 12, 5]}
            $ph={["inner-padding-m", "inner-padding-none"]}
          >
            <OakFlex $gap="space-between-s" $flexDirection="column">
              {lessonReviewSections.includes("intro") && (
                <OakLessonNavItem
                  {...getSectionLinkProps("intro", () => {
                    trackSectionStarted("intro");
                    updateCurrentSection("intro");
                  })}
                  lessonSectionName="intro"
                  progress={pickProgressForSection("intro")}
                />
              )}
              {lessonReviewSections.includes("starter-quiz") && (
                <OakLessonNavItem
                  {...getSectionLinkProps("starter-quiz", () => {
                    trackSectionStarted("starter-quiz");
                    updateCurrentSection("starter-quiz");
                  })}
                  lessonSectionName="starter-quiz"
                  progress={pickProgressForSection("starter-quiz")}
                  numQuestions={starterQuizNumQuestions}
                  grade={sectionResults["starter-quiz"]?.grade ?? 0}
                  data-testid="starter-quiz"
                />
              )}
              {lessonReviewSections.includes("video") && (
                <OakLessonNavItem
                  {...getSectionLinkProps("video", () => {
                    trackSectionStarted("video");
                    updateCurrentSection("video");
                  })}
                  lessonSectionName="video"
                  progress={pickProgressForSection("video")}
                />
              )}
              {lessonReviewSections.includes("exit-quiz") && (
                <OakLessonNavItem
                  {...getSectionLinkProps("exit-quiz", () => {
                    trackSectionStarted("exit-quiz");
                    updateCurrentSection("exit-quiz");
                  })}
                  lessonSectionName="exit-quiz"
                  progress={pickProgressForSection("exit-quiz")}
                  numQuestions={exitQuizNumQuestions}
                  grade={sectionResults["exit-quiz"]?.grade ?? 0}
                  data-testid="exit-quiz"
                />
              )}
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </OakFlex>
    </OakLessonLayout>
  );
};

function pickProceedToNextSectionLabel(
  lessonStarted: boolean,
  isLessonComplete: boolean,
  results: ReturnType<typeof useLessonEngineContext>["sectionResults"],
) {
  if (isLessonComplete) {
    return "Lesson review";
  }

  if (lessonStarted) {
    return "Continue lesson";
  }

  if (results["intro"]?.isComplete) {
    return "Start lesson";
  }

  return "Let's get ready";
}
