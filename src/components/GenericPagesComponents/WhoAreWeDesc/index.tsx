import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakBox,
  OakP,
  OakBoxProps,
  OakImage,
} from "@oaknational/oak-components";
import { ReactNode, useMemo } from "react";
import styled from "styled-components";

function InnerMaxWidth({ children }: { children: ReactNode }) {
  return (
    <OakBox $maxWidth={"all-spacing-24"} $mh={"auto"}>
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
    imageUrl: string;
    imageAlt: string;
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
        $pv={["inner-padding-xl5", "inner-padding-xl8", "inner-padding-xl8"]}
        $ph={["inner-padding-m", "inner-padding-m", "inner-padding-none"]}
        $gap={["space-between-m2", "all-spacing-10", "all-spacing-10"]}
      >
        <OakHeading
          tag="h2"
          $textAlign={["left", "center", "center"]}
          $font={["heading-5", "heading-3", "heading-3"]}
        >
          {title}
        </OakHeading>
        <OakGrid
          $rg={"all-spacing-4"}
          $cg={"all-spacing-4"}
          $gridAutoRows={"1fr"}
          $mb={"space-between-xxl"}
        >
          {itemsMapped.map(
            ({ background, title, text, imageUrl, imageAlt }) => {
              return (
                <CustomWeAreItemOakGridArea
                  key={title}
                  data-testid="who-we-are-desc-item"
                  $colSpan={12}
                >
                  <OakFlex $flexDirection={"column"} $gap={"all-spacing-6"}>
                    <OakBox
                      $height={"all-spacing-18"}
                      $background={background}
                      $borderRadius={"border-radius-m2"}
                      $pa={"inner-padding-m"}
                    >
                      <OakImage
                        $objectFit={"contain"}
                        src={imageUrl}
                        alt={imageAlt}
                        $height={"100%"}
                      />
                    </OakBox>
                    <OakFlex $gap={"all-spacing-4"} $flexDirection={"column"}>
                      <OakHeading
                        tag="h3"
                        $font={["heading-6", "heading-5", "heading-5"]}
                      >
                        {title}
                      </OakHeading>
                      <OakP $font={["body-2", "body-1", "body-1"]}>{text}</OakP>
                    </OakFlex>
                  </OakFlex>
                </CustomWeAreItemOakGridArea>
              );
            },
          )}
        </OakGrid>
      </OakFlex>
    </InnerMaxWidth>
  );
}
