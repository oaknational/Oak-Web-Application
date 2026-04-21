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
  shouldPrefixSubjectCategoryWithSubject: boolean;
};

type SubjectTitleContext = {
  // Original and display formatted subject names used by different rules.
  subjectTitle: string;
  formattedSubjectTitle: string;

  // Controls English style "Subject Category" heading construction.
  shouldPrefixSubjectCategoryWithSubject: boolean;
  subjectCategorySeparator: string;

  // Visibility of filters in the current data/filter state.
  childSubjectsDisplayed: boolean;
  subjectCategoriesDisplayed: boolean;

  // Whether each filter is narrowed to a single value.
  hasSingleChildSubject: boolean;
  hasSingleSubjectCategory: boolean;

  // Resolved entities/slugs for single value selections.
  childSubject?: ReturnType<typeof childSubjectForFilter>;
  subjectCategory?: ReturnType<typeof subjectCategoryForFilter>;
  childSubjectSlug?: string;
  subjectCategorySlug?: string;

  // Human readable category title to surface in headings, excluding "all".
  selectedSubjectCategoryTitle?: string;

  // Common override title (e.g. Swimming and water safety for PE), if available.
  sharedGroupAsTitle: string | null;
};

/**
 * Checks if all the given key stages are secondary.
 */
function isAllSecondary(keyStages: string[]): boolean {
  if (keyStages.length === 0) return false;

  return keyStages.every(
    (keyStage) => keyStage === "ks3" || keyStage === "ks4",
  );
}

/**
 * Gets the common groupAs override title for the given units and filters.
 * This is used for swimming units.
 */
function getSharedGroupAsTitle(
  data: CurriculumUnitsFormattedData,
  selectedYears: string[],
): string | null {
  const groupAsValues = selectedYears
    .map((year) => data.yearData[year]?.groupAs)
    .filter((groupAs): groupAs is string => Boolean(groupAs));

  if (groupAsValues.length !== selectedYears.length) {
    return null;
  }

  const [firstGroupAs] = groupAsValues;
  if (!firstGroupAs) {
    return null;
  }

  const allShareGroupAs = groupAsValues.every(
    (groupAs) => groupAs === firstGroupAs,
  );

  return allShareGroupAs ? firstGroupAs : null;
}

function buildSubjectTitleContext(
  subjectTitle: string,
  data: CurriculumUnitsFormattedData,
  filters: CurriculumFilters,
): SubjectTitleContext {
  const formattedSubjectTitle = upperFirst(subjectTitle);
  const selectedYears =
    filters.years.length > 0 ? filters.years : data.yearOptions;
  const selectedKeyStages = selectedYears
    .map((year) => data.yearData[year]?.keystage)
    .filter((keyStage): keyStage is string => Boolean(keyStage));
  // We're not using ":" for secondary English, only primary
  const subjectCategorySeparator = isAllSecondary(selectedKeyStages)
    ? " "
    : ": ";
  const shouldPrefixSubjectCategoryWithSubject = selectedYears.some((year) =>
    data.yearData[year]?.units.some(
      (unit) =>
        unit.actions?.subject_category_actions?.group_by_subjectcategory,
    ),
  );
  const sharedGroupAsTitle = getSharedGroupAsTitle(data, selectedYears);

  const childSubjectsDisplayed = Boolean(
    shouldDisplayFilter(data, filters, "childSubjects"),
  );
  const subjectCategoriesDisplayed = Boolean(
    shouldDisplayFilter(data, filters, "subjectCategories"),
  );

  const appliedChildSubjects = childSubjectsDisplayed
    ? filters.childSubjects
    : [];
  const appliedSubjectCategories = subjectCategoriesDisplayed
    ? filters.subjectCategories
    : [];

  // I don't think we ever allow multiple selections in the UI but the data allows for it.
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

  return {
    subjectTitle,
    formattedSubjectTitle,
    shouldPrefixSubjectCategoryWithSubject,
    subjectCategorySeparator,
    childSubjectsDisplayed,
    subjectCategoriesDisplayed,
    hasSingleChildSubject,
    hasSingleSubjectCategory,
    childSubject,
    subjectCategory,
    childSubjectSlug,
    subjectCategorySlug,
    selectedSubjectCategoryTitle,
    sharedGroupAsTitle,
  };
}

function createSubjectWithCategoryTitle(ctx: SubjectTitleContext) {
  return `${ctx.formattedSubjectTitle}${ctx.subjectCategorySeparator}${ctx.selectedSubjectCategoryTitle}`;
}

function createDefaultSubjectTitleSelection(
  ctx: SubjectTitleContext,
): SubjectTitleSelection {
  return {
    title: ctx.formattedSubjectTitle,
    shouldPrefixSubjectCategoryWithSubject:
      ctx.shouldPrefixSubjectCategoryWithSubject,
  };
}

// Highest-priority override: use shared groupAs title when all selected years agree.
function selectionForSharedGroupAs(
  ctx: SubjectTitleContext,
): SubjectTitleSelection | null {
  if (!ctx.sharedGroupAsTitle) {
    return null;
  }

  return {
    title: ctx.sharedGroupAsTitle,
    shouldPrefixSubjectCategoryWithSubject:
      ctx.shouldPrefixSubjectCategoryWithSubject,
  };
}

