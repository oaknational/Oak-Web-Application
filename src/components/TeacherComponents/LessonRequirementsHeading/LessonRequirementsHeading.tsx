import React, { FC } from "react";
import { OakHeading, OakFlex } from "@oaknational/oak-components";

import Icon, { IconName } from "@/components/SharedComponents/Icon";

type LessonRequirementsHeadingProps = {
  helperIcon: IconName;
  heading: string;
};

const LessonRequirementsHeading: FC<LessonRequirementsHeadingProps> = ({
  helperIcon,
  heading,
}) => {
  return (
    <OakFlex $flexDirection={"row"} $alignItems={"center"}>
      <Icon name={helperIcon} variant="minimal" $mr={8} />
      <OakHeading $font={"heading-7"} tag="h3">
        {heading}
      </OakHeading>
    </OakFlex>
  );
};

export default LessonRequirementsHeading;
