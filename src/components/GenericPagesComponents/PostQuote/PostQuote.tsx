import { PortableTextComponentProps } from "@portabletext/react";
import { OakQuote, OakBox, OakQuoteProps } from "@oaknational/oak-components";

import { Quote } from "@/common-lib/cms-types";

const PostQuote = (
  props: PortableTextComponentProps<Quote> &
    Pick<OakQuoteProps, "hasLeftBorder" | "color">,
) => {
  const { hasLeftBorder = true, color = "bg-decorative1-main" } = props;

  if (!props.value?.text) {
    return null;
  }

  return (
    <OakBox $mt="spacing-48">
      <OakQuote
        quote={props.value.text.trim()}
        authorName={props.value.attribution ?? undefined}
        authorTitle={props.value.role ?? undefined}
        hasLeftBorder={hasLeftBorder}
        color={color}
      />
    </OakBox>
  );
};

export default PostQuote;
