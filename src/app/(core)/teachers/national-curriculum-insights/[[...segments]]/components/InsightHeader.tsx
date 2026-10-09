"use client";

import type { PortableTextComponents } from "@portabletext/react";
import {
  OakBox,
  OakBreadcrumbs,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakIcon,
  OakImage,
  OakMaxWidth,
  OakP,
} from "@oaknational/oak-components";

import type { NationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import { NationalCurriculumInsightsPortableText } from "./PortableText";

import {
  nationalCurriculumInsightsKeyStageFromSlug,
  type NationalCurriculumInsightsHeroSection,
} from "@/common-lib/cms-types/nationalCurriculumInsights";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import {
  nationalCurriculumInsightsHubHref,
  nationalCurriculumInsightsSubjectHref,
  nationalCurriculumInsightsSubjectPhaseHref,
} from "@/common-lib/urls/nationalCurriculumInsights";
import formatDate from "@/utils/formatDate";
import { getImageDimensions } from "@/components/HooksAndUtils/sanityImageBuilder";

const introductionComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <OakP $font="body-1" $mv="spacing-0">
        {children}
      </OakP>
    ),
  },
};

const headerBreadcrumbs = (data: NationalCurriculumInsightsRouteData) => {
  const { route, hub, subject } = data;
  if (!hub || !subject || route.kind === "hub" || route.kind === "guidance") {
    return null;
  }

  const breadcrumbs: Array<{ href?: string; text: string }> = [
    { href: nationalCurriculumInsightsHubHref(), text: hub.title },
    {
      href:
        route.kind === "subject"
          ? undefined
          : nationalCurriculumInsightsSubjectHref(subject.slug),
      text: subject.title,
    },
  ];

  if (route.kind !== "subject") {
    breadcrumbs.push({
      href:
        route.kind === "subjectPhase"
          ? undefined
          : nationalCurriculumInsightsSubjectPhaseHref(
              subject.slug,
              route.phase,
            ),
      text:
        subject.tabs.find(({ kind }) => kind === route.phase)?.label ??
        route.phase,
    });
    if (route.kind === "subjectPhaseKeyStage") {
      breadcrumbs.push({
        text: nationalCurriculumInsightsKeyStageFromSlug(route.keyStageSlug),
      });
    }
  }

  return breadcrumbs as Parameters<typeof OakBreadcrumbs>[0]["breadcrumbs"];
};

const headerImage = (data: NationalCurriculumInsightsRouteData) => {
  switch (data.route.kind) {
    case "subject": {
      const illustration = data.subject?.illustration;
      return illustration?.asset?.url
        ? {
            src: getProxiedSanityAssetUrl(illustration.asset.url),
            alt: illustration.isPresentational
              ? ""
              : (illustration.altText ?? ""),
            aspectRatio:
              getImageDimensions(illustration.asset._id, {}).aspectRatio ??
              4 / 3,
          }
        : null;
    }
    case "subjectPhase":
      if (data.route.phase === "primary") {
        return { iconName: "homepage-three-pupils" as const, aspectRatio: 1 };
      }
      return {
        src: `/images/curriculum-change-explained/${data.route.phase}.svg`,
        alt: "",
        aspectRatio: 1,
      };
    case "subjectPhaseKeyStage":
      return {
        src: `/images/curriculum-change-explained/${nationalCurriculumInsightsKeyStageFromSlug(data.route.keyStageSlug).toLowerCase()}.png`,
        alt: "",
        aspectRatio: {
          KS1: 2096 / 1372,
          KS2: 1995 / 2169,
          KS3: 2176 / 2299,
          KS4: 2209 / 1847,
        }[nationalCurriculumInsightsKeyStageFromSlug(data.route.keyStageSlug)],
      };
    default:
      return null;
  }
};

export const NationalCurriculumInsightsHeader = ({
  data,
  section,
}: Readonly<{
  data: NationalCurriculumInsightsRouteData;
  section: NationalCurriculumInsightsHeroSection;
}>) => {
  const breadcrumbs = headerBreadcrumbs(data);
  const image = headerImage(data);
  const background =
    data.route.kind === "subject"
      ? "bg-decorative5-subdued"
      : data.route.kind === "subjectPhase"
        ? "bg-decorative1-subdued"
        : "bg-decorative3-very-subdued";

  return (
    <OakBox
      as="section"
      $background={background}
      $color="text-primary"
      $boxSizing="border-box"
      $ph="spacing-40"
      $pv="spacing-64"
      data-testid="national-curriculum-insights-hero"
      data-insights-module="hero"
    >
      <OakMaxWidth
        $mh="auto"
        $width="100%"
        $maxWidth="spacing-1280"
        $ph="spacing-0"
        $boxSizing="border-box"
      >
        <OakGrid
          $width="100%"
          $gridTemplateColumns={[
            "minmax(0, 1fr)",
            image ? "minmax(0, 6fr) minmax(0, 5fr)" : "minmax(0, 1fr)",
            image ? "minmax(0, 2fr) minmax(0, 1fr)" : "minmax(0, 1fr)",
          ]}
          $cg={["spacing-0", "spacing-24", "spacing-64"]}
          $rg="spacing-24"
          $alignItems="center"
        >
          <OakFlex
            $flexDirection="column"
            $gap={["spacing-24", "spacing-20", "spacing-48"]}
            $minWidth="spacing-0"
            $display={["contents", "contents", "flex"]}
          >
            {breadcrumbs ? (
              <OakGridArea $colSpan={[1, 2, 1]} $order={0}>
                <OakBreadcrumbs breadcrumbs={breadcrumbs} />
              </OakGridArea>
            ) : null}
            <OakFlex
              $flexDirection="column"
              $gap={["spacing-24", "spacing-24", "spacing-12"]}
              $order={[2, 1, 0]}
              $minWidth="spacing-0"
            >
              <OakHeading tag="h1" $font="heading-3">
                {section.heading}
              </OakHeading>
              <OakFlex $flexDirection="column" $gap="spacing-12">
                <NationalCurriculumInsightsPortableText
                  value={section.bodyPortableText}
                  components={introductionComponents}
                />
                {section.lastUpdatedAt ? (
                  <OakP $font="body-3" $color="text-subdued" $mv="spacing-0">
                    Last update{" "}
                    <time dateTime={section.lastUpdatedAt}>
                      {formatDate(section.lastUpdatedAt, { timeZone: "UTC" })}
                    </time>
                  </OakP>
                ) : null}
              </OakFlex>
            </OakFlex>
          </OakFlex>
          {image ? (
            <OakFlex
              $justifyContent="center"
              $order={[1, 2, 1]}
              data-testid="insights-header-illustration"
            >
              {image.iconName ? (
                <OakIcon
                  iconName={image.iconName}
                  $width="100%"
                  $height="auto"
                  $minWidth="spacing-0"
                  $minHeight="spacing-0"
                  $maxWidth="spacing-240"
                  $aspectRatio={image.aspectRatio}
                />
              ) : (
                <OakImage
                  src={image.src}
                  alt={image.alt}
                  $width="100%"
                  $maxWidth={
                    data.route.kind === "subject"
                      ? "spacing-360"
                      : "spacing-240"
                  }
                  $aspectRatio={image.aspectRatio}
                  $objectFit="contain"
                  sizes="(min-width: 1280px) 360px, (min-width: 750px) 40vw, 80vw"
                />
              )}
            </OakFlex>
          ) : null}
        </OakGrid>
      </OakMaxWidth>
    </OakBox>
  );
};
