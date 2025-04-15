import { MutableRefObject } from "react";

import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import curriculumApi2023, {
  CurriculumUnitsTabData,
  CurriculumOverviewMVData,
  CurriculumPhaseOptions,
} from "@/node-lib/curriculum-api-2023";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import {
  Thread,
  Subject,
  Tier,
  Unit,
  SubjectCategory,
} from "@/utils/curriculum/types";
import {
  sortSubjectCategoriesOnFeatures,
  sortUnits,
  sortYears,
} from "@/utils/curriculum/sorting";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { isExamboardSlug } from "@/pages-helpers/pupil/options-pages/options-pages-helpers";

export type CurriculumUnitsYearGroup = {
  units: Unit[];
  childSubjects: Subject[];
  tiers: Tier[];
  subjectCategories: SubjectCategory[];
  ref?: MutableRefObject<HTMLDivElement>;
};

export type Pathway = {
  pathway: string;
  pathway_slug: string;
};

export type CurriculumUnitsYearData<T = Unit> = {
  [key: string]: {
    units: T[];
    childSubjects: Subject[];
    subjectCategories: SubjectCategory[];
    tiers: Tier[];
    pathways: Pathway[];
    isSwimming: boolean;
    groupAs: string | null;
    ref?: MutableRefObject<HTMLDivElement>;
  };
};

export type CurriculumUnitsTrackingData = {
  subjectSlug: string;
  subjectTitle: string;
  phaseSlug: string;
  ks4OptionSlug?: string | null;
  ks4OptionTitle?: string | null;
};

export type CurriculumUnitsFormattedData<T = Unit> = {
  yearData: CurriculumUnitsYearData<T>;
  threadOptions: Thread[];
  yearOptions: string[];
  // initialYearSelection: YearSelection;
};

export type CurriculumInfoPageProps = {
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  curriculumPhaseOptions: SubjectPhasePickerData;
  curriculumOverviewTabData: CurriculumOverviewMVData;
  curriculumOverviewSanityData: CurriculumOverviewSanityData;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
  mvRefreshTime: number;
  curriculumDownloadsTabData: CurriculumDownloadsTierSubjectProps;
};

export const VALID_TABS = ["overview", "units", "downloads"] as const;
export type CurriculumTab = (typeof VALID_TABS)[number];

export type CurriculumDownloadsTierSubjectProps = {
  child_subjects: Subject[];
  tiers: Tier[];
};

export function createThreadOptions(units: Unit[]): Thread[] {
  const threadOptions = [] as Thread[];

  units.forEach((unit: Unit) => {
    // Populate threads object

    unit.threads.forEach((thread) => {
      if (threadOptions.every((to) => to.slug !== thread.slug)) {
        threadOptions.push(thread);
      }
    });
  });

  // Sort threads

  const threadOrders = new Set(threadOptions.map((to) => to.order));
  if (threadOptions.length > threadOrders.size) {
    // In secondary science multiple threads can have the same order value due
    // to multiple subjects (eg biology, chemistry, physics) being shown, so
    // if orders are not unique, sort alphabetically by slug

    threadOptions.sort((a, b) => a.slug.localeCompare(b.slug));
  } else {
    // If orders are unique, use them to sort

    threadOptions.sort((a, b) => a.order - b.order);
  }
  return threadOptions;
}

export function createYearOptions(units: Unit[]): string[] {
  const yearOptions = [] as string[];

  units.forEach((unit: Unit) => {
    // Populate years object
    const year = unit.actions?.programme_field_overrides?.Year ?? unit.year;
    if (yearOptions.every((yo) => yo !== year)) {
      yearOptions.push(year);
    }
  });
  // Sort year data
  yearOptions.sort(sortYears);

  return yearOptions;
}

// export function createInitialYearFilterSelection(
//   yearData: CurriculumUnitsYearData,
//   actions: Actions | null,
// ): YearSelection {
//   const initialYearSelection = {} as YearSelection;
//   Object.keys(yearData).forEach((year) => {
//     const filters = yearData[year];
//     if (!filters) {
//       throw new Error("year filters missing");
//     }
//     filters.tiers.sort((a, b) => a.tier_slug.localeCompare(b.tier_slug));
//     // Sort subject categories
//     filters.subjectCategories
//       .sort((a, b) => a.title.localeCompare(b.title))
//       .sort(sortSubjectCategoriesOnFeatures(actions));

