import React, { FC } from "react";

import Icon from "../Icon";
import Typography from "../Typography";

type ExemplarCategoryHeadingProps = {
  keyStageTitle?: string;
  subjectTitle?: string;
  yearTitle?: string | null;
};

const ExemplarCategoryHeading: FC<ExemplarCategoryHeadingProps> = ({
  keyStageTitle,
  subjectTitle,
  yearTitle,
}) => {
  return (
    <Typography
      $font={["body-3", "heading-light-7"]}
      $color={"oakGrey4"}
      $mb={4}
    >
      {keyStageTitle} <Icon name="dot" size={6} $mb={2} $mr={4} />
      {yearTitle} <Icon name="dot" size={6} $mb={2} $mr={4} />
      {subjectTitle}
    </Typography>
  );
};

export default ExemplarCategoryHeading;
