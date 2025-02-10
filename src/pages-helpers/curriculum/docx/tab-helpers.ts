import { MutableRefObject } from "react";
import { isEqual } from "lodash";

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
  YearSelection,
} from "@/utils/curriculum/types";
import { getUnitFeatures, UnitFeatures } from "@/utils/curriculum/features";
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
    labels: string[];
    groupAs: string | null;
    ref?: MutableRefObject<HTMLDivElement>;
  };
};

export type CurriculumUnitsTrackingData = {
  subjectSlug: string;
  subjectTitle: string;
  phaseSlug: string;
  ks4OptionSlug: string | null;
};

export type CurriculumUnitsFormattedData<T = Unit> = {
  yearData: CurriculumUnitsYearData<T>;
  threadOptions: Thread[];
  yearOptions: string[];
  initialYearSelection: YearSelection;
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
    const year =
      getUnitFeatures(unit)?.programmes_fields_overrides?.year ?? unit.year;
    if (yearOptions.every((yo) => yo !== year)) {
      yearOptions.push(year);
    }
  });
  // Sort year data
  yearOptions.sort(sortYears);

  return yearOptions;
}

export function createInitialYearFilterSelection(
  yearData: CurriculumUnitsYearData,
  features: UnitFeatures | null,
): YearSelection {
  const initialYearSelection = {} as YearSelection;
  Object.keys(yearData).forEach((year) => {
    const filters = yearData[year];
    if (!filters) {
      throw new Error("year filters missing");
    }
    filters.tiers.sort((a, b) => a.tier_slug.localeCompare(b.tier_slug));
    // Sort subject categories
    filters.subjectCategories
      .sort((a, b) => a.title.localeCompare(b.title))
      .sort(sortSubjectCategoriesOnFeatures(features));

    const allSubjectCategoryTag: SubjectCategory = { id: -1, title: "All" };
    // Add an "All" option if there are 2 or more subject categories. Set to -1 id as this shouldn't ever appear in the DB
    if (!features?.subjectcategories?.all_disabled) {
      if (filters.subjectCategories.length >= 2) {
        filters.subjectCategories.unshift(allSubjectCategoryTag);
      }
    }

    const subject =
      filters.childSubjects.find(
        (s) => s.subject_slug === "combined-science",
      ) ?? null;
    const subjectCategory =
      features?.subjectcategories?.all_disabled &&
      filters.subjectCategories.length > 0
        ? filters.subjectCategories[0]
        : allSubjectCategoryTag;
    initialYearSelection[year] = {
      subject,
      subjectCategory,
      tier: filters.tiers.length ? filters.tiers[0] : null,
    };
  });

  return initialYearSelection;
}

export function createUnitsListingByYear(
  units: Unit[],
): CurriculumUnitsYearData {
  const yearData = {} as CurriculumUnitsYearData;

  units.forEach((unit: Unit) => {
    // Check if the yearData object has an entry for the unit's year
    // If not, initialize it with default values

    const year =
      getUnitFeatures(unit)?.programmes_fields_overrides?.year ?? unit.year;

    let currentYearData = yearData[year];
    if (!currentYearData) {
      currentYearData = {
        units: [],
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
        pathways: [],
        labels: [],
        groupAs: null,
      };
      yearData[year] = currentYearData;
    }

    // Add the current unit

    currentYearData.units.push(unit);

    // Populate list of child subject filter values
    if (
      unit.subject_parent &&
      unit.subject_parent_slug &&
      currentYearData.childSubjects.every(
        (c) => c.subject_slug !== unit.subject_slug,
      )
    ) {
      currentYearData.childSubjects.push({
        subject: unit.subject,
        subject_slug: unit.subject_slug,
      });
    }

    // Populate list of tier filter values

    if (
      unit.tier &&
      unit.tier_slug &&
      currentYearData.tiers.every((t) => t.tier_slug !== unit.tier_slug)
    ) {
      currentYearData.tiers.push({
        tier: unit.tier,
        tier_slug: unit.tier_slug,
      });
    }

    if (
      unit.pathway &&
      unit.pathway_slug &&
      currentYearData.pathways.every(
        (p) => p.pathway_slug !== unit.pathway_slug,
      )
    ) {
      currentYearData.pathways.push({
        pathway: unit.pathway,
        pathway_slug: unit.pathway_slug,
      });
    }

    // Loop through tags array and populate subject categories.
    unit.subjectcategories?.forEach((subjectCategory) => {
      if (
        currentYearData?.subjectCategories.findIndex(
          (d) => d.id === subjectCategory.id,
        ) === -1
      ) {
        currentYearData.subjectCategories.push({
          id: subjectCategory.id,
          title: subjectCategory.title,
        });
      }
    });
  });

  for (const year of Object.keys(yearData)) {
    const data = yearData[year]!;
    if (data.units.length > 0) {
      const labels = getUnitFeatures(data.units[0]!)?.labels ?? [];
      if (
        data.units.every((unit) =>
          isEqual(getUnitFeatures(unit)?.labels, labels),
        )
      ) {
        data.labels = data.labels.concat(labels);
      }
    }

    if (data.units.length > 0) {
      const groupAs = getUnitFeatures(data.units[0]!)?.group_as;
      if (groupAs) {
        if (
          data.units.every(
            (unit) => getUnitFeatures(unit)?.group_as === groupAs,
          )
        ) {
          data.groupAs = groupAs;
        }
      }
    }
  }

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
  const features = getUnitFeatures(units[0]);
  // Filtering for tiers, ideally this would be fixed in the MV, but for now we need to filter out here.
  const filteredUnits = units;
  const yearData = createUnitsListingByYear(filteredUnits);
  const threadOptions = createThreadOptions(filteredUnits);
  const yearOptions = createYearOptions(filteredUnits);
  const initialYearSelection = createInitialYearFilterSelection(
    yearData,
    features,
  );
  const formattedDataCurriculumUnits = {
    yearData,
    threadOptions,
    yearOptions,
    initialYearSelection,
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
