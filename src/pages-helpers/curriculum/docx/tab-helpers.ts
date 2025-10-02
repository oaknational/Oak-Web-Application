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
  NationalCurriculumCriteria,
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
    nationalCurriculum: NationalCurriculumCriteria[];
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
  // ncOptions: {id: number, title: string}[];
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
      unit.actions?.programme_field_overrides?.year_slug ?? unit.year;
    if (yearOptions.every((yo) => yo !== year)) {
      yearOptions.push(year);
    }
  });
  // Sort year data
  yearOptions.sort(sortYears);

  return yearOptions;
}

export function createUnitsListingByYear(
  units: Unit[],
): CurriculumUnitsYearData {
  const yearData = {} as CurriculumUnitsYearData;

  units.forEach((unit: Unit) => {
    // Check if the yearData object has an entry for the unit's year
    // If not, initialize it with default values

    const year =
      unit.actions?.programme_field_overrides?.year_slug ?? unit.year;

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
        nationalCurriculum: [],
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

    if (unit.national_curriculum_content) {
      for (const cc of unit.national_curriculum_content) {
        if (
          currentYearData.nationalCurriculum.findIndex(
            (icc) => icc.id === cc.id,
          ) === -1
        )
          currentYearData.nationalCurriculum.push({
            id: cc.id,
            title: cc.title,
          });
      }
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
          slug: subjectCategory.slug,
        });
      }
    });
  });

  for (const year of Object.keys(yearData)) {
    const data = yearData[year]!;

    data.isSwimming = data.units[0]?.features?.pe_swimming === true;
    const allSubjectCategoryTag: SubjectCategory = {
      id: -1,
      title: "All",
      slug: "all",
    };
    const actions = data.units[0]?.actions;
    // Add an "All" option if there are 2 or more subject categories. Set to -1 id as this shouldn't ever appear in the DB
    if (!actions?.subject_category_actions?.all_disabled) {
      if (data.subjectCategories.length >= 2) {
        data.subjectCategories.unshift(allSubjectCategoryTag);
      }
    }
    data.subjectCategories = data.subjectCategories.sort(
      sortSubjectCategoriesOnFeatures(actions),
    );

    if (data.units.length > 0) {
      const groupAs = data.units[0]?.actions?.group_units_as;
      if (groupAs) {
        if (
          data.units.every((unit) => unit.actions?.group_units_as === groupAs)
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

// HACK: Set of hacks to solve data issues temporarily
export function frontendHackForUnitIssues(units: Unit[]) {
  return units.filter((unit) => {
    if (unit.subject_slug === "music" && ["10", "11"].includes(unit.year)) {
      return false;
    }
    return true;
  });
}

export function formatCurriculumUnitsData(
  data: CurriculumUnitsTabData,
): CurriculumUnitsFormattedData {
  const { units } = data;

  // Filtering for tiers, ideally this would be fixed in the MV, but for now we need to filter out here.
  const filteredUnits = frontendHackForUnitIssues(units);
  const yearData = createUnitsListingByYear(filteredUnits);
  const threadOptions = createThreadOptions(filteredUnits);
  const yearOptions = createYearOptions(filteredUnits);
  // const ncOptions = createNationalCurriculum(filteredUnits);
  const formattedDataCurriculumUnits = {
    yearData,
    threadOptions,
    yearOptions,
    // ncOptions,
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
    tab: "units" as const,
  };
}
