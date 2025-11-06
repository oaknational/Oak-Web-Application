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

const COLORS: OakBoxProps["$background"][] = [
  "bg-decorative3-main",
  "bg-decorative4-main",
  "bg-decorative2-main",
  "bg-decorative5-main",
] as const;

type WhoAreWeDescProps = {
  title: string;
  items: {
    title: string;
    text: string;
  }[];
};
export function WhoAreWeDesc({ title, items }: Readonly<WhoAreWeDescProps>) {
  const itemsMapped = useMemo(() => {
    return items.map((item, itemIndex) => {
      return {
        ...item,
        background: COLORS[itemIndex % COLORS.length],
      };
    });
  }, [items]);

  return (
    <InnerMaxWidth>
      <OakFlex
        $flexDirection={"column"}
        $mv="space-between-xxxl"
        $gap={"all-spacing-10"}
      >
        <OakHeading tag="h3" $textAlign={"center"} $font={"heading-3"}>
          {title}
        </OakHeading>
        <OakGrid
          $rg={"all-spacing-4"}
          $cg={"all-spacing-4"}
          $gridAutoRows={"1fr"}
          $mb={"space-between-xxl"}
        >
          {itemsMapped.map(({ background, title, text }) => {
            return (
              <CustomWeAreItemOakGridArea key={title} $colSpan={12}>
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
