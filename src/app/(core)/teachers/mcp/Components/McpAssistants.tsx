"use client";
import {
  OakFlex,
  OakHeading,
  OakImage,
  OakLI,
  OakOL,
  OakP,
} from "@oaknational/oak-components";

import { McpSection } from "./McpSection";
import { McpTryButton } from "./McpTryButton";
import { McpRichText } from "./McpRichText";

import {
  mcpAssistants,
  type McpAssistant,
  type McpTextSegment,
} from "@/app/(core)/teachers/mcp/mcpContent";

/** Stable key for a run of segments — the copy itself is unique and fixed. */
const segmentsKey = (segments: readonly McpTextSegment[]) =>
  segments.map((segment) => segment.text).join("");

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
      <OakImage
        src={assistant.logoSrc}
        alt=""
        aria-hidden="true"
        width={40}
        height={40}
        placeholder="empty"
        $maxWidth="spacing-40"
      />
    </OakFlex>
    <OakFlex $flexDirection="column" $gap="spacing-16" $alignItems="flex-start">
      <OakHeading tag="h3" $font="heading-6">
        {assistant.name}
      </OakHeading>
      <McpTryButton
        label={assistant.ctaLabel}
        href={assistant.ctaHref}
        logoSrc={assistant.logoSrc}
      />
    </OakFlex>
  </OakFlex>
);

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
    <OakOL $font="body-2">
      {mcpAssistants.steps.map((step) => (
        <OakLI key={segmentsKey(step)} $mb="spacing-8">
          <McpRichText segments={step} />
        </OakLI>
      ))}
    </OakOL>
    <OakFlex $flexDirection="column" $gap="spacing-12">
      {mcpAssistants.smallPrint.map((paragraph) => (
        <OakP key={segmentsKey(paragraph)} $font="body-3">
          <McpRichText segments={paragraph} boldFont="body-3-bold" />
        </OakP>
      ))}
    </OakFlex>
  </McpSection>
);
