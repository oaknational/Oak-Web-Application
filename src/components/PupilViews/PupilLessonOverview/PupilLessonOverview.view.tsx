import { isString } from "lodash";
import {
  OakBox,
  OakBulletList,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakLessonBottomNav,
  OakLessonLayout,
  OakLessonNavItem,
  OakPrimaryButton,
  OakSpan,
  OakSubjectIcon,
  OakTertiaryButton,
  isValidIconName,
} from "@oaknational/oak-components";

import {
  LessonSection,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";

type PupilViewsLessonOverviewProps = {
  lessonTitle: string;
  yearTitle?: string;
  subjectTitle: string;
  subjectSlug: string;
  pupilLessonOutcome?: string;
  starterQuizNumQuestions: number;
  exitQuizNumQuestions: number;
};

export const PupilViewsLessonOverview = ({
  lessonTitle,
  subjectTitle,
  yearTitle,
  subjectSlug,
  pupilLessonOutcome,
  exitQuizNumQuestions,
  starterQuizNumQuestions,
}: PupilViewsLessonOverviewProps) => {
  const {
    completedSections,
    sectionResults,
    updateCurrentSection,
    proceedToNextSection,
  } = useLessonEngineContext();
  const subjectIconName: `subject-${string}` = `subject-${subjectSlug}`;

  function pickProgressForSection(section: LessonSection) {
    if (completedSections.includes(section)) {
      return "complete";
    }

    if (sectionResults[section]) {
      return "in-progress";
    }

    return "not-started";
  }

  return (
    <OakLessonLayout
      lessonSectionName={"overview"}
      topNavSlot={null}
      bottomNavSlot={
        <OakLessonBottomNav>
          <OakPrimaryButton
            onClick={proceedToNextSection}
            width={["100%", "auto", "auto"]}
            iconName="arrow-right"
            isTrailingIcon
          >
            Let's get ready
          </OakPrimaryButton>
        </OakLessonBottomNav>
      }
    >
      <OakGrid
        $maxWidth={["100%", "all-spacing-23", "100%"]}
        $mt="space-between-s"
        $mb={["space-between-none", "space-between-s"]}
        $mh="auto"
        $ph={["inner-padding-s", "inner-padding-xl", "inner-padding-none"]}
      >
        <OakGridArea $colStart={[1, 1, 2]} $colSpan={[12, 12, 10]}>
          <OakTertiaryButton disabled iconName="arrow-left">
            View all lessons
          </OakTertiaryButton>
        </OakGridArea>
      </OakGrid>
      <OakFlex
        $minHeight="100%"
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
              $ph={["inner-padding-s", "inner-padding-none"]}
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
                    fill="bg-decorative1-main"
                  />
                </OakBox>
              )}
              <OakBox>
                <OakBox $mb="space-between-s" $display={["none", "block"]}>
                  <OakBulletList
                    listItems={[yearTitle, subjectTitle].filter(isString)}
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
            {pupilLessonOutcome && (
              <OakBox $display={["none", "block"]} $mt="space-between-xl">
                <OakHeading tag="h2" $font="heading-7" $mb="space-between-s">
                  Lesson outcome
                </OakHeading>
                <OakSpan $font="body-1">{pupilLessonOutcome}</OakSpan>
              </OakBox>
            )}
          </OakGridArea>
          <OakGridArea
            $colStart={[1, 1, 7]}
            $colSpan={[12, 12, 5]}
            $ph={["inner-padding-s", "inner-padding-none"]}
          >
            <OakFlex $gap="space-between-s" $flexDirection="column">
              <OakLessonNavItem
                as="button"
                lessonSectionName="intro"
                onClick={() => updateCurrentSection("intro")}
                progress={pickProgressForSection("intro")}
              />
              <OakLessonNavItem
                as="button"
                lessonSectionName="starter-quiz"
                onClick={() => updateCurrentSection("starter-quiz")}
                progress={pickProgressForSection("starter-quiz")}
                numQuestions={exitQuizNumQuestions}
                grade={sectionResults["starter-quiz"]?.grade ?? 0}
              />
              <OakLessonNavItem
                as="button"
                lessonSectionName="video"
                onClick={() => updateCurrentSection("video")}
                progress={pickProgressForSection("video")}
                videoLength={0}
              />
              <OakLessonNavItem
                as="button"
                lessonSectionName="exit-quiz"
                onClick={() => updateCurrentSection("exit-quiz")}
                progress={pickProgressForSection("exit-quiz")}
                numQuestions={starterQuizNumQuestions}
                grade={sectionResults["exit-quiz"]?.grade ?? 0}
              />
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </OakFlex>
    </OakLessonLayout>
  );
};
