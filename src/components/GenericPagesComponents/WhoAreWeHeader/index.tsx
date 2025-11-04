import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakBox,
  OakP,
  OakSpan,
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
      $ph={["inner-padding-m", "inner-padding-xl3", "inner-padding-xl3"]}
    >
      {children}
    </OakBox>
  );
}

export function WhoAreWeHeader() {
  return (
    <InnerMaxWidth>
      <OakGrid
        $cg="space-between-s"
        $rg="space-between-s"
        $pv={"inner-padding-xl7"}
      >
        <CustomHeaderTextOakGridArea $colSpan={12}>
          <OakFlex $flexDirection={"column"} $gap={"all-spacing-6"}>
            <OakHeading tag="h1" $font={"heading-2"}>
              <OakSpan $background="mint" $ph={"inner-padding-ssx"}>
                About Oak
              </OakSpan>
            </OakHeading>
            <OakP $font={"heading-light-3"}>
              We're here to support and inspire teachers to deliver great
              teaching, so every pupil benefits
            </OakP>
          </OakFlex>
        </CustomHeaderTextOakGridArea>
        <CustomHeaderImageOakGridArea $colSpan={4} $colStart={9}>
          <OakBox
            $background={"mint30"}
            $borderStyle={"solid"}
            $borderColor={"mint110"}
            $height={"all-spacing-18"}
          />
        </CustomHeaderImageOakGridArea>
      </OakGrid>
    </InnerMaxWidth>
  );
}
