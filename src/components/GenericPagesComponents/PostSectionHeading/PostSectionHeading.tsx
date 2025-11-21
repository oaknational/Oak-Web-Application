import { FC } from "react";
import { OakHeading } from "@oaknational/oak-components";

const PostSectionHeading: FC<{ children?: React.ReactNode }> = (props) => {
  return (
    <OakHeading
      $font={["heading-6", "heading-4"]}
      tag="h2"
      $mt={["spacing-48", "spacing-56"]}
      $mb={["spacing-24", "spacing-32"]}
    >
      {props.children}
    </OakHeading>
  );
};

export default PostSectionHeading;
