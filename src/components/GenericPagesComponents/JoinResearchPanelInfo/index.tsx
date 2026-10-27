import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakImage,
  OakLI,
  OakP,
} from "@oaknational/oak-components";
import { PortableTextComponents } from "@portabletext/react";

import { NewGutterMaxWidth } from "../NewGutterMaxWidth";

import { JoinResearchPanelPageBlock } from "@/common-lib/cms-types";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const joinResearchPanelInfoPortableTextComponents: PortableTextComponents = {
  block: {
    normal: (props) => (
      <OakP $font={["body-2", "body-1"]} $mt={["spacing-24", "spacing-32"]}>
        {props.children}
      </OakP>
    ),
  },
  listItem: {
    bullet: (props) => (
      <OakLI $mt="spacing-12" $font={["list-item-2", "list-item-1"]}>
        {props.children}
      </OakLI>
    ),
  },
};

export default function JoinResearchPanelInfo({
  title,
  bodyRaw,
  image,
}: JoinResearchPanelPageBlock<"JoinResearchPanelPageInfo">) {
  return (
    <NewGutterMaxWidth>
      <OakGrid $rg="spacing-32" $pv={["spacing-56", "spacing-80"]}>
        <OakGridArea $colSpan={[12, 12, 6]}>
          <OakFlex $flexGrow={1} $aspectRatio={"4/3"}>
            <OakImage
              src={getProxiedSanityAssetUrl(image.asset?.url) ?? ""}
              alt={image.altText ?? ""}
            />
          </OakFlex>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 12, 6]} $colStart={[0, 0, 8]}>
          <OakFlex $flexDirection="column" $flexGrow={1}>
            <OakHeading tag="h2" $font={["heading-4", "heading-3"]}>
              {title}
            </OakHeading>
            <PortableTextWithDefaults
              value={bodyRaw}
              components={joinResearchPanelInfoPortableTextComponents}
            />
          </OakFlex>
        </OakGridArea>
      </OakGrid>
    </NewGutterMaxWidth>
  );
}
