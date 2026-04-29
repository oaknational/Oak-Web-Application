import {
  OakCardHeader,
  OakP,
  OakStaticMessageCard,
} from "@oaknational/oak-components";

export type PupilLessonIntroReadyCardProps = {
  heading?: string;
  lineOne?: string;
  lineTwo?: string;
};

export const PupilLessonIntroReadyCard = ({
  heading = "Are you ready to learn?",
  lineOne = "Are you sitting in a quiet space away from distractions?",
  lineTwo = "Do you have all the equipment you need?",
}: PupilLessonIntroReadyCardProps) => {
  return (
    <OakStaticMessageCard>
      <OakCardHeader iconName="question-mark" tag="h2">
        {heading}
      </OakCardHeader>
      <OakP>{lineOne}</OakP>
      <OakP>{lineTwo}</OakP>
    </OakStaticMessageCard>
  );
};
