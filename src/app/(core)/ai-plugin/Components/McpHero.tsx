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

export const McpHero = () => (
  <OakBox
    $background="bg-decorative1-main"
    $borderRadius="border-radius-xl"
    $pv={["spacing-32", "spacing-64"]}
    $ph={["spacing-24", "spacing-72"]}
  >
    <OakFlex
      $flexDirection={["column", "column", "row"]}
      $alignItems="center"
      $gap={["spacing-32", "spacing-48"]}
    >
      <OakFlex
        $flexDirection="column"
        $gap={["spacing-24", "spacing-32"]}
        $flexGrow={1}
      >
        <OakHeading tag="h1" $font={["heading-3", "heading-2"]}>
          {mcpHero.title}
        </OakHeading>
        <OakP $font="body-1">{mcpHero.body}</OakP>
        <OakFlex $gap="spacing-16" $flexWrap="wrap" $alignItems="center">
          {mcpAssistants.items.map((assistant) => (
            <McpTryButton
              key={assistant.name}
              label={assistant.ctaLabel}
              href={assistant.ctaHref}
            />
          ))}
          <OakFlex
            $alignItems="center"
            $gap="spacing-8"
            $pa="spacing-8"
            $background="bg-decorative1-very-subdued"
            $borderRadius="border-radius-s"
          >
            <OakTagFunctional
              label={mcpHero.comingSoon.label}
              $background="bg-decorative5-main"
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
        </OakFlex>
      </OakFlex>
      <OakImage
        src="/images/mcp/hero-using-ai.svg"
        alt=""
        aria-hidden="true"
        width={463}
        height={396}
        placeholder="empty"
        $display={["none", "none", "block"]}
        $minWidth="spacing-480"
      />
    </OakFlex>
  </OakBox>
);
