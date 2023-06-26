import { PortableTextComponentProps } from "@portabletext/react";

import { Quote } from "../../../common-lib/cms-types";
import Box from "../../Box";
import Flex from "../../Flex";
import { P } from "../../Typography";

const PostQuote = (props: PortableTextComponentProps<Quote>) => {
  if (!props.value?.text) {
    return null;
  }

  return (
    <Flex $flexDirection={"column"} $mt={56}>
      <Box $font={["heading-light-5", "heading-light-4"]}>
        <blockquote>&ldquo;{props.value.text.trim()}&rdquo;</blockquote>
      </Box>
      <div>
        <P $font={"body-1"} $mt={[16]}>
          <cite>{props.value?.attribution}</cite>
          {props.value.role && `, ${props.value.role}`}
        </P>
      </div>
    </Flex>
  );
};

export default PostQuote;
