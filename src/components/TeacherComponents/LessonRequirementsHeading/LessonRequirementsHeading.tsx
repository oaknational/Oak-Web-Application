import React, { FC } from "react";
import { OakHeading } from "@oaknational/oak-components";

import Icon, { IconName } from "@/components/SharedComponents/Icon";
import Flex from "@/components/SharedComponents/Flex";

type LessonRequirementsHeadingProps = {
  helperIcon: IconName;
  heading: string;
};

const LessonRequirementsHeading: FC<LessonRequirementsHeadingProps> = ({
  helperIcon,
  heading,
}) => {
  return (
    <Flex $flexDirection={"row"} $alignItems={"center"}>
      <Icon name={helperIcon} variant="minimal" $mr={8} />
      <OakHeading $font={"heading-7"} tag="h3">
        {heading}
      </OakHeading>
    </Flex>
  );
};

export default LessonRequirementsHeading;
