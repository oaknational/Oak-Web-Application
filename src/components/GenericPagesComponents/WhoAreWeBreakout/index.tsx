import { OakFlex, OakImage, OakP } from "@oaknational/oak-components";
import styled from "styled-components";

import { Image } from "@/common-lib/cms-types";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

const CustomFlex = styled(OakFlex)`
  flex-direction: row;

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

export type WhoAreWeBreakoutProps = {
  content: string;
  image: Image;
};
export function WhoAreWeBreakout({
  content,
  image,
}: Readonly<WhoAreWeBreakoutProps>) {
  return (
    <CustomFlex $background={"bg-decorative1-main"} $mh={"auto"}>
      <OakFlex
        $flexGrow={1}
        $background={"bg-decorative1-subdued"}
        $minWidth={["100%", "spacing-640", "spacing-640"]}
        $aspectRatio={"4/3"}
      >
        <OakImage
          $objectFit={"cover"}
          src={getProxiedSanityAssetUrl(image.asset?.url ?? "")}
          alt={image.altText ?? ""}
        />
      </OakFlex>
      <OakFlex
        $flexShrink={1}
        $ph={["spacing-20", "spacing-40", "spacing-80"]}
        $pv={["spacing-56", "spacing-40", "spacing-40"]}
        $alignItems={"center"}
      >
        <OakP $font={["heading-light-7", "heading-light-5"]}>{content}</OakP>
      </OakFlex>
    </CustomFlex>
  );
}
