import React, { FC } from "react";
import {
  OakHeading,
  OakFlex,
  OakIcon,
  OakIconName,
} from "@oaknational/oak-components";

type LessonRequirementsHeadingProps = {
  helperIcon: OakIconName;
  heading: string;
};

const LessonRequirementsHeading: FC<LessonRequirementsHeadingProps> = ({
  helperIcon,
  heading,
}) => {
  return (
    <OakFlex $flexDirection={"row"} $alignItems={"center"}>
      <OakIcon
        iconName={helperIcon}
        $mr={"space-between-ssx"}
        $width={"all-spacing-6"}
        $height={"all-spacing-6"}
      />
      <OakHeading $font={"heading-7"} tag="h3">
        {heading}
      </OakHeading>
    </OakFlex>
  );
};

export default LessonRequirementsHeading;
