"use client";
import {
  OakFlex,
  OakHeading,
  OakIcon,
  OakLI,
  OakP,
} from "@oaknational/oak-components";
import type { PortableTextComponents } from "@portabletext/react";

import { McpSection } from "./McpSection";
import { McpTryButton } from "./McpTryButton";

import {
  mcpAssistants,
  type McpAssistant,
} from "@/app/(core)/teachers/mcp/mcpContent";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const McpAssistantCard = ({
  assistant,
}: Readonly<{ assistant: McpAssistant }>) => (
  <OakFlex $gap="spacing-24" $alignItems="flex-start" $flexGrow={1}>
    <OakFlex
      $background={assistant.background}
      $borderRadius="border-radius-m2"
      $alignItems="center"
      $justifyContent="center"
      $flexShrink={0}
      $width="spacing-100"
      $height="spacing-100"
    >
      {/* Placeholder for the provider mark — see McpAssistant in mcpContent. */}
      <OakIcon
        iconName="ai"
        iconWidth="spacing-40"
        iconHeight="spacing-40"
        alt=""
      />
    </OakFlex>
    <OakFlex $flexDirection="column" $gap="spacing-16" $alignItems="flex-start">
      <OakHeading tag="h3" $font="heading-6">
        {assistant.name}
      </OakHeading>
      <McpTryButton label={assistant.ctaLabel} href={assistant.ctaHref} />
    </OakFlex>
  </OakFlex>
);

/**
 * Portable text overrides, kept at module scope so they are not redefined on
 * every render — and so they read as components rather than nested closures.
 */
const stepComponents: PortableTextComponents = {
  listItem: {
    number: ({ children }) => (
      <OakLI $font="body-2" $mb="spacing-8">
        {children}
      </OakLI>
    ),
  },
};

const smallPrintComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <OakP $font="body-3">{children}</OakP>,
  },
};

export const McpAssistants = () => (
  <McpSection title={mcpAssistants.title} id="choose-your-ai-assistant">
    <OakP $font="body-2">{mcpAssistants.body}</OakP>
    <OakFlex
      $flexDirection={["column", "column", "row"]}
      $gap={["spacing-32", "spacing-24"]}
    >
      {mcpAssistants.items.map((assistant) => (
        <McpAssistantCard key={assistant.name} assistant={assistant} />
      ))}
    </OakFlex>
    <PortableTextWithDefaults
      value={mcpAssistants.steps}
      components={stepComponents}
    />
    <OakFlex $flexDirection="column" $gap="spacing-12">
      <PortableTextWithDefaults
        value={mcpAssistants.smallPrint}
        components={smallPrintComponents}
      />
    </OakFlex>
  </McpSection>
);