//     const allSubjectCategoryTag: SubjectCategory = { id: -1, title: "All" };
//     // Add an "All" option if there are 2 or more subject categories. Set to -1 id as this shouldn't ever appear in the DB
//     if (!actions?.subject_category_actions?.all_disabled) {
//       if (filters.subjectCategories.length >= 2) {
//         filters.subjectCategories.unshift(allSubjectCategoryTag);
//       }
//     }

//     const subject =
//       filters.childSubjects.find(
//         (s) => s.subject_slug === "combined-science",
//       ) ?? null;
//     const subjectCategory =
//       actions?.subject_category_actions?.all_disabled &&
//       filters.subjectCategories.length > 0
//         ? filters.subjectCategories[0]
//         : allSubjectCategoryTag;
//     initialYearSelection[year] = {
//       subject,
//       subjectCategory,
//       tier: filters.tiers.length ? filters.tiers[0] : null,
//     };
//   });

//   return initialYearSelection;
// }

// Helper function to update filters for year groups
function _updateGroupFilters(
  groupData: CurriculumUnitsYearData[string],
  unit: Unit,
) {
  // Populate list of child subject filter values
  if (
    unit.subject_parent &&
    unit.subject_parent_slug &&
    groupData.childSubjects.every((c) => c.subject_slug !== unit.subject_slug)
  ) {
    groupData.childSubjects.push({
      subject: unit.subject,
      subject_slug: unit.subject_slug,
    });
  }

  // Populate list of tier filter values

  if (
    unit.tier &&
    unit.tier_slug &&
    groupData.tiers.every((t) => t.tier_slug !== unit.tier_slug)
  ) {
    groupData.tiers.push({
      tier: unit.tier,
      tier_slug: unit.tier_slug,
    });
  }

  // Populate list of pathway filter values
  if (
    unit.pathway &&
    unit.pathway_slug &&
    groupData.pathways.every((p) => p.pathway_slug !== unit.pathway_slug)
  ) {
    groupData.pathways.push({
      pathway: unit.pathway,
      pathway_slug: unit.pathway_slug,
    });
  }

  // Populate list of subject category filter values
  unit.subjectcategories?.forEach((subjectCategory) => {
    if (
      groupData.subjectCategories.findIndex(
        (d) => d.id === subjectCategory.id,
      ) === -1
    ) {
      groupData.subjectCategories.push({
        id: subjectCategory.id,
        title: subjectCategory.title,
      });
    }
  });
}

export function createUnitsListingByYear(
  units: Unit[],
): CurriculumUnitsYearData {
  const yearData = {} as CurriculumUnitsYearData;
  const swimmingUnits: Unit[] = [];
  let swimmingGroupAs: string | null = null;

  // Initial unit processing and grouping
  units.forEach((unit: Unit) => {
    const isSwimmingUnit = unit.features?.pe_swimming === true;
    const groupAsOverride = unit.actions?.group_units_as;

    if (isSwimmingUnit || groupAsOverride) {
      swimmingUnits.push(unit);
      if (groupAsOverride && !swimmingGroupAs) {
        swimmingGroupAs = groupAsOverride;
      }
      return;
    }

    // Handling units not requiring special grouping
    const year = unit.actions?.programme_field_overrides?.Year ?? unit.year;

    let currentYearData = yearData[year];
    if (!currentYearData) {
      currentYearData = {
        units: [],
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
        pathways: [],
        isSwimming: false,
        groupAs: null,
      };
      yearData[year] = currentYearData;
    }

    currentYearData.units.push(unit);

    _updateGroupFilters(currentYearData, unit);
  });

  // Processing swimming units
  if (swimmingUnits.length > 0) {
    const swimmingYearKey = "All years";
    const finalGroupAs = swimmingGroupAs ?? "Swimming and water safety";

    yearData[swimmingYearKey] = {
      units: swimmingUnits,
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      pathways: [],
      isSwimming: true,
      groupAs: finalGroupAs,
    };

    const currentSwimmingYearData = yearData[swimmingYearKey]!;

    swimmingUnits.forEach((unit) => {
      _updateGroupFilters(currentSwimmingYearData, unit);
    });
  }

  // Final processing of all year groups
  for (const year of Object.keys(yearData)) {
    const data = yearData[year]!;
    const allSubjectCategoryTag: SubjectCategory = { id: -1, title: "All" };

    // Add an "All" option if there are 2 or more subject categories. Set to -1 id as this shouldn't ever appear in the DB
    const actions = data.units[0]?.actions;

    if (!actions?.subject_category_actions?.all_disabled) {
      if (data.subjectCategories.length >= 2) {
        if (!data.subjectCategories.some((sc) => sc.id === -1)) {
          data.subjectCategories.unshift(allSubjectCategoryTag);
        }
      }
    }
    data.subjectCategories = data.subjectCategories.sort(
      sortSubjectCategoriesOnFeatures(actions),
    );
  }

  // Sort units within each year group
  for (const year of Object.keys(yearData)) {
    yearData[year]!.units = yearData[year]!.units.toSorted(sortUnits);
  }

  return yearData;
}

