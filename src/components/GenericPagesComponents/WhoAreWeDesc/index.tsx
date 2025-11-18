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
    <OakBox $maxWidth={"spacing-1280"} $mh={"auto"}>
      {children}
    </OakBox>
  );
}

const CustomWeAreItemOakGridArea = styled(OakGridArea)`
  grid-column: span 3;

  @media (max-width: 1040px) {
    grid-column: span 6;
  }

  @media (max-width: 749px) {
    grid-column: span 12;
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
        $pv={["spacing-56", "spacing-80", "spacing-80"]}
        $ph={["spacing-16", "spacing-16", "spacing-0"]}
        $gap={["spacing-32", "spacing-56", "spacing-56"]}
      >
        <OakHeading
          tag="h2"
          $textAlign={["left", "center", "center"]}
          $font={["heading-5", "heading-3", "heading-3"]}
          $color="text-primary"
        >
          {title}
        </OakHeading>
        <OakGrid $rg={"spacing-16"} $cg={"spacing-16"}>
          {itemsMapped.map(
            ({ background, title, text, imageUrl, imageAlt }) => {
              return (
                <CustomWeAreItemOakGridArea
                  key={title}
                  data-testid="who-we-are-desc-item"
                  $colSpan={12}
                >
                  <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
                    <OakBox
                      $height={"spacing-240"}
                      $background={background}
                      $borderRadius={"border-radius-m2"}
                      $pv={"spacing-24"}
                      $ph={"spacing-64"}
                    >
                      <OakImage
                        $objectFit={"contain"}
                        src={imageUrl}
                        alt={imageAlt}
                        $height={"100%"}
                      />
                    </OakBox>
                    <OakFlex $gap={"spacing-16"} $flexDirection={"column"}>
                      <OakHeading
                        tag="h3"
                        $font={["heading-6", "heading-5", "heading-5"]}
                        $color="text-primary"
                      >
                        {title}
                      </OakHeading>
                      <OakP
                        $font={["body-2", "body-1", "body-1"]}
                        $color="text-primary"
                      >
                        {text}
                      </OakP>
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
