import { PortableTextComponentProps } from "@portabletext/react";

import { Quote } from "../../../common-lib/cms-types";
import { P } from "../../Typography";

import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";

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
