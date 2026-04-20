"use client";
import React from "react";
import { capitalize } from "lodash";

import { SubjectName, getSubjectHeroImageUrl } from "./getSubjectHeroImageUrl";

import { CurriculumFilters } from "@/utils/curriculum/types";
import {
  childSubjectForFilter,
  subjectCategoryForFilter,
  shouldDisplayFilter,
} from "@/utils/curriculum/filteringApp";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import {
  Header,
  LargeHeaderProps,
} from "@/components/TeacherComponents/Header/Header";

export type ProgrammeHeaderProps = Omit<
  LargeHeaderProps,
  "heading" | "heroImage"
> & {
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
  keyStage?: string;
  /**
   * School year
   *
   * E.g '7'
   */
  schoolYear?: string;
  /**
   * The subject of the programme.
   */
  subject: SubjectName;
};

export const ProgrammeHeader = (props: ProgrammeHeaderProps) => {
  const {
    subject,
    subjectTitle,
    phaseTitle,
    schoolYear,
    keyStage,
    examboardTitle,
  } = props;

  const subjectHeroImage = getSubjectHeroImageUrl(subject);

  return (
    <Header
      {...props}
      heroImage={subjectHeroImage}
      heading={getProgrammeTitle(
        subjectTitle,
        phaseTitle,
        schoolYear,
        keyStage,
        examboardTitle,
      )}
    />
  );
};

/**
 * Picks a subject title from filters based on childSubjects and subjectCategories.
 * Returns the selected value if exactly one filter is active, otherwise subjectTitle.
 */
export function pickSubjectTitleFromFilters(
  defaultSubjectTitle: string,
  data: CurriculumUnitsFormattedData,
  filters: CurriculumFilters,
): string {
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

  // When subjectCategoriesDisplayed and subjectCategories === "all" return default subjectTitle
  if (subjectCategoriesDisplayed && subjectCategorySlug === "all") {
    return defaultSubjectTitle;
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
    // Both are selected but don't match - return default subjectTitle
    return defaultSubjectTitle;
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

  return defaultSubjectTitle;
}

/**
 * Returns the title of the programme
 *
 * Combines the subject title, phase title, school year, key stage, and examboard title into a single string.
 */
function getProgrammeTitle(
  subjectTitle: string,
  phaseTitle: string,
  schoolYear?: string | null,
  keyStage?: string,
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
