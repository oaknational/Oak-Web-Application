import { PortableTextComponentProps } from "@portabletext/react";

import { Quote } from "../../../common-lib/cms-types";
import Flex from "../../Flex";
import { Span, P } from "../../Typography";

const BlogQuote = (props: PortableTextComponentProps<Quote>) => {
  if (!props.value?.text) {
    return null;
  }

  return (
    <Flex $flexDirection={"column"} $mt={56}>
      <Span $font={["heading-light-5", "heading-light-4"]}>
        <blockquote>&ldquo;{props.value.text.trim()}&rdquo;</blockquote>
      </Span>
      <div>
        <P $font={"body-1"} $mt={[16]} $textAlign="center">
          <cite>{props.value?.attribution}</cite>
          {props.value.role && `, ${props.value.role}`}
        </P>
      </div>
    </Flex>
  );
};

export default BlogQuote;
