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
}: Readonly<{
  heading: PortableTextBlock[];
  media: Image | Video;
  subheading?: PortableTextBlock[] | null;
  body?: PortableTextBlock[] | null;
  buttonCta?: string | null;
  textStyles?: PortableTextComponents;
  buttonUrl?: string | null;
}>) {
  return (
    <OakFlex
      $maxWidth={"spacing-1280"}
      $flexDirection={["column", "row"]}
      $width={"100%"}
      $gap={"spacing-32"}
      $borderRadius={"border-radius-xl"}
      $pv={["spacing-56"]}
      $ph={["spacing-48"]}
    >
      <OakFlex
        $flexDirection={"column"}
        $flexGrow={1}
        $flexShrink={1}
        $flexBasis={0}
        $justifyContent={"center"}
        $gap={["spacing-24", "spacing-48"]}
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
