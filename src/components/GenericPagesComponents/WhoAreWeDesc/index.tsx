import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakBox,
  OakP,
  OakBoxProps,
} from "@oaknational/oak-components";
import { ReactNode, useMemo } from "react";
import styled from "styled-components";

function InnerMaxWidth({ children }: { children: ReactNode }) {
  const styleAttrs = useMemo(() => ({ maxWidth: 1280 + 40 * 2 }), []);
  return (
    <OakBox
      style={styleAttrs}
      $mh={"auto"}
      $ph={["inner-padding-m", "inner-padding-xl3", "inner-padding-xl3"]}
    >
      {children}
    </OakBox>
  );
}

const CustomWeAreItemOakGridArea = styled(OakGridArea)`
  grid-column: span 3;
  @media (max-width: 1040px) {
    grid-column: span 6;
  }
`;

export function WhoAreWeDesc() {
  const items: {
    background: OakBoxProps["$background"];
    title: string;
    text: string;
  }[] = [
    {
      background: "bg-decorative3-main",
      title: "Built for the reality of teaching",
      text: "We get it. Time is tight, classes vary, and only teachers can know pupils best. That’s why our materials are flexible tools to adapt, not scripts to follow: a starting point that supports your expertise and style.",
    },
    {
      background: "bg-decorative4-main",
      title: "Expert created and quality assured",
      text: "Created by subject and curriculum experts, our resources are informed by the best available evidence of what works, aligned to the national curriculum and tested by real teachers.",
    },
    {
      background: "bg-decorative2-main",
      title: "Free, and always will be",
      text: "We’re funded by the Department for Education. No paywalls, package tiers, or hidden costs.",
    },
    {
      background: "bg-decorative5-main",
      title: "Independent and optional",
      text: "Oak is by teachers, for teachers. Our board is publicly appointed, and our partners selected through an open process.",
    },
  ];
  return (
    <InnerMaxWidth>
      <OakFlex
        $flexDirection={"column"}
        $mv="space-between-xxxl"
        $gap={"all-spacing-10"}
      >
        <OakHeading tag="h3" $textAlign={"center"} $font={"heading-3"}>
          We are...
        </OakHeading>
        <OakGrid
          $rg={"all-spacing-4"}
          $cg={"all-spacing-4"}
          $gridAutoRows={"1fr"}
          $mb={"space-between-xxl"}
        >
          {items.map(({ background, title, text }) => {
            return (
              <CustomWeAreItemOakGridArea $colSpan={12}>
                <OakFlex $flexDirection={"column"} $gap={"all-spacing-6"}>
                  <OakBox
                    $height={"all-spacing-18"}
                    $background={background}
                    $borderRadius={"border-radius-m2"}
                  />
                  <OakFlex $gap={"all-spacing-4"} $flexDirection={"column"}>
                    <OakHeading tag="h3" $font={"heading-5"}>
                      {title}
                    </OakHeading>
                    <OakP>{text}</OakP>
                  </OakFlex>
                </OakFlex>
              </CustomWeAreItemOakGridArea>
            );
          })}
        </OakGrid>
      </OakFlex>
    </InnerMaxWidth>
  );
}
