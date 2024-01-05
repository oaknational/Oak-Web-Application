import { FC } from "react";

import Flex, { FlexProps } from "@/components/SharedComponents/Flex";

const Cover: FC<FlexProps> = (props) => {
  return (
    <Flex
      $position="absolute"
      $top={0}
      $right={0}
      $bottom={0}
      $left={0}
      {...props}
    />
  );
};

export default Cover;
