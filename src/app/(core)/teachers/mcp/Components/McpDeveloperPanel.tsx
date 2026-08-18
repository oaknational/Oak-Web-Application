"use client";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakP,
  OakSpan,
  OakTagFunctional,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { McpExternalLink } from "./McpExternalLink";

import { mcpDeveloper } from "@/app/(core)/teachers/mcp/mcpContent";

/**
 * oak-components has no block-code component — `OakCodeRenderer` only styles
 * inline backticked spans — so the monospace family is set here. Size, weight
 * and colour still come from Oak tokens.
 */
const StyledCodeBlock = styled(OakSpan)`
  font-family: "Roboto Mono", monospace;
`;

export const McpDeveloperPanel = () => (
  <OakFlex
    as="section"
    $flexDirection="column"
    $gap="spacing-24"
    $width="100%"
    $minWidth="spacing-0"
    aria-labelledby="connect-a-product"
  >
    <OakFlex>
      <OakTagFunctional
        label={mcpDeveloper.tagLabel}
        $background="bg-decorative3-subdued"
      />
    </OakFlex>
    <OakHeading
      id="connect-a-product"
      tag="h2"
      $font={["heading-6", "heading-5"]}
    >
      {mcpDeveloper.title}
    </OakHeading>
    <OakP $font="body-1">{mcpDeveloper.body}</OakP>
    <OakP $font="body-1-bold">{mcpDeveloper.configLabel}</OakP>
    <OakBox
      $background="bg-inverted"
      $borderRadius="border-radius-m2"
      $pv="spacing-8"
      $ph="spacing-12"
      $overflowX="auto"
      // Without this the unwrappable code lines set the column's min-content
      // width and the whole page overflows horizontally on small screens.
      $minWidth="spacing-0"
      $width="100%"
      // Because the block scrolls horizontally on narrow viewports, it has to
      // be focusable for keyboard users to reach that scroll at all
      // (WCAG 2.1.1), and named so the extra focus stop is announced.
      tabIndex={0}
      role="region"
      aria-label={mcpDeveloper.configRegionLabel}
    >
      <StyledCodeBlock as="pre" $font="code-3" $color="text-inverted">
        {mcpDeveloper.config}
      </StyledCodeBlock>
    </OakBox>
    <OakP $font="body-3" $color="text-subdued">
      {mcpDeveloper.authBefore}
      <McpExternalLink href={mcpDeveloper.authHref}>
        {mcpDeveloper.authLinkLabel}
      </McpExternalLink>
      {mcpDeveloper.authAfter}
    </OakP>
  </OakFlex>
);
