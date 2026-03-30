"use client";

import {
  OakBox,
  OakFlex,
  OakHeading,
  OakLI,
  OakP,
  OakSpan,
  OakTagFunctional,
} from "@oaknational/oak-components";

import CardListing from "@/components/TeacherComponents/CardListing/CardListing";
import { SaveUnitButton } from "@/components/TeacherComponents/SaveUnitButton/SaveUnitButton";
import { resolveOakHref } from "@/common-lib/urls";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

type LessonListLesson = {
  lessonSlug: string;
  lessonTitle: string;
  pupilLessonOutcome?: string | null;
  orderInUnit?: number | null;
  isUnpublished: boolean;
};

type LessonListProps = {
  programmeSlug: string;
  unitSlug: string;
  unitTitle: string;
  unitDescription?: string | null;
  subjectTitle?: string | null;
  subjectSlug: string;
  keyStageSlug?: string;
  keyStageTitle?: string | null;
  lessons: LessonListLesson[];
  unitOrder: number;
  unitCount: number;
  lessonCount: number;
};

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
  unitOrder,
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
        >
          <OakSpan as="strong" $font="body-2-bold">
            Unit {unitOrder}
          </OakSpan>{" "}
          of {unitCount}
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
        $gap="spacing-32"
        $background="bg-primary"
        $ph="spacing-20"
        $pt="spacing-32"
        $pb="spacing-24"
        $borderRadius="border-radius-xl"
        $btlr="border-radius-square"
        $dropShadow="drop-shadow-centred-standard"
      >
        <OakFlex $flexDirection="column" $gap="spacing-16">
          <OakHeading tag="h2" $font="heading-5">
            {unitTitle}
          </OakHeading>
          {unitDescription ? (
            <OakP $font="body-2">{unitDescription}</OakP>
          ) : null}
        </OakFlex>

        <OakBox>
          <OakFlex $justifyContent="space-between" $alignItems="flex-start">
            <OakBox
              $background="bg-decorative1-subdued"
              $pa="spacing-20"
              $btlr="border-radius-l"
              $btrr="border-radius-l"
              $font="body-2"
            >
              <OakSpan as="strong" $font="body-2-bold">
                {lessonCount}
              </OakSpan>{" "}
              lessons in unit
            </OakBox>
            <SaveUnitButton
              buttonVariant="default"
              programmeSlug={programmeSlug}
              unitSlug={unitSlug}
              unitTitle={unitTitle}
              trackingProps={{
                savedFrom: "lesson_listing_save_button",
                keyStageTitle:
                  (keyStageTitle as KeyStageTitleValueType | null) ?? undefined,
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
                  subcopy={
                    lesson.isUnpublished
                      ? "Coming soon"
                      : (lesson.pupilLessonOutcome ?? undefined)
                  }
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
