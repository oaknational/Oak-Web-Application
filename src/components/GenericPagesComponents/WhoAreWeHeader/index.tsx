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
  grid-column: span 6;
  @media (max-width: 920px) {
    grid-column: span 12;
  }
`;

const CustomHeaderImageOakGridArea = styled(OakGridArea)`
  display: block;
  @media (max-width: 920px) {
    display: none;
  }
`;

function InnerMaxWidth({ children }: { children: ReactNode }) {
  const styleAttrs = useMemo(() => ({ maxWidth: 1280 + 40 * 2 }), []);

  return (
    <OakBox
      style={styleAttrs}
      $mh={"auto"}
      $ph={["spacing-16", "spacing-16", "spacing-16"]}
    >
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
      <OakGrid $cg="spacing-16" $rg="spacing-16" $pv={"spacing-72"}>
        <CustomHeaderTextOakGridArea $colSpan={12} $justifyContent={"center"}>
          <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
            <OakHeading
              tag="h1"
              $font={["heading-4", "heading-2", "heading-2"]}
            >
              <OakSpan $background="mint" $ph={"spacing-4"}>
                {title}
              </OakSpan>
            </OakHeading>
            <OakP
              $font={["heading-light-5", "heading-light-3", "heading-light-3"]}
              $color={"text-primary"}
            >
              {content}
            </OakP>
          </OakFlex>
        </CustomHeaderTextOakGridArea>
        <CustomHeaderImageOakGridArea $colSpan={4} $colStart={9}>
          <OakBox $width={"spacing-360"} $height={"spacing-360"}>
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
