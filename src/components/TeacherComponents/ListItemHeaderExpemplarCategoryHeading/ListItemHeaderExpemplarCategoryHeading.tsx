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
      $color={"grey60"}
      $mb="space-between-sssx"
    >
      {keyStageTitle}{" "}
      <OakIcon
        iconName="dot"
        $width={"all-spacing-1"}
        $mb={"space-between-sssx"}
        $mr={"space-between-sssx"}
      />
      {yearTitle}{" "}
      <OakIcon
        iconName="dot"
        $width={"all-spacing-1"}
        $mb={"space-between-sssx"}
        $mr={"space-between-sssx"}
      />
      {subjectTitle}
    </OakTypography>
  );
};

export default ListItemHeaderExpemplarCategoryHeading;
