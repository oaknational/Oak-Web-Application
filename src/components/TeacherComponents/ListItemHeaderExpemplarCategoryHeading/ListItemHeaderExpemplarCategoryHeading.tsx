import React, { FC } from "react";
import { OakTypography, OakIcon } from "@oaknational/oak-components";

type ListItemHeaderExpemplarCategoryHeadingProps = {
  keyStageTitle?: string;
  subjectTitle?: string;
  yearTitle?: string | null;
};

const ListItemHeaderExpemplarCategoryHeading: FC<
  ListItemHeaderExpemplarCategoryHeadingProps
> = ({ keyStageTitle, subjectTitle, yearTitle }) => {
  return (
    <OakTypography
      $font={["body-3", "heading-light-7"]}
      $color={"text-subdued"}
      $mb="spacing-4"
    >
      {keyStageTitle}{" "}
      <OakIcon
        iconName="dot"
        $width={"spacing-4"}
        $height={"spacing-4"}
        $mb={"spacing-4"}
        $mr={"spacing-4"}
        $display={"inline-flex"}
      />
      {yearTitle}{" "}
      <OakIcon
        iconName="dot"
        $width={"spacing-4"}
        $height={"spacing-4"}
        $mb={"spacing-4"}
        $mr={"spacing-4"}
        $display={"inline-flex"}
      />
      {subjectTitle}
    </OakTypography>
  );
};

export default ListItemHeaderExpemplarCategoryHeading;
