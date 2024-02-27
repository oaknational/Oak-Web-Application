import React, { FC } from "react";
import { OakP, OakFlex } from "@oaknational/oak-components";

const PostBlockCallout: FC<{ children?: React.ReactNode }> = (props) => {
  return (
    <OakFlex $flexDirection={"column"} $mt="space-between-xl">
      <OakP $font={"heading-light-4"}>
        <blockquote>{props.children}</blockquote>
      </OakP>
    </OakFlex>
  );
};

export default PostBlockCallout;
