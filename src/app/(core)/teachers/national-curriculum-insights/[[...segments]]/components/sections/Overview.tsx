"use client";

import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
} from "@oaknational/oak-components";
import { useId } from "react";

import { insightsAssetUrl } from "../../helpers/assets";
import type { NationalCurriculumInsightsRouteData } from "../../helpers/getRouteData";
import { nationalCurriculumInsightsPresentation } from "../../helpers/presentation";
import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../PortableText";

import {
  ContextualSectionProps,
  portableTextComponents,
  SectionMaxWidth,
} from "./shared";

import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

type OverviewPageKind = "hub" | "subject" | "phase" | "keyStage";

const tabletIllustrationLayout = {
  hub: { width: "60%", aspectRatio: "403 / 274" },
  subject: { width: "60%", aspectRatio: "403 / 274" },
  phase: { width: "65%", aspectRatio: "485 / 318" },
  keyStage: { width: "45%", aspectRatio: "295 / 312" },
};

const overviewPageKind = (
  data: NationalCurriculumInsightsRouteData,
): OverviewPageKind => {
  switch (data.route.kind) {
    case "hub":
    case "guidance":
      return "hub";
    case "subject":
      return "subject";
    case "subjectPhase":
      return "phase";
    case "subjectPhaseKeyStage":
      return "keyStage";
  }
};

export const NationalCurriculumInsightsOverview = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsOverviewSection">) => {
  const headingId = useId();
  const isKeyStage = data.route.kind === "subjectPhaseKeyStage";
  const pageKind = overviewPageKind(data);
  const subjectIllustration =
    data.route.kind === "subject" ? data.subject?.illustration : null;
  const subjectIllustrationUrl = subjectIllustration?.asset?.url
    ? getProxiedSanityAssetUrl(subjectIllustration.asset.url)
    : null;
  const presentation = nationalCurriculumInsightsPresentation(
    data.route,
    subjectIllustrationUrl,
  );
  const illustrationIsPresentational =
    data.route.kind !== "subject" ||
    !subjectIllustration?.asset?.url ||
    subjectIllustration.isPresentational === true;

  return (
    <OakBox
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-32", "spacing-48"]}
    >
      <SectionMaxWidth
        $boxSizing="border-box"
        $flexDirection={["column", "column", "row"]}
        $alignItems={["stretch", "stretch", "flex-start"]}
        $gap={[
          "spacing-24",
          "spacing-40",
          isKeyStage ? "spacing-80" : "spacing-40",
        ]}
        as="section"
        $mh="auto"
        $background={presentation.overviewBackground}
        $pa={["spacing-24", "spacing-40"]}
        $borderRadius="border-radius-l"
        aria-labelledby={headingId}
        data-insights-module="overview"
      >
        <OakFlex
          $width="100%"
          $minWidth={["auto", "auto", "spacing-0"]}
          $display={["flex", "contents", "flex"]}
          $flexGrow={[0, 0, 1]}
          $flexBasis={["auto", "auto", "0%"]}
          $flexDirection="column"
          $gap={isKeyStage ? "spacing-40" : "spacing-20"}
        >
          <OakFlex
            $width="100%"
            $flexDirection="column"
            $gap={[
              isKeyStage ? "spacing-40" : "spacing-20",
              "spacing-20",
              isKeyStage ? "spacing-40" : "spacing-20",
            ]}
          >
            <OakP $font="body-2" $mv="spacing-0">
              At a glance
            </OakP>
            <OakHeading
              id={headingId}
              tag="h2"
              $font={["heading-4", "heading-4", "heading-3"]}
            >
              {section.heading}
            </OakHeading>
          </OakFlex>
          <OakFlex $display="block" $order={[0, 3, 0]}>
            <PortableTextWithDefaults
              value={section.bodyPortableText}
              components={portableTextComponents}
            />
          </OakFlex>
        </OakFlex>
        <OakFlex
          $display="block"
          $width={[
            "100%",
            tabletIllustrationLayout[pageKind].width,
            isKeyStage ? "28%" : "32%",
          ]}
          $maxWidth={["unset", "spacing-480", "unset"]}
          $aspectRatio={[
            "332 / 259",
            tabletIllustrationLayout[pageKind].aspectRatio,
            isKeyStage ? "295 / 312" : "332 / 259",
          ]}
          $overflow="hidden"
          $flexShrink={[1, 1, 0]}
          $alignSelf={["auto", "center", "center"]}
          $order={[0, 2, 0]}
          aria-hidden={illustrationIsPresentational ? true : undefined}
        >
          <OakImage
            src={presentation.illustration ?? insightsAssetUrl("overview")}
            alt={
              illustrationIsPresentational
                ? ""
                : (subjectIllustration?.altText ?? "")
            }
            $width="100%"
            $height="100%"
            $objectFit="contain"
          />
        </OakFlex>
      </SectionMaxWidth>
    </OakBox>
  );
};