export function createDownloadsData(
  units: Unit[],
): CurriculumDownloadsTierSubjectProps {
  const tiers: Tier[] = [];
  const child_subjects: Subject[] = [];

  units.forEach((unit: Unit) => {
    // Populate list of child subject filter values
    if (
      unit.subject_parent &&
      unit.subject_parent_slug &&
      child_subjects.every((c) => c.subject_slug !== unit.subject_slug)
    ) {
      child_subjects.push({
        subject: unit.subject,
        subject_slug: unit.subject_slug,
      });
    }

    // Populate list of tier filter values
    if (
      unit.tier &&
      unit.tier_slug &&
      tiers.every((t) => t.tier_slug !== unit.tier_slug)
    ) {
      tiers.push({
        tier: unit.tier,
        tier_slug: unit.tier_slug,
      });
    }
  });

  const sortedChildSubjects = child_subjects.sort((a, b) => {
    if (a.subject_slug === "combined-science") {
      return -1;
    }

    if (b.subject_slug === "combined-science") {
      return 1;
    }

    return a.subject_slug.localeCompare(b.subject_slug, undefined, {
      sensitivity: "base",
    });
  });

  const sortedTiers = tiers.sort((a, b) =>
    a.tier_slug.localeCompare(b.tier_slug, undefined, {
      sensitivity: "base",
    }),
  );
  const downloadsData = {
    child_subjects: sortedChildSubjects,
    tiers: sortedTiers,
  };

  return downloadsData;
}

export function formatCurriculumUnitsData(
  data: CurriculumUnitsTabData,
): CurriculumUnitsFormattedData {
  const { units } = data;
  // const actions = units[0]?.actions;

  // Filtering for tiers, ideally this would be fixed in the MV, but for now we need to filter out here.
  const filteredUnits = units;
  const yearData = createUnitsListingByYear(filteredUnits);
  const threadOptions = createThreadOptions(filteredUnits);
  const yearOptions = createYearOptions(filteredUnits);
  // const initialYearSelection = createInitialYearFilterSelection(
  //   yearData,
  //   actions,
  // );
  const formattedDataCurriculumUnits = {
    yearData,
    threadOptions,
    yearOptions,
    // initialYearSelection,
  };
  return formattedDataCurriculumUnits;
}

export function filterValidCurriculumPhaseOptions(
  subjects: CurriculumPhaseOptions,
) {
  subjects.forEach(({ ks4_options }) => {
    if (
      ks4_options &&
      ks4_options.some(({ slug }: { slug: string }) => isExamboardSlug(slug))
    ) {
      const gcseIndex = ks4_options.findIndex(
        ({ slug }: { slug: string }) => slug === "gcse",
      );
      if (gcseIndex > 0) {
        ks4_options.splice(gcseIndex, 1);
      }
    }
  });
  return subjects;
}

export async function fetchSubjectPhasePickerData() {
  const subjects = await curriculumApi2023.curriculumPhaseOptions();
  return {
    subjects: filterValidCurriculumPhaseOptions(subjects),
  };
}
