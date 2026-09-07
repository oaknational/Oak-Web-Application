"use client";
import {
  OakFlex,
  OakIcon,
  OakScreenReader,
  OakSecondaryButton,
} from "@oaknational/oak-components";

/**
 * "Try in <assistant>" call to action.
 *
 * Figma shows the provider's own mark here, but that is a third-party trademark
 * and this repo is public and MIT licensed, so a neutral Oak icon stands in
 * until Oak has permission and the mark can be served from Cloudinary. The
 * button already names the provider, so the icon is decorative either way.
 */
export const McpTryButton = ({
  label,
  href,
}: Readonly<{ label: string; href: string }>) => (
  <OakSecondaryButton element="a" href={href} target="_blank" rel="noreferrer">
    <OakFlex $alignItems="center" $gap="spacing-4">
      <OakIcon
        iconName="ai"
        iconWidth="spacing-20"
        iconHeight="spacing-20"
        alt=""
      />
      {label}
      <OakScreenReader> (opens in a new tab)</OakScreenReader>
    </OakFlex>
  </OakSecondaryButton>
);
