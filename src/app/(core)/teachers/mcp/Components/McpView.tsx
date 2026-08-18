"use client";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakInlineBanner,
  OakLI,
  OakMaxWidth,
  OakP,
  OakUL,
} from "@oaknational/oak-components";

import { McpHero } from "./McpHero";
import { McpSection } from "./McpSection";
import { McpCapabilities } from "./McpCapabilities";
import { McpAssistants } from "./McpAssistants";
import { McpVideoPlaceholder } from "./McpVideoPlaceholder";
import { McpFeedbackPanel } from "./McpFeedbackPanel";
import { McpExternalLink } from "./McpExternalLink";

import {
  mcpHowItWorks,
  mcpIntro,
  mcpOutputWarning,
  mcpResponsibleUse,
  mcpSupport,
} from "@/app/(core)/teachers/mcp/mcpContent";

/**
 * A titled block of body copy, e.g. "Check the source" followed by a
 * paragraph. Rendered as an h3 so it nests under its section's h2.
 */
const McpSubsection = ({
  title,
  body,
}: Readonly<{ title: string; body: string }>) => (
  <OakFlex $flexDirection="column" $gap="spacing-4">
    <OakHeading tag="h3" $font="body-2-bold">
      {title}
    </OakHeading>
    <OakP $font="body-2">{body}</OakP>
  </OakFlex>
);

export const McpView = () => (
  <>
    <OakMaxWidth $ph={["spacing-16", "spacing-24"]} $pb="spacing-64">
      <McpHero />

      <OakFlex
        $flexDirection="column"
        $gap={["spacing-48", "spacing-64"]}
        $maxWidth="spacing-960"
        $minWidth="spacing-0"
        $width="100%"
        $ma="auto"
        $pt={["spacing-48", "spacing-64"]}
      >
        <McpSection title={mcpIntro.title} id="see-it-in-action">
          <McpVideoPlaceholder />
          {mcpIntro.paragraphs.map((paragraph) => (
            <OakP key={paragraph} $font="body-2">
              {paragraph}
            </OakP>
          ))}
          <OakP $font="body-2-bold">{mcpIntro.smallPrint}</OakP>
        </McpSection>

        <McpCapabilities />

        <McpAssistants />

        <McpSection title={mcpResponsibleUse.title} id="use-it-responsibly">
          {mcpResponsibleUse.intro.map((paragraph) => (
            <OakP key={paragraph} $font="body-2">
              {paragraph}
            </OakP>
          ))}
          {mcpResponsibleUse.points.map((point) => (
            <McpSubsection
              key={point.title}
              title={point.title}
              body={point.body}
            />
          ))}
        </McpSection>

        <OakImage
          src="/images/mcp/using-oaks-content.svg"
          alt=""
          aria-hidden="true"
          width={848}
          height={454}
          placeholder="empty"
          $maxWidth="100%"
        />

        <McpSection title={mcpHowItWorks.title} id="how-it-works">
          {mcpHowItWorks.groups.map((group) => (
            <OakBox key={group.title}>
              <OakHeading tag="h3" $font="body-2-bold" $mb="spacing-20">
                {group.title}
              </OakHeading>
              <OakUL $font="body-2">
                {group.items.map((item) => (
                  <OakLI key={item} $mb="spacing-8">
                    {item}
                  </OakLI>
                ))}
              </OakUL>
            </OakBox>
          ))}

          <OakFlex $flexDirection="column" $gap="spacing-4">
            <OakHeading tag="h3" $font="body-2-bold">
              {mcpSupport.title}
            </OakHeading>
            <OakP $font="body-2">
              {mcpSupport.bodyBefore}
              <McpExternalLink href={mcpSupport.href}>
                {mcpSupport.linkLabel}
              </McpExternalLink>
              {mcpSupport.bodyAfter}
            </OakP>
          </OakFlex>
        </McpSection>

        <OakInlineBanner
          isOpen
          type="info"
          message={mcpOutputWarning}
          $width="100%"
        />
      </OakFlex>
    </OakMaxWidth>

    <McpFeedbackPanel />
  </>
);
