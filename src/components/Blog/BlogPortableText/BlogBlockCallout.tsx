import { FC } from "react";

import Flex from "../../Flex";
import { P } from "../../Typography";

const BlogBlockCallout: FC = (props) => {
  return (
    <Flex $flexDirection={"column"} $mt={56}>
      <P $font={"heading-light-4"}>
        <blockquote>{props.children}</blockquote>
      </P>
    </Flex>
  );
};

export default BlogBlockCallout;
