import { OakBox, OakHeading, OakP } from "@oaknational/oak-components";

export type PupilLessonOverviewOutcomesProps = {
  outcomes: string[];
  heading?: string;
};

export const PupilLessonOverviewOutcomes = ({
  outcomes,
  heading = "Lesson outcome",
}: PupilLessonOverviewOutcomesProps) => {
  if (outcomes.length === 0) {
    return null;
  }

  return (
    <OakBox $display={["none", "block"]} $mt="spacing-56">
      <OakHeading tag="h2" $font="heading-7" $mb="spacing-16">
        {heading}
      </OakHeading>
      {outcomes.map((outcome) => (
        <OakP key={outcome} $font="body-1" $mb="spacing-16">
          {outcome}
        </OakP>
      ))}
    </OakBox>
  );
};
