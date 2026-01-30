import React from "react";
import {
  OakBox,
  OakGrid,
  OakGridArea,
  OakImage,
  OakUiRoleToken,
  OakHeading,
  OakTypography,
  OakUL,
  OakLI,
  OakIcon,
} from "@oaknational/oak-components";
import { capitalize } from "lodash";

import { getSubjectHeroImageUrl, SubjectName } from "./getSubjectHeroImageUrl";

import { CurriculumFilters } from "@/utils/curriculum/types";
import { shouldDisplayFilter } from "@/utils/curriculum/filtering";
import {
  childSubjectForFilter,
  subjectCategoryForFilter,
} from "@/utils/curriculum/filteringApp";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";

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
   * The title of the examboard of the programme.
   *
   * E.g 'AQA'
   */
  examboardTitle?: string;
  /**
   * Key stage
   */
  keyStage?: "ks1" | "ks2" | "ks3" | "ks4";
  /**
   * School year
   *
   * E.g '7'
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
  background?: Extract<OakUiRoleToken, `bg-decorative${number}-main`>;
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
  examboardTitle,
  schoolYear,
  keyStage,
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
            {getProgrammeTitle(
              subjectTitle,
              phaseTitle,
              schoolYear,
              keyStage,
              examboardTitle,
            )}
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

/**
 * Picks a subject title from filters based on childSubjects and subjectCategories.
 * Returns the selected value if exactly one filter is active, otherwise null.
 */
export function pickSubjectTitleFromFilters(
  data: CurriculumUnitsFormattedData,
  filters: CurriculumFilters,
): string | null {
  const childSubjectsDisplayed = shouldDisplayFilter(
    data,
    filters,
    "childSubjects",
  );
  const subjectCategoriesDisplayed = shouldDisplayFilter(
    data,
    filters,
    "subjectCategories",
  );

  // Filters can be present even when they are not applied. If the UI is hiding
  // a filter, ignore its value entirely for our purposes.
  const appliedChildSubjects = childSubjectsDisplayed
    ? filters.childSubjects
    : [];
  const appliedSubjectCategories = subjectCategoriesDisplayed
    ? filters.subjectCategories
    : [];

  // Only proceed if exactly one filter is selected in each category
  const hasSingleChildSubject = appliedChildSubjects.length === 1;
  const hasSingleSubjectCategory = appliedSubjectCategories.length === 1;

  // Get the actual objects from data (returns undefined if not found or empty)
  const childSubject = hasSingleChildSubject
    ? childSubjectForFilter(data, filters)
    : undefined;
  const subjectCategory = hasSingleSubjectCategory
    ? subjectCategoryForFilter(data, filters)
    : undefined;

  const childSubjectSlug = childSubject?.subject_slug;
  const subjectCategorySlug = subjectCategory?.slug;

  // When subjectCategoriesDisplayed and subjectCategories === "all" return null
  if (subjectCategoriesDisplayed && subjectCategorySlug === "all") {
    return null;
  }

  // When both filters are displayed and selected, check if they match
  if (
    hasSingleChildSubject &&
    hasSingleSubjectCategory &&
    childSubjectsDisplayed &&
    subjectCategoriesDisplayed
  ) {
    // Both are selected and they match - return childSubject title
    if (
      childSubject &&
      subjectCategory &&
      childSubjectSlug === subjectCategorySlug
    ) {
      return childSubject.subject;
    }
    // Both are selected but don't match - return null
    return null;
  }

  // Return subjectCategory when subjectCategories is the only subject filter displayed
  // and subjectCategory is not "all"
  if (
    !childSubjectsDisplayed &&
    subjectCategoriesDisplayed &&
    subjectCategory &&
    subjectCategorySlug &&
    subjectCategorySlug !== "all"
  ) {
    return subjectCategory.title;
  }

  // Return childSubject title when childSubjects is the only subject filter displayed
  if (!subjectCategoriesDisplayed && childSubjectsDisplayed && childSubject) {
    return childSubject.subject;
  }

  return null;
}

/**
 * Returns the title of the programme
 *
 * Combines the subject title, phase title, school year, key stage, and examboard title into a single string.
 */
function getProgrammeTitle(
  subjectTitle: string,
  phaseTitle: string,
  schoolYear?: string,
  keyStage?: "ks1" | "ks2" | "ks3" | "ks4",
  examboardTitle?: string,
) {
  const parts: Array<string | undefined> = [capitalize(subjectTitle)];

  if (schoolYear) {
    parts.push(`year ${schoolYear}`);

    if (schoolYear === "10" || schoolYear === "11") {
      parts.push(examboardTitle);
    }
  } else if (keyStage) {
    parts.push(keyStage?.toUpperCase());

    if (keyStage === "ks4") {
      parts.push(examboardTitle);
    }
  } else {
    parts.push(phaseTitle?.toLowerCase(), examboardTitle);
  }

  return parts.filter(Boolean).join(" ");
}