// Handles explicit "all" category selection by reverting to the formatted base subject title.
function selectionForAllSubjectCategory(
  ctx: SubjectTitleContext,
): SubjectTitleSelection | null {
  if (!ctx.subjectCategoriesDisplayed || ctx.subjectCategorySlug !== "all") {
    return null;
  }

  return {
    title: ctx.formattedSubjectTitle,
    shouldPrefixSubjectCategoryWithSubject:
      ctx.shouldPrefixSubjectCategoryWithSubject,
  };
}

// Resolves the most constrained state where both filters are visible and have a single selected value.
function selectionForSingleChildAndCategory(
  ctx: SubjectTitleContext,
): SubjectTitleSelection | null {
  const hasSingleFiltersDisplayed =
    ctx.hasSingleChildSubject &&
    ctx.hasSingleSubjectCategory &&
    ctx.childSubjectsDisplayed &&
    ctx.subjectCategoriesDisplayed;

  if (!hasSingleFiltersDisplayed) {
    return null;
  }

  if (
    ctx.childSubject &&
    ctx.subjectCategory &&
    ctx.childSubjectSlug === ctx.subjectCategorySlug
  ) {
    return {
      title: ctx.childSubject.subject,
      shouldPrefixSubjectCategoryWithSubject:
        ctx.shouldPrefixSubjectCategoryWithSubject,
    };
  }

  if (
    ctx.shouldPrefixSubjectCategoryWithSubject &&
    ctx.selectedSubjectCategoryTitle
  ) {
    return {
      title: createSubjectWithCategoryTitle(ctx),
      shouldPrefixSubjectCategoryWithSubject:
        ctx.shouldPrefixSubjectCategoryWithSubject,
    };
  }

  return createDefaultSubjectTitleSelection(ctx);
}

// Applies when child subjects are hidden, making category the most specific visible label.
function selectionForHiddenChildSubjects(
  ctx: SubjectTitleContext,
): SubjectTitleSelection | null {
  if (ctx.childSubjectsDisplayed || !ctx.selectedSubjectCategoryTitle) {
    return null;
  }

  if (ctx.shouldPrefixSubjectCategoryWithSubject) {
    return {
      title: createSubjectWithCategoryTitle(ctx),
      shouldPrefixSubjectCategoryWithSubject:
        ctx.shouldPrefixSubjectCategoryWithSubject,
    };
  }

  return {
    title: ctx.selectedSubjectCategoryTitle,
    shouldPrefixSubjectCategoryWithSubject:
      ctx.shouldPrefixSubjectCategoryWithSubject,
  };
}

// Applies when categories are hidden and a child subject is the most specific visible label.
function selectionForHiddenSubjectCategories(
  ctx: SubjectTitleContext,
): SubjectTitleSelection | null {
  if (
    ctx.subjectCategoriesDisplayed ||
    !ctx.childSubjectsDisplayed ||
    !ctx.childSubject
  ) {
    return null;
  }

  return {
    title: ctx.childSubject.subject,
    shouldPrefixSubjectCategoryWithSubject:
      ctx.shouldPrefixSubjectCategoryWithSubject,
  };
}

/**
 * Resolves the most specific subject title selection for the given context in order of precedence.
 */
function resolveSubjectTitleSelection(
  ctx: SubjectTitleContext,
): SubjectTitleSelection {
  const sharedGroupAsSelection = selectionForSharedGroupAs(ctx);
  if (sharedGroupAsSelection) return sharedGroupAsSelection;

  const allSubjectCategorySelection = selectionForAllSubjectCategory(ctx);
  if (allSubjectCategorySelection) return allSubjectCategorySelection;

  const singleChildAndCategorySelection =
    selectionForSingleChildAndCategory(ctx);
  if (singleChildAndCategorySelection) return singleChildAndCategorySelection;

  const hiddenChildSubjectsSelection = selectionForHiddenChildSubjects(ctx);
  if (hiddenChildSubjectsSelection) return hiddenChildSubjectsSelection;

  const hiddenSubjectCategoriesSelection =
    selectionForHiddenSubjectCategories(ctx);
  if (hiddenSubjectCategoriesSelection) return hiddenSubjectCategoriesSelection;

  return createDefaultSubjectTitleSelection(ctx);
}

function getSubjectTitleSelection(
  subjectTitle: string,
  data: CurriculumUnitsFormattedData,
  filters: CurriculumFilters,
): SubjectTitleSelection {
  const context = buildSubjectTitleContext(subjectTitle, data, filters);
  return resolveSubjectTitleSelection(context);
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

/**
 * Builds a programme heading for the given units and filters.
 */
export function buildProgrammeHeading({
  subjectTitle,
  data,
  filters,
  phaseTitle,
  schoolYear,
  keyStage,
  examboardTitle,
}: BuildProgrammeHeadingArgs): string {
  const { title: selectedSubjectTitle } = getSubjectTitleSelection(
    subjectTitle,
    data,
    filters,
  );
  const isKs4SchoolYear = schoolYear === "10" || schoolYear === "11";

  const parts: Array<string | undefined> = [selectedSubjectTitle];

  if (schoolYear) {
    if (schoolYear === "all-years") {
      parts.push("(all years)");
    } else {
      parts.push(`year ${schoolYear}`);
    }

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
