"use client";
import {
  OakFlex,
  OakImage,
  OakScreenReader,
  OakSecondaryButton,
} from "@oaknational/oak-components";

/**
 * "Try in <assistant>" call to action.
 *
 * The provider logo is decorative — the button already carries the provider
 * name in its label — so it is given an empty alt.
 */
export const McpTryButton = ({
  label,
  href,
  logoSrc,
}: Readonly<{ label: string; href: string; logoSrc: string }>) => (
  <OakSecondaryButton
    element="a"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    <OakFlex $alignItems="center" $gap="spacing-4">
      <OakImage
        src={logoSrc}
        alt=""
        aria-hidden="true"
        width={20}
        height={20}
        placeholder="empty"
        $maxWidth="spacing-20"
      />
      {label}
      <OakScreenReader> (opens in a new tab)</OakScreenReader>
    </OakFlex>
  </OakSecondaryButton>
);
