import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakBox,
  OakP,
  OakSpan,
  OakCloudinaryImage,
} from "@oaknational/oak-components";
import styled from "styled-components";
import { ReactNode, useMemo } from "react";

import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";

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

export type WhoAreWeHeaderProps = {
  title: string;
  content: string;
  cloudinaryId: string;
};
export function WhoAreWeHeader({
  title,
  content,
  cloudinaryId,
}: Readonly<WhoAreWeHeaderProps>) {
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
                {title}
              </OakSpan>
            </OakHeading>
            <OakP $font={"heading-light-3"} $color={"text-primary"}>
              {content}
            </OakP>
          </OakFlex>
        </CustomHeaderTextOakGridArea>
        <CustomHeaderImageOakGridArea $colSpan={4} $colStart={9}>
          <OakCloudinaryImage
            cloudinaryId={cloudinaryId}
            alt={"Oak icon"}
            width={384}
            height={523}
            $minWidth={"100%"}
            placeholder="oak"
            sizes={getSizes(["100vw", 1200])}
            role="presentation"
          />
        </CustomHeaderImageOakGridArea>
      </OakGrid>
    </InnerMaxWidth>
  );
}
