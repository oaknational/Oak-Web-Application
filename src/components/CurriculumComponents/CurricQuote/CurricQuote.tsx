import {
  OakBox,
  OakFlex,
  OakHeading,
  OakP,
  OakUiRoleToken,
  OakHeadingProps,
  OakPProps,
} from "@oaknational/oak-components";
import { PortableTextBlockComponent } from "@portabletext/react";

import { PortableTextJSON } from "@/common-lib/cms-types";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const OakPStyled: PortableTextBlockComponent = (props) => {
  return <OakP $font={"body-1"}>{props.children}</OakP>;
};

export type CurricQuoteProps = {
  title: string;
  text: PortableTextJSON | string | undefined;
  backgroundColor?: OakUiRoleToken;
  barColor?: OakUiRoleToken;
  headingProps?: OakHeadingProps;
  paragraphProps?: OakPProps;
};

export default function CurricQuote({
  title,
  text,
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
          {typeof text === "string" ? (
            <OakP
              $font={["body-1"]}
              $color={"text-primary"}
              {...paragraphProps}
            >
              {text}
            </OakP>
          ) : (
            <PortableTextWithDefaults
              value={text}
              components={{
                block: {
                  normal: OakPStyled,
                },
              }}
            />
          )}
        </OakFlex>
      </OakFlex>
    </OakBox>
  );
}
