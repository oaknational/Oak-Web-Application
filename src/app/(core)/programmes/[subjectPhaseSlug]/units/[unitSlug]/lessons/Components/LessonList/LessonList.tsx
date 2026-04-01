"use client";

import {
  OakBox,
  OakFlex,
  OakLI,
  OakP,
  OakSpan,
  OakTagFunctional,
} from "@oaknational/oak-components";

import type { UnitViewProps } from "../UnitView";

import CardListing from "@/components/TeacherComponents/CardListing/CardListing";
import { SaveUnitButton } from "@/components/TeacherComponents/SaveUnitButton/SaveUnitButton";
import { resolveOakHref } from "@/common-lib/urls";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";

type LessonListProps = UnitViewProps & {
  lessonCount: number;
};

function LessonSubcopy({
  lesson,
}: {
  readonly lesson: UnitViewProps["lessons"][number];
}) {
  const loginRequired =
    "loginRequired" in lesson ? lesson.loginRequired : false;
  const geoRestricted =
    "geoRestricted" in lesson ? lesson.geoRestricted : false;

  const {
    showSignedOutLoginRequired,
    showSignedOutGeoRestricted,
    showSignedInNotOnboarded,
    showGeoBlocked,
  } = useComplexCopyright({ loginRequired, geoRestricted });

  const showComplexCopyrightTag =
    showSignedOutLoginRequired ||
    showSignedOutGeoRestricted ||
    showSignedInNotOnboarded ||
    showGeoBlocked;

  if (lesson.isUnpublished) return "Coming soon";
  if (showComplexCopyrightTag) {
    return (
      <OakFlex
        $justifyContent="space-between"
        $alignItems={["flex-start", "flex-start", "flex-end"]}
        $gap="spacing-16"
        $flexDirection={["column", "column", "row"]}
      >
        {lesson.pupilLessonOutcome}{" "}
        <OakTagFunctional
          label="Copyrighted"
          iconName="copyright"
          isTrailingIcon
          useSpan
          $background="bg-neutral"
          $ba="border-solid-s"
          $borderColor="border-neutral"
        />
      </OakFlex>
    );
  }
  return lesson.pupilLessonOutcome;
}

const LessonList = ({
  programmeSlug,
  unitSlug,
  unitTitle,
  unitDescription,
  subjectTitle,
  subjectSlug,
  keyStageSlug,
  keyStageTitle,
  lessons,
  unitIndex,
  unitCount,
  lessonCount,
}: LessonListProps) => {
  return (
    <OakFlex $flexDirection="column">
      <OakFlex $justifyContent="space-between" $alignItems="flex-start">
        <OakBox
          $background="bg-decorative3-very-subdued"
          $pa="spacing-20"
          $btlr="border-radius-l"
          $btrr="border-radius-l"
          $font="body-2"
          aria-hidden={true}
        >
          <OakSpan $font="body-2-bold">Unit {unitIndex}</OakSpan> of {unitCount}
        </OakBox>
        {subjectTitle ? (
          <OakTagFunctional
            label={subjectTitle}
            $background="bg-neutral"
            useSpan
            $borderRadius="border-radius-s"
          />
        ) : null}
      </OakFlex>

      <OakFlex
        $flexDirection="column"
        $gap={["spacing-32", "spacing-32", "spacing-56"]}
        $background="bg-primary"
        $ph="spacing-20"
        $pt={["spacing-32", "spacing-32", "spacing-56"]}
        $pb="spacing-24"
        $borderRadius="border-radius-xl"
        $btlr="border-radius-square"
        $dropShadow="drop-shadow-centred-standard"
      >
        <OakFlex
          $flexDirection="column"
          $gap="spacing-16"
          $ph={["spacing-0", "spacing-0", "spacing-24"]}
        >
          <OakBox
            as="h2"
            $font="heading-5"
            aria-label={`Unit ${unitIndex} of ${unitCount}: ${unitTitle}`}
          >
            {unitTitle}
          </OakBox>
          {unitDescription ? (
            <OakP $font="body-2">{unitDescription}</OakP>
          ) : null}
        </OakFlex>

        <OakBox>
          <OakFlex $justifyContent="space-between" $alignItems="flex-start">
            <OakBox
              as="h2"
              $background="bg-decorative1-subdued"
              $pa="spacing-20"
              $btlr="border-radius-l"
              $btrr="border-radius-l"
              $font="body-2"
            >
              <OakSpan $font="body-2-bold">{lessonCount}</OakSpan> lessons in
              unit
            </OakBox>
            <SaveUnitButton
              buttonVariant="default"
              programmeSlug={programmeSlug}
              unitSlug={unitSlug}
              unitTitle={unitTitle}
              trackingProps={{
                savedFrom: "lesson_listing_save_button",
                keyStageTitle:
                  (keyStageTitle as KeyStageTitleValueType) ?? undefined,
                keyStageSlug,
                subjectTitle: subjectTitle ?? "",
                subjectSlug,
              }}
            />
          </OakFlex>

          <OakFlex
            as="ol"
            $flexDirection="column"
            $gap="spacing-8"
            $ma="spacing-0"
            $background="bg-decorative1-main"
            $pa="spacing-8"
            $borderRadius="border-radius-l"
            $btlr="border-radius-square"
          >
            {lessons.map((lesson) => (
              <OakLI
                $listStyle="none"
                key={lesson.lessonSlug}
                $textWrap="balance"
              >
                <CardListing
                  layoutVariant="horizontal"
                  isHighlighted={false}
                  title={lesson.lessonTitle}
                  subcopy={<LessonSubcopy lesson={lesson} />}
                  href={resolveOakHref({
                    page: "lesson-overview",
                    programmeSlug,
                    unitSlug,
                    lessonSlug: lesson.lessonSlug,
                  })}
                  index={lesson.orderInUnit ?? undefined}
                  disabled={lesson.isUnpublished}
                />
              </OakLI>
            ))}
          </OakFlex>
        </OakBox>
      </OakFlex>
    </OakFlex>
  );
};

export default LessonList;
