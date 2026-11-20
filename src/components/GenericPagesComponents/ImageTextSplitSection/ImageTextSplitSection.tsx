import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakIcon,
  OakImage,
  OakLI,
  OakLink,
  OakOL,
  OakP,
  parseSpacing,
} from "@oaknational/oak-components";
import { PortableTextComponents } from "@portabletext/react";
import styled from "styled-components";

import { NewGutterMaxWidth } from "../NewGutterMaxWidth";

import { Image, PortableTextJSON } from "@/common-lib/cms-types";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const StyledOL = styled(OakOL)`
  li {
    margin-top: ${parseSpacing("spacing-12")};
  }
`;

const imageTextSplitSectionPortableTextComponents: PortableTextComponents = {
  block: {
    normal: (props) => (
      <OakP $font={["body-2", "body-1"]} $mt={["spacing-24", "spacing-32"]}>
        {props.children}
      </OakP>
    ),
  },
  list: {
    number: (props) => <StyledOL>{props.children}</StyledOL>,
  },
  listItem: {
    bullet: (props) => (
      <OakLI $mt="spacing-12" $font={["list-item-2", "list-item-1"]}>
        {props.children}
      </OakLI>
    ),
    number: (props) => (
      <OakLI $font={["list-item-2", "list-item-1"]}>{props.children}</OakLI>
    ),
  },
  marks: {
    link: (props) => {
      const href = getProxiedSanityAssetUrl(props.value?.href);
      if (!href) {
        return null;
      }

      return (
        <OakLink
          href={href}
          variant="secondary"
          $font={["body-2-bold", "body-1-bold"]}
        >
          {props.children}
          <OakIcon
            iconName="external"
            $display="inline-block"
            $verticalAlign="text-top"
            $ml="spacing-8"
            $width="spacing-24"
            $height="spacing-24"
          />
        </OakLink>
      );
    },
  },
};

export type ImageTextSplitSectionProps = {
  title: string;
  bodyRaw: PortableTextJSON;
  image: Image;
  imagePosition?: "left" | "right";
};

export default function ImageTextSplitSection({
  title,
  bodyRaw,
  imagePosition = "left",
  image,
}: Readonly<ImageTextSplitSectionProps>) {
  const isImageLeftPositioned = imagePosition === "left";

  return (
    <NewGutterMaxWidth>
      <OakGrid $rg="spacing-32" $pv={["spacing-56", "spacing-80"]}>
        <OakGridArea
          $colSpan={[12, 10, 6]}
          $colStart={[1, 2, isImageLeftPositioned ? 1 : 7]}
          $rowStart={[1, 1, 1]}
        >
          <OakFlex
            $flexGrow={1}
            $aspectRatio={"4/3"}
            $borderRadius="border-radius-m2"
            $overflow="hidden"
          >
            <OakImage
              $objectFit="cover"
              src={getProxiedSanityAssetUrl(image.asset?.url) ?? ""}
              alt={image.altText ?? ""}
            />
          </OakFlex>
        </OakGridArea>
        <OakGridArea
          $colSpan={[12, 10, 5]}
          $colStart={[1, 2, isImageLeftPositioned ? 8 : 1]}
          $rowStart={[2, 2, 1]}
        >
          <OakFlex $flexDirection="column" $flexGrow={1}>
            <OakHeading tag="h2" $font={["heading-4", "heading-3"]}>
              {title}
            </OakHeading>
            <PortableTextWithDefaults
              value={bodyRaw}
              components={imageTextSplitSectionPortableTextComponents}
            />
          </OakFlex>
        </OakGridArea>
      </OakGrid>
    </NewGutterMaxWidth>
  );
}
