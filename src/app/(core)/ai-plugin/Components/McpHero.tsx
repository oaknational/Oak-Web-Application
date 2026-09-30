"use client";
import { Fragment } from "react";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
  OakSpan,
  OakTagFunctional,
} from "@oaknational/oak-components";

import { McpTryButton } from "./McpTryButton";

import { mcpAssistants, mcpHero } from "@/app/(core)/ai-plugin/mcpContent";

const McpComingSoon = () => (
  <OakFlex
    $alignItems="center"
    $gap="spacing-12"
    $ph="spacing-12"
    $minHeight="spacing-48"
    $background="bg-decorative1-subdued"
    $borderRadius="border-radius-m"
  >
    <OakTagFunctional
      label={mcpHero.comingSoon.label}
      $background="bg-decorative5-main"
      $borderRadius="border-radius-s"
      useSpan
    />
    <OakP $font="body-2">
      {mcpHero.comingSoon.tools.map((tool, index) => (
        <Fragment key={tool}>
          {index > 0 && " and "}
          <OakSpan $font="body-2-bold">{tool}</OakSpan>
        </Fragment>
      ))}
    </OakP>
  </OakFlex>
);

export const McpHero = () => (
  <OakBox
    $background="bg-decorative1-main"
    $borderRadius="border-radius-xl"
    $pv={["spacing-32", "spacing-40", "spacing-64"]}
    $ph={["spacing-24", "spacing-32", "spacing-72"]}
  >
    <OakFlex
      $flexDirection={["column", "column", "row"]}
      $alignItems="center"
      $gap={["spacing-32", "spacing-32", "spacing-48"]}
    >
      <OakFlex
        $flexDirection="column"
        $gap={["spacing-32", "spacing-24", "spacing-32"]}
        $flexGrow={1}
      >
        <OakFlex
          $flexDirection="column"
          $gap={["spacing-24", "spacing-24", "spacing-32"]}
        >
          <OakHeading tag="h1" $font={["heading-4", "heading-4", "heading-2"]}>
            {mcpHero.title}
          </OakHeading>
          <OakP $font="body-1">{mcpHero.body}</OakP>
        </OakFlex>
        <OakFlex
          $flexDirection={["column", "column", "row"]}
          $alignItems={["flex-start", "flex-start", "center"]}
          $flexWrap="wrap"
          $gap={["spacing-32", "spacing-24", "spacing-16"]}
        >
          <OakFlex
            $flexDirection={["column", "row", "row"]}
            $alignItems="flex-start"
            $gap="spacing-16"
          >
            {mcpAssistants.items.map((assistant) => (
              <McpTryButton
                key={assistant.name}
                label={assistant.ctaLabel}
                href={assistant.ctaHref}
              />
            ))}
          </OakFlex>
          <McpComingSoon />
        </OakFlex>
      </OakFlex>
      <OakImage
        src="/images/mcp/hero-using-ai.svg"
        alt=""
        aria-hidden="true"
        width={360}
        height={308}
        placeholder="empty"
        $display={["none", "none", "block"]}
        $minWidth="spacing-360"
      />
    </OakFlex>
  </OakBox>
);
