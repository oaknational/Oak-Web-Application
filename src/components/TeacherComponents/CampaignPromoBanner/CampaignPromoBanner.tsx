import {
  OakBox,
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { PortableTextBlock, PortableTextComponents } from "@portabletext/react";

import { PortableTextWithDefaults } from "../../SharedComponents/PortableText";
import CMSImage from "../../SharedComponents/CMSImage";

import { Image, Video } from "@/common-lib/cms-types";

export type Page = "home" | "campaign";

const h2: PortableTextComponents = {
  block: {
    normal: (props) => {
      return (
        <OakHeading $font={["heading-5", "heading-4", "heading-2"]} tag="h2">
          {props.children}
        </OakHeading>
      );
    },
  },
};

const h3: PortableTextComponents = {
  block: {
    normal: (props) => {
      return (
        <OakHeading $font={["heading-light-5"]} tag="h3">
          {props.children}
        </OakHeading>
      );
    },
  },
};

const p: PortableTextComponents = {
  block: {
    normal: (props) => {
      return <OakP>{props.children}</OakP>;
    },
  },
};

export function CampaignPromoBanner({
  media,
  heading,
  subheading,
  body,
  buttonCta,
}: {
  page: Page;
  heading: PortableTextBlock;
  media: Image | Video;
  subheading?: PortableTextBlock;
  body?: PortableTextBlock;
  buttonCta?: string;
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
        <PortableTextWithDefaults value={heading} components={h2} />
        {subheading && (
          <PortableTextWithDefaults value={subheading} components={h3} />
        )}
        {body && (
          <OakBox>
            <PortableTextWithDefaults value={body} components={p} />
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
