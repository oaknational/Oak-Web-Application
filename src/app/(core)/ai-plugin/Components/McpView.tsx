"use client";
import { Fragment } from "react";
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
  type OakFlexProps,
} from "@oaknational/oak-components";

import { McpHero } from "./McpHero";
import { McpSection } from "./McpSection";
import { McpCapabilities } from "./McpCapabilities";
import { McpAssistants } from "./McpAssistants";
import { McpFeedbackPanel } from "./McpFeedbackPanel";
import { McpExternalLink } from "./McpExternalLink";

import {
  mcpHowItWorks,
  mcpIntro,
  mcpLicence,
  mcpOutputWarning,
  mcpResponsibleUse,
  mcpSupport,
} from "@/app/(core)/ai-plugin/mcpContent";

const sectionSpacing: OakFlexProps["$pt"] = [
  "spacing-64",
  "spacing-72",
  "spacing-120",
];

const Prose = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <OakFlex $flexDirection="column" $gap="spacing-20">
    {children}
  </OakFlex>
);

const ProseHeading = ({ children }: Readonly<{ children: string }>) => (
  <OakHeading tag="h3" $font="body-2-bold">
    {children}
  </OakHeading>
);

const ProseList = ({ items }: Readonly<{ items: readonly string[] }>) => (
  <OakUL $font="body-2">
    {items.map((item, index) => (
      <OakLI key={item} $mt={index > 0 ? "spacing-8" : undefined}>
        {item}
      </OakLI>
    ))}
  </OakUL>
);

export const McpView = () => (
  <>
    <OakMaxWidth
      $maxWidth="spacing-1280"
      $color="text-primary"
      $ph="spacing-20"
      $pt="spacing-32"
    >
      <McpHero />

      <OakFlex
        $flexDirection="column"
        $maxWidth="spacing-960"
        $minWidth="spacing-0"
        $width="100%"
        $ma="auto"
        $ph={["spacing-0", "spacing-32", "spacing-0"]}
        $pb={["spacing-32", "spacing-32", "spacing-80"]}
      >
        <OakBox $pt={sectionSpacing}>
          <McpSection title={mcpIntro.title} id="see-it-in-action">
            <Prose>
              {mcpIntro.paragraphs.map((paragraph) => (
                <OakP key={paragraph} $font="body-2">
                  {paragraph}
                </OakP>
              ))}
            </Prose>
            <OakP $font="body-2-bold">{mcpIntro.smallPrint}</OakP>
          </McpSection>
        </OakBox>

        <OakBox $pt={sectionSpacing}>
          <McpCapabilities />
        </OakBox>

        <OakBox $pt={sectionSpacing}>
          <McpAssistants />
        </OakBox>

        <OakBox $pt={sectionSpacing}>
          <OakBox $pt="spacing-64">
            <McpSection title={mcpResponsibleUse.title} id="use-it-responsibly">
              <OakFlex
                $flexDirection="column"
                $gap={["spacing-12", "spacing-24", "spacing-24"]}
              >
                <Prose>
                  {mcpResponsibleUse.intro.map((paragraph) => (
                    <OakP key={paragraph} $font="body-2">
                      {paragraph}
                    </OakP>
                  ))}
                  {mcpResponsibleUse.points.map((point) => (
                    <Fragment key={point.title}>
                      <ProseHeading>{point.title}</ProseHeading>
                      <OakP $font="body-2">{point.body}</OakP>
                    </Fragment>
                  ))}
                </Prose>
                <OakBox $pt="spacing-64">
                  <OakInlineBanner
                    isOpen
                    type="info"
                    message={mcpOutputWarning}
                    $width="100%"
                  />
                </OakBox>
              </OakFlex>
            </McpSection>
          </OakBox>
        </OakBox>

        <OakBox $pt={["spacing-64", "spacing-72", "spacing-56"]}>
          <OakImage
            src="/images/mcp/using-oaks-content.svg"
            alt=""
            aria-hidden="true"
            width={848}
            height={454}
            placeholder="empty"
            $maxWidth="100%"
          />
        </OakBox>

        <OakBox $pt={["spacing-64", "spacing-72", "spacing-0"]}>
          <OakBox $pt="spacing-64">
            <McpSection title={mcpHowItWorks.title} id="how-it-works">
              <Prose>
                {mcpHowItWorks.groups.map((group, index) => (
                  <Fragment key={group.title}>
                    <ProseHeading>{group.title}</ProseHeading>
                    <ProseList items={group.items} />
                    {index === 0 && (
                      <>
                        <OakBox $font="body-2">
                          {mcpLicence.bodyBefore}
                          <McpExternalLink href={mcpLicence.licenceLink.href}>
                            {mcpLicence.licenceLink.label}
                          </McpExternalLink>
                          {mcpLicence.bodyMiddle}
                          <McpExternalLink href={mcpLicence.termsLink.href}>
                            {mcpLicence.termsLink.label}
                          </McpExternalLink>
                          {mcpLicence.bodyAfter}
                        </OakBox>
                        <OakP $font="body-2">{mcpLicence.ukOnly}</OakP>
                      </>
                    )}
                  </Fragment>
                ))}
                <ProseHeading>{mcpSupport.title}</ProseHeading>
                <OakBox $font="body-2">
                  {mcpSupport.bodyBefore}
                  {mcpSupport.links.map((link, index) => (
                    <Fragment key={link.label}>
                      {index > 0 && mcpSupport.joiner}
                      <McpExternalLink href={link.href}>
                        {link.label}
                      </McpExternalLink>
                    </Fragment>
                  ))}
                  {mcpSupport.bodyAfter}
                </OakBox>
              </Prose>
            </McpSection>
          </OakBox>
        </OakBox>
      </OakFlex>
    </OakMaxWidth>

    <McpFeedbackPanel />
  </>
);
