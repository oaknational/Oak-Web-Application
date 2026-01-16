import React from "react";
import {
  OakBox,
  OakGrid,
  OakGridArea,
  OakImage,
  OakCombinedColorToken,
  OakHeading,
  OakTypography,
  OakUL,
  OakLI,
  OakIcon,
} from "@oaknational/oak-components";

import { getSubjectHeroImageUrl, SubjectName } from "./getSubjectHeroImageUrl";

export type ProgrammeHeaderProps = {
  /**
   * The title of the subject of the programme.
   */
  subjectTitle: string;
  /**
   * The title of the phase of the programme.
   *
   * E.g. 'Primary' or 'Secondary'
   */
  phaseTitle: string;
  /**
   * School year
   *
   */
  schoolYear?: string;
  /**
   * Summary copy for the programme
   */
  summary: React.ReactNode;
  /**
   * Bullet points rendered as a list with a tick icon
   */
  bullets?: React.ReactNode[];
  /**
   * A slot for content that appears above the main content
   *
   * This content will span the full width of the grid. Ideal for breadcrumbs.
   */
  headerSlot?: React.ReactNode;
  /**
   * A slot for content that appears below the main content
   *
   * This content will span the full width of the grid up to the tablet breakpoing and 7 columns from desktop.
   *
   * Ideal for action buttons and links.
   */
  footerSlot?: React.ReactNode;
  /**
   * The subject of the programme.
   */
  subject: SubjectName;
  /**
   * The background color of the programme header. Defaults to transparent.
   */
  background?: Extract<OakCombinedColorToken, `bg-decorative${number}-main`>;
};

/**
 * Header component for programme pages
 *
 * The header slot and footer slot are optional
 *
 * ```
 * Grid layout
 *
 * MOBILE: 12       TABLET: 7, 5                   DESKTOP: 7, 5
 * |-------------|  |-------------|-------------|  |-------------|-------------|
 * | headerSlot  |  | headerSlot  | headerSlot  |  | headerSlot  | headerSlot  |
 * | subjectHero |  | contentArea | subjectHero |  | contentArea | subjectHero |
 * | contentArea |  | footerSlot  | footerSlot  |  | footerSlot  | subjectHero |
 * | footerSlot  |  |-------------|-------------|  |-------------|-------------|
 * |-------------|
 * ```
 */
export const ProgrammeHeader = ({
  subjectTitle,
  phaseTitle,
  schoolYear,
  summary,
  bullets,
  headerSlot,
  footerSlot,
  subject,
  background,
}: ProgrammeHeaderProps) => {
  const subjectHeroImage = getSubjectHeroImageUrl(subject);

  return (
    <OakBox
      $background={background}
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-40", "spacing-64"]}
      $color="text-primary"
    >
      <OakGrid
        $cg="spacing-16"
        $maxWidth="spacing-1280"
        $mh="auto"
        $rg={["spacing-32", "spacing-48"]}
      >
        {headerSlot && (
          <OakGridArea $colSpan={12} $order={1}>
            {headerSlot}
          </OakGridArea>
        )}
        {/* Content area: 7 columns on desktop, full width on mobile */}
        <OakGridArea
          $colSpan={[12, 7]}
          $order={[3, 2]}
          $flexDirection="column"
          $justifyContent="center"
          $gap="spacing-24"
          $textWrap="balance"
        >
          <OakHeading tag="h1" $font={["heading-4", "heading-1"]}>
            {getProgrammeTitle(subjectTitle, phaseTitle, schoolYear)}
          </OakHeading>
          <OakTypography $font="body-2">{summary}</OakTypography>
          {bullets && bullets.length > 0 && (
            <OakUL
              $reset
              $display="flex"
              $flexDirection="column"
              $gap="spacing-12"
            >
              {bullets.map((bullet, index) => (
                <OakLI
                  key={index}
                  $display="flex"
                  $alignItems="center"
                  $gap="spacing-8"
                >
                  <OakIcon
                    iconName="tick"
                    $width="spacing-20"
                    $height="spacing-20"
                    $colorFilter="icon-brand"
                  />
                  {bullet}
                </OakLI>
              ))}
            </OakUL>
          )}
        </OakGridArea>

        {footerSlot && (
          <OakGridArea
            $colSpan={[12, 12, 7]}
            $order={4}
            $flexDirection="column"
          >
            {footerSlot}
          </OakGridArea>
        )}
        {/* Image area: 5 columns on desktop, full width on mobile */}
        <OakGridArea
          $colSpan={[12, 5]}
          $rowSpan={[1, 1, footerSlot ? 2 : 1]}
          $order={[2, 3]}
          $flexDirection="column"
          $alignItems={["center", "flex-start"]}
          $justifyContent="center"
        >
          {subjectHeroImage && (
            <OakImage
              data-testid="subject-hero-image"
              src={subjectHeroImage}
              // alt is empty because the image is decorative and does not need to be described to screen readers
              alt=""
              $width="100%"
              $height="100%"
              $minHeight={["spacing-240", "spacing-360"]}
              $objectFit="contain"
              placeholder="empty"
              unoptimized
            />
          )}
        </OakGridArea>
      </OakGrid>
    </OakBox>
  );
};

function getProgrammeTitle(
  subjectTitle: string,
  phaseTitle: string,
  schoolYear?: string,
) {
  if (schoolYear) {
    return `${subjectTitle} year ${schoolYear}`;
  }

  return `${subjectTitle} ${phaseTitle?.toLowerCase()}`;
}
