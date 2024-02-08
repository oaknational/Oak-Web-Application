import { FC } from "react";
import { OakHeading } from "@oaknational/oak-components";

const PostSectionHeading: FC<{ children?: React.ReactNode }> = (props) => {
  return (
    <OakHeading
      $font={["heading-6", "heading-4"]}
      tag="h2"
      $mt={["space-between-l", "space-between-xl"]}
      $mb={["space-between-m", "space-between-m2"]}
    >
      {props.children}
    </OakHeading>
  );
};

export default PostSectionHeading;
