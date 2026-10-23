import { Fragment, type ReactElement } from "react";
import { OakBox, OakFlex, OakHeading, OakP } from "@oaknational/oak-components";

type TextBlock = string | ReactElement;

export type HeadingAndTextContent = {
  type: "heading-and-text";
  heading: string;
  /** Strings are rendered as paragraphs; elements (e.g. lists) are rendered as-is. */
  text: TextBlock | TextBlock[];
};

export function HeadingAndText({
  heading,
  text,
}: Readonly<Omit<HeadingAndTextContent, "type">>) {
  const blocks = Array.isArray(text) ? text : [text];

  return (
    <OakBox>
      <OakHeading
        $font={["heading-7", "heading-6", "heading-6"]}
        tag="h3"
        $mb={"spacing-16"}
      >
        {heading}
      </OakHeading>
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        {blocks.map((block, index) =>
          typeof block === "string" ? (
            <OakP key={index}>{block}</OakP>
          ) : (
            <Fragment key={index}>{block}</Fragment>
          ),
        )}
      </OakFlex>
    </OakBox>
  );
}
