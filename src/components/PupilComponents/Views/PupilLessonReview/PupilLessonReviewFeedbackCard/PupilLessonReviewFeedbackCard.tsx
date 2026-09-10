import React from "react";
import { OakFlex, OakHandDrawnCard } from "@oaknational/oak-components";

export type PupilLessonReviewFeedbackCardProps = {
  feedback: React.ReactNode;
};

export const PupilLessonReviewFeedbackCard = ({
  feedback,
}: PupilLessonReviewFeedbackCardProps) => {
  return (
    <OakFlex
      $flexGrow={1}
      $flexDirection={["row", "column"]}
      $alignItems={["center", "flex-end"]}
    >
      <OakHandDrawnCard $pv="spacing-24" $ph="spacing-24" $alignItems="center">
        <OakFlex $font="heading-5" $textAlign={["center", "left", "left"]}>
          {feedback}
        </OakFlex>
      </OakHandDrawnCard>
    </OakFlex>
  );
};
