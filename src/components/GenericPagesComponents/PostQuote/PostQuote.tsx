import { PortableTextComponentProps } from "@portabletext/react";
import { OakP, OakFlex } from "@oaknational/oak-components";

import { Quote } from "@/common-lib/cms-types";
import Box from "@/components/SharedComponents/Box";

const PostQuote = (props: PortableTextComponentProps<Quote>) => {
  if (!props.value?.text) {
    return null;
  }

  return (
    <OakFlex $flexDirection={"column"} $mt="space-between-xl">
      <Box $font={["heading-light-5", "heading-light-4"]}>
        <blockquote>&ldquo;{props.value.text.trim()}&rdquo;</blockquote>
      </Box>
      <div>
        <OakP $font={"body-1"} $mt={["space-between-s"]}>
          <cite>{props.value?.attribution}</cite>
          {props.value.role && `, ${props.value.role}`}
        </OakP>
      </div>
    </OakFlex>
  );
};

export default PostQuote;
