"use client";
import { OakBox, OakFlex, OakIcon, OakP } from "@oaknational/oak-components";

/**
 * Stands in for the intro/how-to video.
 *
 * The Figma source notes the video will not be ready for initial launch, so
 * this reserves its slot at the designed size. Replace with the real player
 * (see `VideoPlayer` in SharedComponents) once the asset exists.
 */
export const McpVideoPlaceholder = () => (
  <OakBox
    $ba="border-solid-xl"
    $borderColor="border-primary"
    $background="bg-neutral"
    $minHeight={["spacing-240", "spacing-480"]}
    $width="100%"
    role="img"
    aria-label="Placeholder for the Oak Curriculum MCP introduction video"
  >
    <OakFlex
      $flexDirection="column"
      $alignItems="center"
      $justifyContent="center"
      $gap="spacing-12"
      $minHeight={["spacing-240", "spacing-480"]}
      $width="100%"
    >
      <OakIcon
        iconName="video"
        iconWidth="spacing-48"
        iconHeight="spacing-48"
        alt=""
      />
      <OakP $font="body-2-bold">Video coming soon</OakP>
      <OakP $font="body-3" $color="text-subdued">
        An introduction to using Oak Curriculum MCP
      </OakP>
    </OakFlex>
  </OakBox>
);
