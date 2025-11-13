import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakBox,
  OakP,
  OakSpan,
  OakImage,
} from "@oaknational/oak-components";
import styled from "styled-components";
import { ReactNode, useMemo } from "react";

const CustomHeaderTextOakGridArea = styled(OakGridArea)`
  grid-column: span 12;

  @media (min-width: 920px) {
    grid-column: span 8;
  }

  @media (min-width: 980px) {
    grid-column: span 10;
  }

  @media (min-width: 1056px) {
    grid-column: span 10;
  }

  @media (min-width: 1279px) {
    grid-column: span 8;
  }
`;

const CustomHeaderImageOakGridArea = styled(OakGridArea)`
  display: none;

  @media (min-width: 921px) and (max-width: 1056px) {
    display: block;
    grid-column: span 2;
    grid-column-start: 12;
  }

  @media (min-width: 1057px) {
    display: block;
    grid-column: span 3;
    grid-column-start: 12;
  }
`;

function InnerMaxWidth({ children }: Readonly<{ children: ReactNode }>) {
  const styleAttrs = useMemo(() => ({ maxWidth: 1280 + 40 * 2 }), []);

  return (
    <OakBox style={styleAttrs} $mh={"auto"} $ph={"inner-padding-m"}>
      {children}
    </OakBox>
  );
}

export type WhoAreWeHeaderProps = {
  title: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
};
export function WhoAreWeHeader({
  title,
  content,
  imageUrl,
  imageAlt,
}: Readonly<WhoAreWeHeaderProps>) {
  return (
    <InnerMaxWidth>
      <OakGrid
        $cg="space-between-s"
        $rg="space-between-s"
        $pt={["inner-padding-xl5", "inner-padding-xl8", "inner-padding-xl5"]}
        $pb={["inner-padding-xl5", "inner-padding-xl8", "inner-padding-xl7"]}
      >
        <CustomHeaderTextOakGridArea $colSpan={12} $justifyContent={"center"}>
          <OakFlex $flexDirection={"column"} $gap={"all-spacing-6"}>
            <OakHeading tag="h1" $font={["heading-4", "heading-2"]}>
              <OakSpan $background="mint" $ph={"inner-padding-ssx"}>
                {title}
              </OakSpan>
            </OakHeading>
            <OakP
              $font={["heading-light-5", "heading-light-3"]}
              $color={"text-primary"}
            >
              {content}
            </OakP>
          </OakFlex>
        </CustomHeaderTextOakGridArea>
        <CustomHeaderImageOakGridArea $colSpan={2}>
          <OakBox
            $width={["all-spacing-19", "all-spacing-19", "all-spacing-20"]}
            $height={"all-spacing-20"}
          >
            <OakImage
              alt={imageAlt}
              src={imageUrl}
              $objectFit={"contain"}
              $height={"100%"}
            />
          </OakBox>
        </CustomHeaderImageOakGridArea>
      </OakGrid>
    </InnerMaxWidth>
  );
}
