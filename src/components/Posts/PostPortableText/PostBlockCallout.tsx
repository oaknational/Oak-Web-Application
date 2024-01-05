import React, { FC } from "react";

import { P } from "../../Typography";

import Flex from "@/components/SharedComponents/Flex";

const PostBlockCallout: FC<{ children?: React.ReactNode }> = (props) => {
  return (
    <Flex $flexDirection={"column"} $mt={56}>
      <P $font={"heading-light-4"}>
        <blockquote>{props.children}</blockquote>
      </P>
    </Flex>
  );
};

export default PostBlockCallout;
