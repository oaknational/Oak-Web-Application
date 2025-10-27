import { OakBox, OakFlex, OakPrimaryButton } from "@oaknational/oak-components";
import { PortableTextBlock, PortableTextComponents } from "@portabletext/react";

import { PortableTextWithDefaults } from "../../SharedComponents/PortableText";
import CMSImage from "../../SharedComponents/CMSImage";

import { Image, Video } from "@/common-lib/cms-types";

export function CampaignPromoBanner({
  textStyles,
  media,
  heading,
  subheading,
  body,
  buttonCta,
  buttonUrl,
}: {
  heading: PortableTextBlock[];
  media: Image | Video;
  subheading?: PortableTextBlock[] | null;
  body?: PortableTextBlock[] | null;
  buttonCta?: string | null;
  textStyles?: PortableTextComponents;
  buttonUrl?: string | null;
}) {
  return (
    <OakFlex
      $maxWidth={"all-spacing-24"}
      $flexDirection={["column", "row"]}
      $width={"100%"}
      $gap={"space-between-m2"}
      $borderRadius={"border-radius-xl"}
      $pv={["inner-padding-xl5"]}
      $ph={["inner-padding-xl4"]}
    >
      <OakFlex
        $flexDirection={"column"}
        $flexGrow={1}
        $flexShrink={1}
        $flexBasis={0}
        $justifyContent={"center"}
        $gap={["space-between-m", "space-between-l"]}
      >
        <PortableTextWithDefaults value={heading} components={textStyles} />
        {subheading && (
          <PortableTextWithDefaults
            value={subheading}
            components={textStyles}
          />
        )}
        {body && (
          <OakBox>
            <PortableTextWithDefaults value={body} components={textStyles} />
          </OakBox>
        )}
        {buttonCta && buttonUrl && (
          <OakPrimaryButton
            element="a"
            isTrailingIcon={true}
            href={buttonUrl}
            iconName="arrow-right"
          >
            {buttonCta}
          </OakPrimaryButton>
        )}
      </OakFlex>
      <OakFlex
        $width={"100%"}
        $minWidth={0}
        $flexGrow={1}
        $flexShrink={1}
        $flexBasis={0}
      >
        <CMSImage $objectFit={"contain"} image={media} />
      </OakFlex>
    </OakFlex>
  );
}
