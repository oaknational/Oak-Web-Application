"use client";

import type { PortableTextComponents } from "@portabletext/react";
import {
  getBreakpoint,
  OakFlex,
  OakFlexProps,
  OakLI,
  OakMaxWidth,
  OakP,
} from "@oaknational/oak-components";
import styled from "styled-components";

import type { NationalCurriculumInsightsRouteData } from "../../helpers/getRouteData";
import { insightsAssetUrl } from "../../helpers/assets";

import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

export type Page = NonNullable<NationalCurriculumInsightsRouteData["page"]>;

export type InsightSection = Page["modules"][number];

export type SectionProps<T extends InsightSection["__typename"]> = {
  section: Extract<InsightSection, { __typename: T }>;
};

export type ContextualSectionProps<T extends InsightSection["__typename"]> =
  SectionProps<T> & {
    data: NationalCurriculumInsightsRouteData;
  };

export const DEFAULT_IMAGE = insightsAssetUrl("hero");

export const insightsTabletMediaQuery = `(min-width: ${getBreakpoint(
  "small",
)}px) and (max-width: ${getBreakpoint("large")}px)`;

export const insightsWideDesktopMediaQuery = `(min-width: ${
  getBreakpoint("large") + 1
}px)`;

export const imageUrl = (
  image: { asset?: { url?: string | null } | null } | null | undefined,
  fallback = DEFAULT_IMAGE,
) => (image?.asset?.url ? getProxiedSanityAssetUrl(image.asset.url) : fallback);

export const imageAlt = (
  image:
    | { altText?: string | null; isPresentational?: boolean | null }
    | null
    | undefined,
) => (image?.isPresentational ? "" : (image?.altText ?? ""));

export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <OakP $font="body-2" $mv="spacing-0">
        {children}
      </OakP>
    ),
  },
};

export const guidancePortableTextComponents: PortableTextComponents = {
  list: {
    bullet: ({ children }) => (
      <OakFlex
        as="ul"
        $flexDirection="column"
        $gap="spacing-12"
        $ma="spacing-0"
        $pl="spacing-24"
      >
        {children}
      </OakFlex>
    ),
  },
  block: {
    normal: ({ children }) => (
      <OakP $font="body-1" $mv="spacing-0">
        {children}
      </OakP>
    ),
  },
  listItem: {
    bullet: ({ children }) => <OakLI $font="body-1">{children}</OakLI>,
  },
};

export const SectionMaxWidth = styled(OakMaxWidth).attrs({
  $maxWidth: "spacing-1280",
  $ph: ["spacing-0", "spacing-0", "spacing-32"],
})``;

export const InsightsContentMaxWidth = (props: OakFlexProps) => (
  <OakFlex $width="100%" $maxWidth="spacing-960" {...props} />
);
