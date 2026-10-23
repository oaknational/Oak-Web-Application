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
    transform: "translateY(-38%) rotate(129.45deg) skewX(-1.12deg)",
  },
  {
    name: "middle",
    right: "spacing-80",
    transform: "translateY(-68%) rotate(155.89deg) skewX(-1.1deg)",
  },
  {
    name: "left",
    right: "spacing-180",
    transform: "translateY(-56%) rotate(145.59deg) skewX(-1.12deg)",
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
      $position="relative"
      $flexDirection="column"
      $gap="spacing-24"
      $width="100%"
      $maxWidth="spacing-1280"
      $mh="auto"
      $boxSizing="border-box"
      $ph={["spacing-16", "spacing-20"]}
      $pv="spacing-24"
      $background="bg-decorative5-very-subdued"
      $borderRadius="border-radius-m2"
      $color="text-primary"
    >
      {confetti.map((asset) => (
        <OakFlex
          key={asset.name}
          aria-hidden="true"
          $position="absolute"
          $top="spacing-0"
          $right={asset.right}
          $alignItems="center"
          $justifyContent="center"
          $pointerEvents="none"
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
        aria-hidden="true"
        $position="absolute"
        $top="spacing-0"
        $right="spacing-8"
        $display={["flex", "none"]}
        $alignItems="center"
        $justifyContent="center"
        $pointerEvents="none"
      >
        <OakBox
          as="img"
          src={getCloudinaryImageUrl(
            "ui-graphics/confidence-confetti-mobile.svg",
          )}
          alt=""
          $maxWidth="unset"
          $transform="translateY(-43%) rotate(-175.32deg)"
        />
      </OakFlex>
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
  );
};
