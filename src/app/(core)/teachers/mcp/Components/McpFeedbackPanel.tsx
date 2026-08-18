"use client";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
  OakSecondaryButton,
} from "@oaknational/oak-components";

import { mcpFeedback } from "@/app/(core)/teachers/mcp/mcpContent";

export const McpFeedbackPanel = () => (
  <OakBox
    $background="bg-decorative3-very-subdued"
    $pv={["spacing-32", "spacing-64"]}
    $ph={["spacing-16", "spacing-32"]}
  >
    <OakFlex
      as="section"
      aria-labelledby="give-feedback"
      $maxWidth="spacing-1280"
      $ma="auto"
      $flexDirection={["column", "column", "row"]}
      $alignItems="center"
      $gap={["spacing-32", "spacing-72"]}
    >
      <OakFlex $flexDirection="column" $gap="spacing-24" $flexGrow={1}>
        <OakHeading
          id="give-feedback"
          tag="h2"
          $font={["heading-5", "heading-4"]}
        >
          {mcpFeedback.title}
        </OakHeading>
        <OakP $font="body-2">{mcpFeedback.body}</OakP>
        <OakFlex>
          {/* A mailto: link, so no new-tab target or announcement here. */}
          <OakSecondaryButton
            element="a"
            href={mcpFeedback.ctaHref}
            iconName="arrow-right"
            isTrailingIcon
          >
            {mcpFeedback.ctaLabel}
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
        $display={["none", "none", "block"]}
        $minWidth="spacing-480"
      />
    </OakFlex>
  </OakBox>
);
