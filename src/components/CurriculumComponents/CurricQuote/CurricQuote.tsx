import {
  OakBox,
  OakFlex,
  OakHeading,
  OakP,
  OakUiRoleToken,
  OakHeadingProps,
  OakPProps,
} from "@oaknational/oak-components";

export type CurricQuoteProps = {
  title: string;
  children: string;
  backgroundColor?: OakUiRoleToken;
  barColor?: OakUiRoleToken;
  headingProps?: OakHeadingProps;
  paragraphProps?: OakPProps;
};

export default function CurricQuote({
  title,
  children,
  backgroundColor = "transparent",
  barColor = "bg-decorative1-very-subdued",
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
            $color={"text-primary"}
          >
            {title}
          </OakHeading>
          <OakP $font={["body-1"]} $color={"text-primary"} {...paragraphProps}>
            {children}
          </OakP>
        </OakFlex>
      </OakFlex>
    </OakBox>
  );
}
