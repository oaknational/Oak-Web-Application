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
}: CurricQuoteProps) {
  return (
    <OakBox $background={backgroundColor}>
      <OakFlex
        $flexDirection="row"
        $pr={"inner-padding-xl"}
        $columnGap="space-between-m"
      >
        {barColor !== "transparent" && (
          <OakFlex
            data-testid="decorative-bar"
            $width="all-spacing-2"
            $background={barColor}
            $flexShrink={0}
          />
        )}
        <OakFlex $flexDirection="column">
          <OakHeading
            tag="h3"
            $font={["heading-5"]}
            $mb="space-between-s"
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
