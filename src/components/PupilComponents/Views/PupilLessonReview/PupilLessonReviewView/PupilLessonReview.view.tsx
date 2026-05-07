import React from "react";
import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakLessonLayout,
} from "@oaknational/oak-components";

export type PupilLessonReviewViewProps = {
  phase: "primary" | "secondary";
  bottomNavSlot?: React.ReactNode;
  overviewButtonSlot?: React.ReactNode;
  shareOptionsSlot?: React.ReactNode;
  lessonTitle: string;
  illustrationSlot?: React.ReactNode;
  sectionSummarySlot: React.ReactNode;
  feedbackSlot: React.ReactNode;
};

export const PupilLessonReviewView = ({
  phase,
  bottomNavSlot = null,
  overviewButtonSlot,
  shareOptionsSlot,
  lessonTitle,
  illustrationSlot,
  sectionSummarySlot,
  feedbackSlot,
}: PupilLessonReviewViewProps) => {
  return (
    <OakLessonLayout
      bottomNavSlot={bottomNavSlot}
      lessonSectionName="review"
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
          {overviewButtonSlot}

          <OakFlex $mv="spacing-56">
            <OakFlex
              $flexDirection="column"
              $flexGrow={2}
              $gap="spacing-48"
              $justifyContent="center"
            >
              <OakHeading tag="h1" $font={["heading-4", "heading-3"]}>
                Lesson review
              </OakHeading>

              {shareOptionsSlot && (
                <OakFlex
                  $flexDirection="column"
                  $gap="spacing-16"
                  $minHeight="spacing-92"
                >
                  {shareOptionsSlot}
                </OakFlex>
              )}

              <OakHeading tag="h2" $font="heading-light-7">
                {lessonTitle}
              </OakHeading>
            </OakFlex>

            <OakFlex $flexGrow={1}>{illustrationSlot}</OakFlex>
          </OakFlex>

          {sectionSummarySlot}
          {feedbackSlot}
        </OakGridArea>
      </OakGrid>
    </OakLessonLayout>
  );
};
