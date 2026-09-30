"use client";
import { Fragment, useEffect, useState } from "react";
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
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
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
          assistant.background === "bg-inverted"
            ? "icon-inverted"
            : "icon-primary"
        }
      />
    </OakFlex>
    <OakFlex $flexDirection="column" $gap="spacing-16" $alignItems="flex-start">
      <OakHeading tag="h3" $font="heading-6">
        {assistant.name}
      </OakHeading>
      <McpTryButton label={assistant.ctaLabel} href={assistant.ctaHref} small />
    </OakFlex>
  </OakFlex>
);

/**
 * Portable text overrides, kept at module scope so they are not redefined on
 * every render — and so they read as components rather than nested closures.
 */
const stepComponents: PortableTextComponents = {
  listItem: {
    number: ({ children, index }) => (
      <OakLI $font="body-2" $mt={index > 0 ? "spacing-8" : undefined}>
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

const Divider = () => (
  <OakBox $bt="border-solid-m" $borderColor="bg-neutral-stronger" />
);

const McpIndividualSetup = () =>
  mcpAssistants.items.map((assistant, index) => (
    <Fragment key={assistant.name}>
      {index > 0 && <Divider />}
      <McpAssistantCard assistant={assistant} />
      <PortableTextWithDefaults
        value={assistant.steps}
        components={stepComponents}
      />
      <PortableTextWithDefaults
        value={assistant.pasteNote}
        components={smallPrintComponents}
      />
    </Fragment>
  ));

const McpSchoolSetup = () => (
  <>
    <OakFlex $flexDirection="column" $gap="spacing-20">
      {mcpSchoolSetup.intro.map((paragraph) => (
        <OakP key={paragraph} $font="body-2">
          {paragraph}
        </OakP>
      ))}
    </OakFlex>
    {mcpSchoolSetup.providers.map((provider, index) => (
      <Fragment key={provider.name}>
        {index > 0 && <Divider />}
        <OakHeading tag="h3" $font="heading-6">
          {provider.name}
        </OakHeading>
        <OakFlex $flexDirection="column" $gap="spacing-20">
          <OakP $font="body-2">{provider.body}</OakP>
          <OakBox $font="body-2">
            {provider.guideBefore}
            <McpExternalLink href={provider.guideHref}>
              {provider.guideLabel}
            </McpExternalLink>
            .
          </OakBox>
        </OakFlex>
      </Fragment>
    ))}
  </>
);

const audienceFromHash = (): McpAudience =>
  mcpAudiences.find(({ id }) => `#${id}` === globalThis.location.hash)?.label ??
  mcpAudiences[0].label;

export const McpAssistants = () => {
  const [audience, setAudience] = useState<McpAudience>(mcpAudiences[0].label);

  useEffect(() => {
    const syncWithUrl = () => setAudience(audienceFromHash());
    syncWithUrl();
    globalThis.addEventListener("popstate", syncWithUrl);
    globalThis.addEventListener("hashchange", syncWithUrl);
    return () => {
      globalThis.removeEventListener("popstate", syncWithUrl);
      globalThis.removeEventListener("hashchange", syncWithUrl);
    };
  }, []);

  return (
    <McpSection
      title={mcpAssistants.title}
      id="choose-your-ai-tool"
      gap={["spacing-48", "spacing-48", "spacing-24"]}
    >
      <OakFlex
        $flexDirection="column"
        $gap={["spacing-32", "spacing-32", "spacing-24"]}
      >
        <OakP $font="body-2">{mcpAssistants.body}</OakP>
        <OakFlex $pb="spacing-32" $position="relative">
          {mcpAudiences.map(({ id }) => (
            <AnchorTarget key={id} id={id} />
          ))}
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
              const id = mcpAudiences.find(({ label }) => label === tab)?.id;
              globalThis.history.pushState(null, "", `#${id}`);
              setAudience(tab);
            }}
          />
        </OakFlex>
        <OakFlex $flexDirection="column" $gap="spacing-32">
          {audience === "School or trust" ? (
            <McpSchoolSetup />
          ) : (
            <McpIndividualSetup />
          )}
          <OakBox $pt="spacing-64">
            <OakInlineBanner
              isOpen
              type="info"
              message={mcpMoreAssistantsNote}
              $width="100%"
            />
          </OakBox>
        </OakFlex>
      </OakFlex>
    </McpSection>
  );
};
