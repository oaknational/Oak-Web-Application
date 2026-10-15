"use client";
import {
  OakFlex,
  OakIcon,
  OakScreenReader,
  OakSecondaryButton,
  OakSmallSecondaryButton,
} from "@oaknational/oak-components";

export const McpTryButton = ({
  label,
  href,
  small = false,
}: Readonly<{ label: string; href: string; small?: boolean }>) => {
  const Button = small ? OakSmallSecondaryButton : OakSecondaryButton;

  return (
    <Button element="a" href={href} target="_blank" rel="noreferrer">
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
    </Button>
  );
};
