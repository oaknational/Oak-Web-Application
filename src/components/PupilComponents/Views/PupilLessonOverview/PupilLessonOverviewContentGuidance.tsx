import {
  OakFlex,
  OakHeading,
  OakIcon,
  OakPupilContentGuidance,
  OakSpan,
} from "@oaknational/oak-components";

import { formatContentGuidanceText } from "./helpers/formatContentGuidanceText";

export type PupilLessonOverviewContentGuidanceProps = {
  contentGuidance: OakPupilContentGuidance[];
  supervisionLevel?: string | null;
  heading?: string;
};

export const PupilLessonOverviewContentGuidance = ({
  contentGuidance,
  supervisionLevel,
  heading = "Content guidance",
}: PupilLessonOverviewContentGuidanceProps) => {
  if (contentGuidance.length === 0) {
    return null;
  }

  return (
    <>
      <OakFlex
        $gap="spacing-8"
        $flexDirection="row"
        $alignItems="center"
        $mb="spacing-16"
      >
        <OakIcon iconName="warning" $colorFilter="icon-warning" />
        <OakHeading tag="h2" $font="heading-7">
          {heading}
        </OakHeading>
      </OakFlex>

      <OakSpan $font="body-1">
        {formatContentGuidanceText({ contentGuidance, supervisionLevel })}
      </OakSpan>
    </>
  );
};
