"use client";
import {
  OakFlex,
  OakHeading,
  OakIcon,
  OakLI,
  OakP,
  OakUL,
} from "@oaknational/oak-components";

import { McpSection } from "./McpSection";

import { mcpCapabilities } from "@/app/(core)/teachers/mcp/mcpContent";

export const McpCapabilities = () => (
  <McpSection title={mcpCapabilities.title} id="what-can-you-do">
    <OakUL $reset $display="flex" $flexDirection="column" $gap="spacing-24">
      {mcpCapabilities.items.map((capability) => (
        <OakLI key={capability.title}>
          <OakFlex $alignItems="center" $gap="spacing-24">
            <OakFlex
              $background={capability.background}
              $borderRadius="border-radius-m2"
              $alignItems="center"
              $justifyContent="center"
              $flexShrink={0}
              $width="spacing-100"
              $height="spacing-100"
            >
              <OakIcon
                iconName={capability.iconName}
                iconWidth="spacing-72"
                iconHeight="spacing-72"
                alt=""
              />
            </OakFlex>
            <OakFlex $flexDirection="column" $gap="spacing-4">
              <OakHeading tag="h3" $font="heading-6">
                {capability.title}
              </OakHeading>
              <OakP $font="heading-light-7">{capability.body}</OakP>
            </OakFlex>
          </OakFlex>
        </OakLI>
      ))}
    </OakUL>
  </McpSection>
);
