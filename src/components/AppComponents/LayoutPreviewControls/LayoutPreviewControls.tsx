"use client";

import { FC } from "react";
import {
  OakSpan,
  OakFlex,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import { usePathname } from "next/navigation";

/**
 * A small toast-like banner in the bottom left corner to inform
 * users they're viewing the site in preview mode
 */
const LayoutPreviewControls: FC = () => {
  const pathname = usePathname();
  const exitUrl = `/api/preview${pathname}?disable=true`;

  return (
    <OakFlex
      $position="fixed"
      $bottom="spacing-20"
      $left="spacing-20"
      $pa="spacing-4"
      $alignItems="center"
      $color="text-primary"
      $background="bg-primary"
    >
      <OakSpan $mr="spacing-24">Preview mode enabled</OakSpan>
      <OakTertiaryButton element="a" href={exitUrl}>
        Exit preview
      </OakTertiaryButton>
    </OakFlex>
  );
};

export default LayoutPreviewControls;
