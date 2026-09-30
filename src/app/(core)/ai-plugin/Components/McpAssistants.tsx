"use client";
import {
  OakBox,
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
  mcpMoreAssistantsNote,
  type McpAssistant,
} from "@/app/(core)/ai-plugin/mcpContent";
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
        $colorFilter={
          assistant.background === "bg-inverted" ? "text-inverted" : undefined
        }
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

const McpAssistantFlow = ({
  assistant,
}: Readonly<{ assistant: McpAssistant }>) => (
  <OakFlex $flexDirection="column" $gap="spacing-24">
    <McpAssistantCard assistant={assistant} />
    <PortableTextWithDefaults
      value={assistant.steps}
      components={stepComponents}
    />
    <PortableTextWithDefaults
      value={assistant.pasteNote}
      components={smallPrintComponents}
    />
  </OakFlex>
);

export const McpAssistants = () => (
  <McpSection title={mcpAssistants.title} id="choose-your-ai-assistant">
    <OakP $font="body-2">{mcpAssistants.body}</OakP>
    {mcpAssistants.items.map((assistant, index) => (
      <OakFlex key={assistant.name} $flexDirection="column" $gap="spacing-24">
        {index > 0 && (
          <OakBox $bt="border-solid-m" $borderColor="border-neutral-lighter" />
        )}
        <McpAssistantFlow assistant={assistant} />
      </OakFlex>
    ))}
    <OakP $font="body-3">{mcpMoreAssistantsNote}</OakP>
  </McpSection>
);
