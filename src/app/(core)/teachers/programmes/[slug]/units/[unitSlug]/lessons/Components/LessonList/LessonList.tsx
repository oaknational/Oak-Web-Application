"use client";

import type { ReactNode } from "react";
import {
  OakBox,
  OakFlex,
  OakLI,
  OakP,
  OakSpan,
  OakTagFunctional,
} from "@oaknational/oak-components";

import type { UnitOverviewContentProps } from "../UnitOverviewContent/UnitOverviewContent";

import CardListing from "@/components/TeacherComponents/CardListing/CardListing";
import { resolveOakHref } from "@/common-lib/urls";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";

type LessonListProps = Pick<
  UnitOverviewContentProps,
  "programmeSlug" | "unitSlug" | "unitTitle" | "unitDescription" | "lessons"
> & {
  unitIndex?: number;
  unitCount?: number;
  lessonCount: number;
  unitDescription?: UnitOverviewContentProps["unitDescription"];
  subjectCategories?: string[] | null;
  selectedLessonIndex?: number;
  headerCtaSlot?: ReactNode | null;
};

function LessonSubcopy({
  lesson,
  currentLesson,
}: {
  readonly lesson: UnitOverviewContentProps["lessons"][number];
  readonly currentLesson: boolean;
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
  if (currentLesson) {
    return (
      <OakFlex $flexDirection={["column"]}>
        <OakBox>{lesson.pupilLessonOutcome}</OakBox>
        <OakBox $textAlign={"right"}>Current lesson</OakBox>
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
  lessons,
  unitIndex,
  unitCount,
  lessonCount,
  subjectCategories,
  selectedLessonIndex,
  headerCtaSlot = null,
}: LessonListProps) => {
  const showUnitCount = unitIndex !== undefined && unitCount !== undefined;

  return (
    <OakFlex $flexDirection="column">
      <OakFlex $justifyContent="space-between" $alignItems="flex-start">
        {showUnitCount && (
          <OakBox
            $background="bg-decorative3-very-subdued"
            $pa="spacing-20"
            $btlr="border-radius-l"
            $btrr="border-radius-l"
            $font="body-2"
            aria-hidden={true}
          >
            <OakSpan $font="body-2-bold">Unit {unitIndex}</OakSpan> of{" "}
            {unitCount}
          </OakBox>
        )}
        {subjectCategories ? (
          <OakFlex $gap={"spacing-8"}>
            {subjectCategories.map((subjectCategory) => (
              <OakTagFunctional
                label={subjectCategory}
                $background="bg-neutral"
                useSpan
                $borderRadius="border-radius-s"
                key={subjectCategory}
              />
            ))}
          </OakFlex>
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
        $btlr={showUnitCount ? "border-radius-square" : "border-radius-xl"}
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
            aria-label={
              showUnitCount
                ? `Unit ${unitIndex} of ${unitCount}: ${unitTitle}`
                : unitTitle
            }
          >
            {unitTitle}
          </OakBox>
          {unitDescription && <OakP $font="body-2">{unitDescription}</OakP>}
        </OakFlex>
        <OakBox>
          <OakFlex
            $justifyContent="space-between"
            $alignItems="flex-start"
            $gap="spacing-12"
          >
            <OakBox
              as="h3"
              $background="bg-decorative1-subdued"
              $pa="spacing-20"
              $btlr="border-radius-l"
              $btrr="border-radius-l"
              $font="body-2"
            >
              <OakSpan $font="body-2-bold">{lessonCount}</OakSpan> lessons in
              unit
            </OakBox>
            {headerCtaSlot}
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
                  highlightColorVariant={
                    selectedLessonIndex === lesson.orderInUnit
                      ? "tertiary"
                      : undefined
                  }
                  title={lesson.lessonTitle}
                  subcopy={
                    <LessonSubcopy
                      lesson={lesson}
                      currentLesson={selectedLessonIndex === lesson.orderInUnit}
                    />
                  }
                  href={resolveOakHref({
                    page: "integrated-lesson-overview",
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
