import { FC } from "react";
import { useRouter } from "next/router";
import {
  OakSpan,
  OakFlex,
  OakTertiaryButton,
} from "@oaknational/oak-components";

/**
 * A small toast-like banner in the bottom left corner to inform
 * users they're viewing the site in preview mode
 */
const LayoutPreviewControls: FC = () => {
  const router = useRouter();

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
      <OakTertiaryButton
        element="a"
        href={`/api/preview${router.asPath}?disable=true`}
      >
        Exit preview
      </OakTertiaryButton>
    </OakFlex>
  );
};

export default LayoutPreviewControls;
