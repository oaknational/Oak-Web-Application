"use client";

import { useId } from "react";
import Link from "next/link";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakSecondaryButton,
} from "@oaknational/oak-components";

import { NationalCurriculumInsightsPortableText } from "../PortableText";

import { guidancePortableTextComponents, type SectionProps } from "./shared";

import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";

const confetti = [
  {
    name: "right",
    right: "spacing-0",
    transform: "rotate(129.45deg) skewX(-1.12deg)",
  },
  {
    name: "middle",
    right: "spacing-80",
    transform: "rotate(155.89deg) skewX(-1.1deg)",
  },
  {
    name: "left",
    right: "spacing-180",
    transform: "rotate(145.59deg) skewX(-1.12deg)",
  },
] as const;

export const NationalCurriculumInsightsConfidence = ({
  section,
}: SectionProps<"NationalCurriculumInsightsConfidenceSection">) => {
  const headingId = `${useId()}-confidence-heading`;
  return (
    <OakFlex
      as="section"
      aria-labelledby={headingId}
      data-insights-module="confidence"
      $flexDirection="column"
      $width="100%"
      $maxWidth="spacing-1280"
      $mh="auto"
      $boxSizing="border-box"
      $color="text-primary"
    >
      <OakFlex
        aria-hidden="true"
        $position="relative"
        $height={["spacing-80", "spacing-160"]}
        $flexShrink={0}
        $pointerEvents="none"
      >
        {confetti.map((asset) => (
          <OakFlex
            key={asset.name}
            $position="absolute"
            $bottom="spacing-40"
            $right={asset.right}
            $alignItems="center"
            $justifyContent="center"
            $display={["none", "flex"]}
          >
            <OakBox
              as="img"
              src={getCloudinaryImageUrl(
                `ui-graphics/confidence-confetti-${asset.name}.svg`,
              )}
              alt=""
              $maxWidth="unset"
              $transform={asset.transform}
            />
          </OakFlex>
        ))}
        <OakFlex
          $position="absolute"
          $bottom="spacing-4"
          $right="spacing-8"
          $display={["flex", "none"]}
          $alignItems="center"
          $justifyContent="center"
        >
          <OakBox
            as="img"
            src={getCloudinaryImageUrl(
              "ui-graphics/confidence-confetti-mobile.svg",
            )}
            alt=""
            $maxWidth="unset"
            $transform="rotate(-175.32deg)"
          />
        </OakFlex>
      </OakFlex>
      <OakFlex
        $flexDirection="column"
        $gap="spacing-24"
        $ph={["spacing-16", "spacing-20"]}
        $pv="spacing-24"
        $background="bg-decorative5-very-subdued"
        $borderRadius="border-radius-m2"
      >
        <OakHeading id={headingId} tag="h2" $font="heading-4">
          {section.heading}
        </OakHeading>
        <OakFlex $flexDirection="column" $gap="spacing-24">
          <NationalCurriculumInsightsPortableText
            value={section.bodyPortableText}
            components={guidancePortableTextComponents}
          />
        </OakFlex>
        <OakFlex $width="100%" $maxWidth="spacing-360">
          <OakSecondaryButton
            element={Link}
            href={getLinkHref(section.cta)}
            iconName="arrow-right"
            isTrailingIcon
            width="100%"
          >
            {section.cta.label}
          </OakSecondaryButton>
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
};
