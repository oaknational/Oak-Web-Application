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
        $mr={"spacing-8"}
        $width={"spacing-24"}
        $height={"spacing-24"}
      />
      <OakHeading $font={"heading-7"} tag="h3">
        {heading}
      </OakHeading>
    </OakFlex>
  );
};

export default LessonRequirementsHeading;
