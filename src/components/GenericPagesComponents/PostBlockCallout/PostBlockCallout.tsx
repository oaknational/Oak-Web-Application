import React, { FC } from "react";
import { OakP } from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex";

const PostBlockCallout: FC<{ children?: React.ReactNode }> = (props) => {
  return (
    <Flex $flexDirection={"column"} $mt={56}>
      <OakP $font={"heading-light-4"}>
        <blockquote>{props.children}</blockquote>
      </OakP>
    </Flex>
  );
};

export default PostBlockCallout;
