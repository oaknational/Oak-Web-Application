"use client";

import {
  getMediaQuery,
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
} from "@oaknational/oak-components";
import { useId } from "react";
import styled from "styled-components";

import { insightsAssetUrl } from "../../helpers/assets";
import type { NationalCurriculumInsightsRouteData } from "../../helpers/getRouteData";
import { nationalCurriculumInsightsPresentation } from "../../helpers/presentation";
import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../PortableText";

import {
  ContextualSectionProps,
  insightsTabletMediaQuery,
  portableTextComponents,
  SectionMaxWidth,
} from "./shared";

import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

type OverviewPageKind = "hub" | "subject" | "phase" | "keyStage";

const OverviewPanel = styled(SectionMaxWidth)<{ $isKeyStage: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (${getMediaQuery("desktop")}) {
    height: auto;
    flex-direction: row;
    align-items: flex-start;
    gap: ${({ $isKeyStage }) => ($isKeyStage ? "81px" : "40px")};
  }

  @media ${insightsTabletMediaQuery} {
    height: auto;
    flex-direction: column;
    align-items: stretch;
    gap: 40px;
  }
`;

const OverviewCopy = styled(OakFlex)`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    width: 684px;
    flex: 0 0 684px;
  }

  @media ${insightsTabletMediaQuery} {
    display: contents;
  }
`;

const OverviewTitleGroup = styled(OakFlex)`
  width: 100%;

  @media ${insightsTabletMediaQuery} {
    gap: 20px;
  }
`;

const OverviewBody = styled(OakBox)`
  @media ${insightsTabletMediaQuery} {
    order: 3;
  }
`;

const OverviewImage = styled(OakBox)<{
  $isKeyStage: boolean;
  $pageKind: OverviewPageKind;
}>`
  width: 100%;
  aspect-ratio: 332 / 259;
  overflow: hidden;

  @media (${getMediaQuery("desktop")}) {
    width: ${({ $isKeyStage }) => ($isKeyStage ? "295px" : "332px")};
    height: ${({ $isKeyStage }) => ($isKeyStage ? "312px" : "259px")};
    flex: ${({ $isKeyStage }) => ($isKeyStage ? "0 0 295px" : "0 0 332px")};
    align-self: center;
  }

  @media ${insightsTabletMediaQuery} {
    width: ${({ $pageKind }) => {
      switch ($pageKind) {
        case "subject":
          return "403px";
        case "phase":
          return "clamp(382px, calc(19.434vw + 236.245px), 485px)";
        case "keyStage":
          return "295px";
        case "hub":
          return "403px";
      }
    }};
    max-width: 100%;
    height: auto;
    aspect-ratio: ${({ $pageKind }) => {
      switch ($pageKind) {
        case "subject":
        case "hub":
          return "403 / 274";
        case "phase":
          return "485 / 318";
        case "keyStage":
          return "295 / 312";
      }
    }};
    flex: 0 1 auto;
    align-self: center;
    order: 2;
  }
`;

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
      <OverviewPanel
        $isKeyStage={isKeyStage}
        as="section"
        $mh="auto"
        $background={presentation.overviewBackground}
        $pa={["spacing-24", "spacing-40"]}
        $borderRadius="border-radius-l"
        aria-labelledby={headingId}
        data-insights-module="overview"
      >
        <OverviewCopy
          $flexDirection="column"
          $gap={isKeyStage ? "spacing-40" : "spacing-20"}
        >
          <OverviewTitleGroup
            $flexDirection="column"
            $gap={isKeyStage ? "spacing-40" : "spacing-20"}
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
          </OverviewTitleGroup>
          <OverviewBody>
            <PortableTextWithDefaults
              value={section.bodyPortableText}
              components={portableTextComponents}
            />
          </OverviewBody>
        </OverviewCopy>
        <OverviewImage
          $isKeyStage={isKeyStage}
          $pageKind={pageKind}
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
        </OverviewImage>
      </OverviewPanel>
    </OakBox>
  );
};
