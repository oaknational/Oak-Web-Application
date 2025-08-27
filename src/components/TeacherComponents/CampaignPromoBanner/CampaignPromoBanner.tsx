import { OakBox, OakFlex, OakPrimaryButton } from "@oaknational/oak-components";
import { PortableTextBlock, PortableTextComponents } from "@portabletext/react";

import { PortableTextWithDefaults } from "../../SharedComponents/PortableText";
import CMSImage from "../../SharedComponents/CMSImage";

import { Image, Video } from "@/common-lib/cms-types";

export type Page = "home" | "campaign";
interface TextBlockWithComponent {
  content: PortableTextBlock;
  component: PortableTextComponents;
}
export function CampaignPromoBanner({
  media,
  heading,
  subheading,
  body,
  cta,
}: {
  page: Page;
  heading: TextBlockWithComponent;
  media: Image | Video;
  subheading?: TextBlockWithComponent;
  body?: TextBlockWithComponent;
  cta?: string;
}) {
  return (
    <OakFlex
      $flexDirection={["column", "row"]}
      $width={"100%"}
      $gap={"space-between-m2"}
      $borderRadius={"border-radius-xl"}
      $pv={["inner-padding-xl5"]}
      $ph={["inner-padding-xl"]}
    >
      <OakFlex
        $flexDirection={"column"}
        $gap={["space-between-m", "space-between-l"]}
      >
        <PortableTextWithDefaults
          value={heading.content}
          components={heading.component}
        />
        {subheading && (
          <PortableTextWithDefaults
            value={subheading.content}
            components={subheading.component}
          />
        )}
        {body && (
          <OakBox>
            <PortableTextWithDefaults
              value={body.content}
              components={body.component}
            />
          </OakBox>
        )}
        {cta && <OakPrimaryButton />}
      </OakFlex>
      <OakBox>
        <CMSImage image={media} />
      </OakBox>
    </OakFlex>
  );
}
