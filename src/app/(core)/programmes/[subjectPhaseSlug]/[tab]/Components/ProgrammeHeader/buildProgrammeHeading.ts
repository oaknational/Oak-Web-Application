import { upperFirst } from "lodash";

import { CurriculumFilters } from "@/utils/curriculum/types";
import {
  childSubjectForFilter,
  subjectCategoryForFilter,
  shouldDisplayFilter,
} from "@/utils/curriculum/filteringApp";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";

type SubjectTitleSelection = {
  title: string;
  selectedSubjectCategoryTitle?: string;
  shouldPrefixSubjectCategoryWithSubject: boolean;
};

function isAllSeconary(keyStages: string[]): boolean {
  if (keyStages.length === 0) return false;

  return keyStages.every(
    (keyStage) => keyStage === "ks3" || keyStage === "ks4",
  );
}

function getSubjectTitleSelection(
  subjectTitle: string,
  data: CurriculumUnitsFormattedData,
  filters: CurriculumFilters,
): SubjectTitleSelection {
  const formattedSubjectTitle = upperFirst(subjectTitle);
  const selectedYears =
    filters.years.length > 0 ? filters.years : data.yearOptions;
  const selectedKeyStages = selectedYears
    .map((year) => data.yearData[year]?.keystage)
    .filter((keyStage): keyStage is string => Boolean(keyStage));
  // We're not using ":" for secondary English, only primary
  const subjectCategorySeparator = isAllSeconary(selectedKeyStages)
    ? " "
    : ": ";
  const shouldPrefixSubjectCategoryWithSubject = selectedYears.some((year) =>
    data.yearData[year]?.units.some(
      (unit) =>
        unit.actions?.subject_category_actions?.group_by_subjectcategory,
    ),
  );

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

  const appliedChildSubjects = childSubjectsDisplayed
    ? filters.childSubjects
    : [];
  const appliedSubjectCategories = subjectCategoriesDisplayed
    ? filters.subjectCategories
    : [];

  const hasSingleChildSubject = appliedChildSubjects.length === 1;
  const hasSingleSubjectCategory = appliedSubjectCategories.length === 1;

  const childSubject = hasSingleChildSubject
    ? childSubjectForFilter(data, filters)
    : undefined;
  const subjectCategory = hasSingleSubjectCategory
    ? subjectCategoryForFilter(data, filters)
    : undefined;

  const childSubjectSlug = childSubject?.subject_slug;
  const subjectCategorySlug = subjectCategory?.slug;
  const selectedSubjectCategoryTitle =
    subjectCategoriesDisplayed &&
    subjectCategory &&
    subjectCategorySlug &&
    subjectCategorySlug !== "all"
      ? subjectCategory.title
      : undefined;

  if (subjectCategoriesDisplayed && subjectCategorySlug === "all") {
    return {
      title: subjectTitle,
      shouldPrefixSubjectCategoryWithSubject,
    };
  }

  if (
    hasSingleChildSubject &&
    hasSingleSubjectCategory &&
    childSubjectsDisplayed &&
    subjectCategoriesDisplayed
  ) {
    if (
      childSubject &&
      subjectCategory &&
      childSubjectSlug === subjectCategorySlug
    ) {
      return {
        title: childSubject.subject,
        selectedSubjectCategoryTitle,
        shouldPrefixSubjectCategoryWithSubject,
      };
    }

    if (
      shouldPrefixSubjectCategoryWithSubject &&
      selectedSubjectCategoryTitle
    ) {
      return {
        title: `${formattedSubjectTitle}${subjectCategorySeparator}${selectedSubjectCategoryTitle}`,
        selectedSubjectCategoryTitle,
        shouldPrefixSubjectCategoryWithSubject,
      };
    }

    return {
      title: formattedSubjectTitle,
      shouldPrefixSubjectCategoryWithSubject,
    };
  }

  if (!childSubjectsDisplayed && selectedSubjectCategoryTitle) {
    if (shouldPrefixSubjectCategoryWithSubject) {
      return {
        title: `${formattedSubjectTitle}${subjectCategorySeparator}${selectedSubjectCategoryTitle}`,
        selectedSubjectCategoryTitle,
        shouldPrefixSubjectCategoryWithSubject,
      };
    }
    return {
      title: selectedSubjectCategoryTitle,
      selectedSubjectCategoryTitle,
      shouldPrefixSubjectCategoryWithSubject,
    };
  }

  if (!subjectCategoriesDisplayed && childSubjectsDisplayed && childSubject) {
    return {
      title: childSubject.subject,
      shouldPrefixSubjectCategoryWithSubject,
    };
  }

  return {
    title: formattedSubjectTitle,
    shouldPrefixSubjectCategoryWithSubject,
  };
}

type BuildProgrammeHeadingArgs = {
  subjectTitle: string;
  data: CurriculumUnitsFormattedData;
  filters: CurriculumFilters;
  phaseTitle: string;
  schoolYear?: string | null;
  keyStage?: string;
  examboardTitle?: string;
};

export function buildProgrammeHeading({
  subjectTitle,
  data,
  filters,
  phaseTitle,
  schoolYear,
  keyStage,
  examboardTitle,
}: BuildProgrammeHeadingArgs): string {
  const {
    title: selectedSubjectTitle,
    selectedSubjectCategoryTitle,
    shouldPrefixSubjectCategoryWithSubject,
  } = getSubjectTitleSelection(subjectTitle, data, filters);
  const formattedSubjectTitle = upperFirst(subjectTitle);
  const isKs4SchoolYear = schoolYear === "10" || schoolYear === "11";

  if (
    isKs4SchoolYear &&
    shouldPrefixSubjectCategoryWithSubject &&
    selectedSubjectCategoryTitle
  ) {
    return [
      formattedSubjectTitle,
      `Year ${schoolYear}`,
      selectedSubjectCategoryTitle,
      examboardTitle,
    ]
      .filter(Boolean)
      .join(" ");
  }

  const parts: Array<string | undefined> = [selectedSubjectTitle];

  if (schoolYear) {
    parts.push(`year ${schoolYear}`);

    if (isKs4SchoolYear) {
      parts.push(examboardTitle);
    }
  } else if (keyStage) {
    parts.push(keyStage.toUpperCase());

    if (keyStage === "ks4") {
      parts.push(examboardTitle);
    }
  } else {
    parts.push(phaseTitle.toLowerCase(), examboardTitle);
  }

  return parts.filter(Boolean).join(" ");
}
