import {
  OakBox,
  OakFlex,
  OakHeading,
  OakP,
  OakColorToken,
  OakHeadingProps,
  OakPProps,
} from "@oaknational/oak-components";

export type CurricQuoteProps = {
  title: string;
  children: string;
  backgroundColor?: OakColorToken;
  barColor?: OakColorToken;
  headingProps?: OakHeadingProps;
  paragraphProps?: OakPProps;
};

export default function CurricQuote({
  title,
  children,
  backgroundColor = "transparent",
  barColor = "mint30",
  headingProps,
  paragraphProps,
}: Readonly<CurricQuoteProps>) {
  return (
    <OakBox $background={backgroundColor} data-testid="curric-quote">
      <OakFlex $flexDirection="row" $pr={"spacing-24"} $columnGap="spacing-24">
        {barColor !== "transparent" && (
          <OakFlex
            data-testid="decorative-bar"
            $width="spacing-8"
            $background={barColor}
            $flexShrink={0}
          />
        )}
        <OakFlex $flexDirection="column">
          <OakHeading
            tag="h3"
            $font={["heading-5"]}
            $mb="spacing-16"
            {...headingProps}
            $color={"black"}
          >
            {title}
          </OakHeading>
          <OakP $font={["body-1"]} $color={"black"} {...paragraphProps}>
            {children}
          </OakP>
        </OakFlex>
      </OakFlex>
    </OakBox>
  );
}
