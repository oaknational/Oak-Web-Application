"use client";

import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakImage,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import Link from "next/link";
import { useId } from "react";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../PortableText";

import {
  ContextualSectionProps,
  imageUrl,
  imageAlt,
  guidancePortableTextComponents,
  SectionMaxWidth,
} from "./shared";

import { getImageDimensions } from "@/components/HooksAndUtils/sanityImageBuilder";

const editorialBackground = {
  white: "bg-primary",
  turquoise: "bg-decorative2-subdued",
  yellow: "bg-decorative5-very-subdued",
  green: "bg-decorative1-very-subdued",
} as const;

export const NationalCurriculumInsightsImageText = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsImageTextSection">) => {
  const headingId = useId();

  if (data.route.kind === "guidance") {
    return (
      <OakBox
        as="section"
        $background="bg-decorative1-very-subdued"
        $ph="spacing-40"
        $pv={["spacing-48", "spacing-64", "spacing-40"]}
        aria-labelledby={headingId}
        data-insights-module="guidance-benefits"
      >
        <SectionMaxWidth>
          <OakGrid
            $cg={["spacing-0", "spacing-0", "spacing-40"]}
            $rg="spacing-40"
          >
            <OakGridArea $colSpan={[12, 12, 8]} $colStart={1} $rowStart={1}>
              <OakHeading tag="h2" id={headingId} $font="heading-5">
                {section.heading}
              </OakHeading>
            </OakGridArea>
            <OakGridArea
              $colSpan={[12, 12, 4]}
              $colStart={[1, 1, 8]}
              $rowStart={[2, 2, 1]}
              $rowSpan={[1, 1, 2]}
              $alignItems="center"
              $justifyContent="center"
            >
              <OakBox
                $width="100%"
                $maxWidth="spacing-360"
                $aspectRatio="332 / 259"
                aria-hidden={section.image.isPresentational || undefined}
                style={{
                  transform: section.mirrorImage ? "scaleX(-1)" : undefined,
                }}
              >
                <OakImage
                  src={imageUrl(section.image)}
                  alt={imageAlt(section.image)}
                  $width="100%"
                  $height="100%"
                  $objectFit="contain"
                />
              </OakBox>
            </OakGridArea>
            <OakGridArea
              $colSpan={[12, 12, 7]}
              $colStart={1}
              $rowStart={[3, 3, 2]}
            >
              <OakBox>
                <PortableTextWithDefaults
                  value={section.bodyPortableText}
                  components={guidancePortableTextComponents}
                />
              </OakBox>
            </OakGridArea>
          </OakGrid>
        </SectionMaxWidth>
      </OakBox>
    );
  }

  return (
    <OakBox
      as="section"
      $background={editorialBackground[section.background]}
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-48", "spacing-64"]}
      aria-labelledby={headingId}
      data-insights-module="image-text"
    >
      <SectionMaxWidth>
        <OakGrid
          $cg={["spacing-0", "spacing-0", "spacing-40"]}
          $rg="spacing-32"
          $alignItems="center"
        >
          <OakGridArea
            $colSpan={[12, 12, 5]}
            $order={[0, 0, section.imagePosition === "left" ? 0 : 1]}
          >
            <OakBox
              $width="100%"
              $aspectRatio={
                section.image.asset?._id
                  ? getImageDimensions(section.image.asset._id, {}).aspectRatio
                  : 16 / 10
              }
              $overflow="hidden"
              $borderRadius="border-radius-m2"
              aria-hidden={section.image.isPresentational || undefined}
            >
              <OakImage
                src={imageUrl(section.image)}
                alt={imageAlt(section.image)}
                $width="100%"
                $height="100%"
                $objectFit="cover"
              />
            </OakBox>
          </OakGridArea>
          <OakGridArea $colSpan={[12, 12, 7]}>
            <OakFlex $flexDirection="column" $gap="spacing-24">
              <OakHeading tag="h2" id={headingId} $font="heading-5">
                {section.heading}
              </OakHeading>
              <PortableTextWithDefaults
                value={section.bodyPortableText}
                components={guidancePortableTextComponents}
              />
              {section.ctaLabel && section.ctaHref ? (
                <OakPrimaryButton
                  element={Link}
                  href={section.ctaHref}
                  iconName="arrow-right"
                  isTrailingIcon
                >
                  {section.ctaLabel}
                </OakPrimaryButton>
              ) : null}
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </SectionMaxWidth>
    </OakBox>
  );
};
