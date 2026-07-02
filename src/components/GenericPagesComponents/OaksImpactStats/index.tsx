import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
  OakPrimaryButton,
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
export function OaksImpactStats(props: OaksImpactStatsProps) {
  return (
    <OakFlex
      $alignItems={"flex-start"}
      $flexDirection={["column", "row", "row"]}
      $background={"bg-decorative2-main"}
      $ph={["spacing-32", "spacing-40", "spacing-100"]}
      $pv={"spacing-80"}
      $gap={["spacing-120", "spacing-16"]}
    >
      <OakFlex
        $alignItems={"flex-start"}
        $flexDirection={"column"}
        $pr={["spacing-32", "spacing-32", "spacing-0"]}
        $gap={"spacing-32"}
      >
        <OakFlex
          $alignItems={"flex-start"}
          $flexDirection={"column"}
          $gap={"spacing-24"}
        >
          <OakHeading tag={"h2"} $color={"text-primary"} $font={"heading-3"}>
            {props.headingText}
          </OakHeading>
          <OakP $color={"text-primary"} $font={["body-2", "body-1", "body-1"]}>
            {props.headingCopy}
          </OakP>
        </OakFlex>
        <OakPrimaryButton
          element="a"
          href={props.link.href}
          iconName={"external"}
        >
          {props.link.text}
        </OakPrimaryButton>
      </OakFlex>
      <OakFlex $alignItems={"flex-start"} $gap={"spacing-8"}>
        {props.items.map((item, index) => {
          return (
            <Fragment key={index}>
              <OakFlex
                $alignItems={"flex-start"}
                $flexDirection={["column", "row", "row"]}
                $borderRadius={"border-radius-m2"}
                $gap={["spacing-20", "spacing-20", "spacing-32"]}
              >
                <OakFlex $alignItems={"flex-start"}>
                  <OakImage
                    alt={item.image.alt}
                    $width={"spacing-120"}
                    $height={"spacing-120"}
                    src={item.image.src}
                  />
                </OakFlex>
                <OakFlex
                  $alignItems={"flex-start"}
                  $flexDirection={"column"}
                  $borderRadius={"border-radius-m2"}
                  $gap={"spacing-4"}
                >
                  <OakBox $color={"text-primary"} $font={"heading-light-1"}>
                    {item.headingText}
                  </OakBox>
                  <OakP $color={"text-primary"} $font={"body-1"}>
                    {item.body}
                  </OakP>
                </OakFlex>
              </OakFlex>
              <OakBox
                $width="100%"
                $background="bg-decorative2-very-subdued"
                $height="spacing-2"
                $borderRadius="border-radius-s"
              />
            </Fragment>
          );
        })}
      </OakFlex>
    </OakFlex>
  );
}
