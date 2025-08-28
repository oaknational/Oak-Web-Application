import { OakBox, OakFlex, OakPrimaryButton } from "@oaknational/oak-components";
import { PortableTextBlock } from "@portabletext/react";

import { PortableTextWithDefaults } from "../../SharedComponents/PortableText";
import CMSImage from "../../SharedComponents/CMSImage";

import { Image, Video } from "@/common-lib/cms-types";
import { textStyles } from "@/pages/campaigns/[campaignSlug]";

export function CampaignPromoBanner({
  media,
  heading,
  subheading,
  body,
  buttonCta,
}: {
  heading: PortableTextBlock[];
  media: Image | Video;
  subheading?: PortableTextBlock[] | null;
  body?: PortableTextBlock[] | null;
  buttonCta?: string | null;
}) {
  return (
    <OakFlex
      $maxWidth={"all-spacing-24"}
      $flexDirection={["column", "row"]}
      $width={"100%"}
      $gap={"space-between-m2"}
      $borderRadius={"border-radius-xl"}
      $pv={["inner-padding-xl5"]}
      $ph={["inner-padding-xl"]}
    >
      <OakFlex
        $flexDirection={"column"}
        $flexGrow={1}
        $flexShrink={1}
        $flexBasis={0}
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
        {buttonCta && (
          <OakPrimaryButton isTrailingIcon={true} iconName="arrow-right">
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
