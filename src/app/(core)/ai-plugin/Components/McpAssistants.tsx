"use client";
import { useState } from "react";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakIcon,
  OakInlineBanner,
  OakLI,
  OakP,
  OakTabs,
} from "@oaknational/oak-components";
import type { PortableTextComponents } from "@portabletext/react";

import { McpExternalLink } from "./McpExternalLink";
import { McpSection } from "./McpSection";
import { McpTryButton } from "./McpTryButton";

import {
  mcpAssistants,
  mcpAudiences,
  mcpMoreAssistantsNote,
  mcpSchoolSetup,
  type McpAssistant,
  type McpAudience,
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

const Divider = () => (
  <OakBox $bt="border-solid-m" $borderColor="border-neutral-lighter" />
);

const McpIndividualSetup = () =>
  mcpAssistants.items.map((assistant, index) => (
    <OakFlex key={assistant.name} $flexDirection="column" $gap="spacing-24">
      {index > 0 && <Divider />}
      <McpAssistantFlow assistant={assistant} />
    </OakFlex>
  ));

const McpSchoolSetup = () => (
  <>
    {mcpSchoolSetup.intro.map((paragraph) => (
      <OakP key={paragraph} $font="body-2">
        {paragraph}
      </OakP>
    ))}
    {mcpSchoolSetup.providers.map((provider, index) => (
      <OakFlex key={provider.name} $flexDirection="column" $gap="spacing-24">
        {index > 0 && <Divider />}
        <OakFlex $flexDirection="column" $gap="spacing-16">
          <OakHeading tag="h3" $font="heading-6">
            {provider.name}
          </OakHeading>
          <OakP $font="body-2">{provider.body}</OakP>
          <OakBox $font="body-2">
            {provider.guideBefore}
            <McpExternalLink href={provider.guideHref}>
              {provider.guideLabel}
            </McpExternalLink>
            .
          </OakBox>
        </OakFlex>
      </OakFlex>
    ))}
  </>
);

/**
 * The tabs are in-page links rather than buttons: OakTabs only marks the
 * selected tab for assistive technology (`aria-current`) on its link variant.
 */
export const McpAssistants = () => {
  const [audience, setAudience] = useState<McpAudience>(mcpAudiences[0].label);
  const activeId = mcpAudiences.find(({ label }) => label === audience)?.id;

  return (
    <McpSection title={mcpAssistants.title} id="choose-your-ai-tool">
      <OakP $font="body-2">{mcpAssistants.body}</OakP>
      <OakFlex>
        <OakTabs<McpAudience>
          sizeVariant="default"
          colorVariant="white"
          activeTab={audience}
          tabs={mcpAudiences.map(({ label, id }) => ({
            label,
            type: "link" as const,
            href: `#${id}`,
          }))}
          onTabClick={(tab, event) => {
            event.preventDefault();
            setAudience(tab);
          }}
        />
      </OakFlex>
      <OakFlex id={activeId} $flexDirection="column" $gap="spacing-24">
        {audience === "School or trust" ? (
          <McpSchoolSetup />
        ) : (
          <McpIndividualSetup />
        )}
      </OakFlex>
      <OakInlineBanner
        isOpen
        type="info"
        message={mcpMoreAssistantsNote}
        $width="100%"
      />
    </McpSection>
  );
};
