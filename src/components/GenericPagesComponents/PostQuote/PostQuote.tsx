import { PortableTextComponentProps } from "@portabletext/react";
import { OakP, OakFlex, OakTypography } from "@oaknational/oak-components";

import { Quote } from "@/common-lib/cms-types";

const PostQuote = (props: PortableTextComponentProps<Quote>) => {
  if (!props.value?.text) {
    return null;
  }

  return (
    <OakFlex $flexDirection={"column"} $mt="spacing-56">
      <OakTypography $font={["heading-light-5", "heading-light-4"]}>
        <blockquote>&ldquo;{props.value.text.trim()}&rdquo;</blockquote>
      </OakTypography>
      <div>
        <OakP $font={"body-1"} $mt={["spacing-16"]}>
          <cite>{props.value?.attribution}</cite>
          {props.value.role && `, ${props.value.role}`}
        </OakP>
      </div>
    </OakFlex>
  );
};

export default PostQuote;
