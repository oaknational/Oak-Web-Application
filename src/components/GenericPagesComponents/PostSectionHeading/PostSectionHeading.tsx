import { FC } from "react";

import { Heading } from "@/components/SharedComponents/Typography";

const PostSectionHeading: FC<{ children?: React.ReactNode }> = (props) => {
  return (
    <Heading
      $font={["heading-6", "heading-4"]}
      tag="h2"
      $mt={[48, 56]}
      $mb={[24, 32]}
    >
      {props.children}
    </Heading>
  );
};

export default PostSectionHeading;
