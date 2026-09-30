"use client";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
  OakScreenReader,
  OakSecondaryButton,
} from "@oaknational/oak-components";

import { mcpFeedback } from "@/app/(core)/ai-plugin/mcpContent";

export const McpFeedbackPanel = () => (
  <OakBox
    $background="bg-decorative3-very-subdued"
    $color="text-primary"
    $pv={["spacing-48", "spacing-48", "spacing-64"]}
    $ph={["spacing-20", "spacing-40", "spacing-32"]}
  >
    <OakFlex
      as="section"
      aria-labelledby="give-feedback"
      $maxWidth="spacing-1280"
      $ma="auto"
      $flexDirection={["column", "column", "row"]}
      $alignItems="center"
      $gap="spacing-72"
    >
      <OakFlex $flexDirection="column" $gap="spacing-24" $flexGrow={1}>
        <OakHeading id="give-feedback" tag="h2" $font="heading-4">
          {mcpFeedback.title}
        </OakHeading>
        <OakP $font="body-2">{mcpFeedback.body}</OakP>
        <OakFlex>
          <OakSecondaryButton
            element="a"
            href={mcpFeedback.ctaHref}
            target="_blank"
            rel="noreferrer"
            iconName="external"
            isTrailingIcon
          >
            {mcpFeedback.ctaLabel}
            <OakScreenReader> (opens in a new tab)</OakScreenReader>
          </OakSecondaryButton>
        </OakFlex>
      </OakFlex>
      <OakImage
        src="/images/mcp/give-feedback.svg"
        alt=""
        aria-hidden="true"
        width={446}
        height={215}
        placeholder="empty"
        $width={["100%", "100%", "auto"]}
        $minWidth={["spacing-0", "spacing-0", "spacing-480"]}
      />
    </OakFlex>
  </OakBox>
);
