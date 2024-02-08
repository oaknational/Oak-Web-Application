import React, { FC } from "react";
import { OakTypography } from "@oaknational/oak-components";

import Icon from "@/components/SharedComponents/Icon";

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
      {keyStageTitle} <Icon name="dot" size={6} $mb={2} $mr={4} />
      {yearTitle} <Icon name="dot" size={6} $mb={2} $mr={4} />
      {subjectTitle}
    </OakTypography>
  );
};

export default ListItemHeaderExpemplarCategoryHeading;
