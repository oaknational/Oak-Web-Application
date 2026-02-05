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
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonNavItem,
  OakP,
  OakPrimaryButton,
  OakPupilContentGuidance,
  OakSpan,
  OakSubjectIcon,
  isValidIconName,
  OakLI,
} from "@oaknational/oak-components";

import {
  LessonReviewSection,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";
import { ViewAllLessonsButton } from "@/components/PupilComponents/ViewAllLessonsButton/ViewAllLessonsButton";
import { useGetSectionLinkProps } from "@/components/PupilComponents/pupilUtils/lessonNavigation";
import { LessonBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { useTrackSectionStarted } from "@/hooks/useTrackSectionStarted";
import { usePupilAnalytics } from "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics";
import { useAssignmentSearchParams } from "@/hooks/useAssignmentSearchParams";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import {
  getDoesSubjectHaveNewUnits,
  TakedownBanner,
} from "@/components/SharedComponents/TakedownBanner/TakedownBanner";

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
  const { isClassroomAssignment, classroomAssignmentChecked } =
    useAssignmentSearchParams();
  const { programmeFields, lessonData, programmeSlug } = browseData;
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
  const { track } = usePupilAnalytics();
  const { trackSectionStarted } = useTrackSectionStarted();
  const subjectIconName: `subject-${string}` = `subject-${subjectSlug}`;
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const baseSlug = `${browseData.programmeFields.subjectSlug}-${browseData.programmeFields.phaseSlug}-${browseData.programmeFields.yearSlug}`;
  const unitListingHref = `/pupils/programmes/${baseSlug}/options`; // NB. options will forward to units if no options available

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
      <OakP key={outcome} $font="body-1" $mb="spacing-16">
        {outcome}
      </OakP>
    ));

  const expiringBanner = (
    <TakedownBanner
      isExpiring={
        expirationDate !== null ||
        browseData.actions?.displayExpiringBanner === true
      }
      isLegacy={isSlugLegacy(programmeSlug)}
      hasNewUnits={getDoesSubjectHaveNewUnits(subjectSlug)}
      subjectSlug={subjectSlug}
      userType="pupil"
      onwardHref={unitListingHref}
    />
  );

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
        $maxWidth={["100%", "spacing-960", "100%"]}
        $mt="spacing-24"
        $mb={["spacing-0", "spacing-16"]}
        $mh="auto"
        $ph={["spacing-16", "spacing-24", "spacing-0"]}
      >
        <OakGridArea
          $colStart={[1, 1, 2]}
          $colSpan={[12, 12, 10]}
          $minHeight={"spacing-32"}
        >
          {classroomAssignmentChecked && !isClassroomAssignment && (
            <ViewAllLessonsButton
              href={backUrl}
              onClick={() => {
                if (isLessonComplete === false) {
                  track.lessonAbandoned({});
                }
              }}
            />
          )}
        </OakGridArea>
        <OakGridArea
          $colStart={[1, 1, 2]}
          $colSpan={[12, 12, 10]}
          $pt="spacing-24"
          $display={["none", "block"]}
        >
          {expiringBanner}
        </OakGridArea>
      </OakGrid>
      <OakFlex
        $alignItems={["flex-start", "flex-start", "center"]}
        $pv="spacing-24"
        $ph={["spacing-0", "spacing-24", "spacing-0"]}
        $width="100%"
        $maxWidth={["100%", "spacing-960", "100%"]}
        $mh="auto"
      >
        <OakGrid $cg="spacing-16">
          <OakGridArea
            $colStart={[1, 1, 2]}
            $colSpan={[12, 12, 5]}
            $mb={["spacing-56", "spacing-56", "spacing-0"]}
          >
            <OakFlex
              $flexDirection={["row", "row", "column"]}
              $alignItems={["center", "center", "flex-start"]}
              $gap={["spacing-16", "spacing-24", "spacing-0"]}
              $borderColor="bg-decorative1-main"
              $pb={["spacing-20", "spacing-0"]}
              $ph={["spacing-16", "spacing-0"]}
              $bb={["border-solid-l", "border-solid-none", "border-solid-none"]}
            >
              {isValidIconName(subjectIconName) && (
                <OakBox $mb={["spacing-0", "spacing-0", "spacing-24"]}>
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
                <OakBox $mb="spacing-16" $display={["none", "block"]}>
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
              <OakBox $display={["none", "block"]} $mt="spacing-56">
                <OakHeading tag="h2" $font="heading-7" $mb="spacing-16">
                  Lesson outcome
                </OakHeading>
                {lessonOutcomes}
              </OakBox>
            )}

            {contentGuidance && (
              <OakBox
                $display={["none", "block"]}
                $mt="spacing-56"
                data-testid="content-guidance-info"
              >
                <OakFlex
                  $gap="spacing-8"
                  $flexDirection="row"
                  $alignItems="center"
                  $mb="spacing-16"
                >
                  <OakIcon iconName="warning" $colorFilter="icon-warning" />
                  <OakHeading tag="h2" $font="heading-7">
                    Content guidance
                  </OakHeading>
                </OakFlex>
                <OakSpan $font="body-1">
                  {contentGuidance.map((item) => {
                    const contentGuidanceLabel = item.contentguidanceLabel;
                    const hasFullStop = contentGuidanceLabel?.slice(-1) === ".";
                    return contentGuidanceLabel && hasFullStop
                      ? contentGuidanceLabel + " "
                      : contentGuidanceLabel + ". ";
                  })}
                  {supervisionLevel + "."}
                </OakSpan>
              </OakBox>
            )}
          </OakGridArea>

          <OakGridArea
            $display={["block", "none"]}
            $colStart={[1, 1, 7]}
            $colSpan={[12, 12, 5]}
            $ph={["spacing-16", "spacing-0"]}
            $pb={"spacing-16"}
          >
            {expiringBanner}
          </OakGridArea>
          <OakGridArea
            $colStart={[1, 1, 7]}
            $colSpan={[12, 12, 5]}
            $ph={["spacing-16", "spacing-0"]}
          >
            <OakFlex
              as="ul"
              $ma={"spacing-0"}
              $pa={"spacing-0"}
              $gap="spacing-16"
              $flexDirection="column"
            >
              {lessonReviewSections.includes("intro") && (
                <OakLI $listStyle="none">
                  <OakLessonNavItem
                    {...getSectionLinkProps("intro", () => {
                      trackSectionStarted("intro");
                      updateCurrentSection("intro");
                    })}
                    lessonSectionName="intro"
                    progress={pickProgressForSection("intro")}
                  />
                </OakLI>
              )}
              {lessonReviewSections.includes("starter-quiz") && (
                <OakLI $listStyle="none">
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
                </OakLI>
              )}
              {lessonReviewSections.includes("video") && (
                <OakLI $listStyle="none">
                  <OakLessonNavItem
                    {...getSectionLinkProps("video", () => {
                      trackSectionStarted("video");
                      updateCurrentSection("video");
                    })}
                    lessonSectionName="video"
                    progress={pickProgressForSection("video")}
                  />
                </OakLI>
              )}
              {lessonReviewSections.includes("exit-quiz") && (
                <OakLI $listStyle="none">
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
                </OakLI>
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
