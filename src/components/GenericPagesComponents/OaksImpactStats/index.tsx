import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakMaxWidth,
  OakP,
  OakSecondaryButton,
} from "@oaknational/oak-components";
import { Fragment } from "react";

export type OaksImpactStatsProps = {
  headingText: string;
  headingCopy: string;
  link: {
    text: string;
    href: string;
  };
  items: {
    image: {
      alt: string;
      src: string;
    };
    headingText: string;
    body: string;
  }[];
};
export function OaksImpactStats(props: Readonly<OaksImpactStatsProps>) {
  return (
    <OakFlex
      $background={"bg-decorative2-main"}
      $ph={["spacing-32", "spacing-40", "spacing-100"]}
      $pv={"spacing-80"}
    >
      <OakMaxWidth>
        <OakFlex
          $flexDirection={["column", "row", "row"]}
          $gap={["spacing-32", "spacing-16", "spacing-120"]}
        >
          <OakFlex
            $flexDirection={"column"}
            $pr={["spacing-32", "spacing-32", "spacing-0"]}
            $gap={"spacing-32"}
          >
            <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
              <OakHeading
                tag={"h2"}
                $color={"text-primary"}
                $font={"heading-3"}
              >
                {props.headingText}
              </OakHeading>
              <OakP
                $color={"text-primary"}
                $font={["body-2", "body-1", "body-1"]}
              >
                {props.headingCopy}
              </OakP>
            </OakFlex>
            <OakSecondaryButton
              element="a"
              aria-label={`${props.link.text} (opens in a new tab)`}
              href={props.link.href}
              iconName={"external"}
              isTrailingIcon={true}
            >
              {props.link.text}
            </OakSecondaryButton>
          </OakFlex>
          <OakFlex $gap={"spacing-8"}>
            <OakFlex $flexDirection={"column"} $gap={"spacing-40"}>
              {props.items.map((item, index) => {
                return (
                  <Fragment key={index}>
                    {index > 0 && (
                      <OakBox
                        $width="100%"
                        $background="bg-decorative2-very-subdued"
                        $height="spacing-2"
                        $borderRadius="border-radius-s"
                      />
                    )}
                    <OakFlex
                      $flexDirection={["column", "row", "row"]}
                      $borderRadius={"border-radius-m2"}
                      $gap={["spacing-20", "spacing-20", "spacing-32"]}
                    >
                      <OakFlex>
                        <OakImage
                          alt={item.image.alt}
                          $width={"spacing-120"}
                          $height={"spacing-120"}
                          src={item.image.src}
                        />
                      </OakFlex>
                      <OakFlex
                        $flexDirection={"column"}
                        $borderRadius={"border-radius-m2"}
                        $gap={"spacing-4"}
                      >
                        <OakBox
                          $color={"text-primary"}
                          $font={"heading-light-1"}
                        >
                          {item.headingText}
                        </OakBox>
                        <OakP $color={"text-primary"} $font={"body-1"}>
                          {item.body}
                        </OakP>
                      </OakFlex>
                    </OakFlex>
                  </Fragment>
                );
              })}
            </OakFlex>
          </OakFlex>
        </OakFlex>
      </OakMaxWidth>
    </OakFlex>
  );
}
