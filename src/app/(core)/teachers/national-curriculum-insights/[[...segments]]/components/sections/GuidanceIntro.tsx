"use client";

import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakIcon,
  OakImage,
  OakTagFunctional,
  parseSpacing,
} from "@oaknational/oak-components";
import { useId } from "react";
import styled from "styled-components";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../PortableText";

import {
  SectionProps,
  imageUrl,
  imageAlt,
  guidancePortableTextComponents,
  SectionMaxWidth,
} from "./shared";

// Let the paragraph wrap naturally around the inline status tag.
const GuidanceTaggedParagraph = styled.div`
  display: flow-root;

  > :first-child {
    float: left;
    margin-right: ${parseSpacing("spacing-8")};
  }
`;

const GuidanceStatusLabel = ({ label }: { label: string }) => (
  <OakFlex
    $display="inline-flex"
    $alignItems="center"
    $alignSelf="flex-start"
    $background="bg-decorative5-main"
    $borderRadius="border-radius-s"
    $whiteSpace="nowrap"
  >
    <OakIcon
      iconName="clock"
      $width="spacing-16"
      $height="spacing-16"
      $ml="spacing-8"
      data-testid="guidance-status-clock"
    />
    <OakTagFunctional
      label={label}
      $pl="spacing-4"
      $font="heading-7"
      $color="text-primary"
    />
  </OakFlex>
);

export const NationalCurriculumInsightsGuidanceIntro = ({
  section,
}: SectionProps<"NationalCurriculumInsightsGuidanceIntroSection">) => {
  const headingId = useId();
  const [leadBlock, ...remainingBlocks] = section.bodyPortableText;
  const hasTaggedSecondParagraph = Boolean(
    section.statusLabel && leadBlock && remainingBlocks.length > 0,
  );

  return (
    <OakBox
      as="section"
      $background="bg-primary"
      $ph={["spacing-24", "spacing-40"]}
      $pv={["spacing-32", "spacing-32", "spacing-40"]}
      aria-labelledby={headingId}
      data-insights-module="guidance-introduction"
    >
      <SectionMaxWidth $mh="auto">
        <OakGrid
          $cg={["spacing-0", "spacing-32", "spacing-40"]}
          $rg={["spacing-20", "spacing-20", "spacing-40"]}
        >
          <OakGridArea $colSpan={[12, 7]} $colStart={[1, 6, 5]} $rowStart={1}>
            <OakHeading id={headingId} tag="h2" $font="heading-5">
              <OakBox as="span" $display={["inline", "inline", "none"]}>
                This term, you’ll find:
              </OakBox>
              <OakBox as="span" $display={["none", "none", "inline"]}>
                {section.heading}
              </OakBox>
            </OakHeading>
          </OakGridArea>
          <OakGridArea
            $colSpan={[12, 5, 4]}
            $colStart={1}
            $rowStart={[2, 1]}
            $rowSpan={[1, 2]}
          >
            <OakBox
              $width="100%"
              $maxWidth={["100%", "spacing-360"]}
              $aspectRatio="3 / 2"
              $overflow="hidden"
              $ba="border-solid-m"
              $borderColor="border-primary"
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
          <OakGridArea
            $colSpan={[12, 7]}
            $colStart={[1, 6, 5]}
            $rowStart={[3, 2]}
          >
            <OakFlex $flexDirection="column" $gap="spacing-24">
              {hasTaggedSecondParagraph ? (
                <>
                  <PortableTextWithDefaults
                    value={[leadBlock]}
                    components={guidancePortableTextComponents}
                  />
                  <GuidanceTaggedParagraph>
                    <GuidanceStatusLabel label={section.statusLabel!} />
                    <PortableTextWithDefaults
                      value={remainingBlocks}
                      components={guidancePortableTextComponents}
                    />
                  </GuidanceTaggedParagraph>
                </>
              ) : (
                <>
                  <PortableTextWithDefaults
                    value={section.bodyPortableText}
                    components={guidancePortableTextComponents}
                  />
                  {section.statusLabel ? (
                    <GuidanceStatusLabel label={section.statusLabel} />
                  ) : null}
                </>
              )}
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </SectionMaxWidth>
    </OakBox>
  );
};
