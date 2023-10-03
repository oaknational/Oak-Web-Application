import React, { FC } from "react";

import Icon, { IconName } from "@/components/Icon";
import Flex from "@/components/Flex";
import { Heading } from "@/components/Typography";

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
      <Heading $font={"heading-7"} tag="h3">
        {heading}
      </Heading>
    </Flex>
  );
};

export default LessonRequirementsHeading;
