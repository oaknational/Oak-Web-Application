import {
  buildKs4OptionFilterDimensions,
  type Ks4OptionFilterDimension,
} from "./buildKs4OptionFilterDimensions";
import { getFileSizes } from "./Components/getFileSizes";

import curriculumApi2023, {
  CurriculumPhaseOptions,
  CurriculumUnit,
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";
import { applyCachePolicy, CURRICULUM_API_CACHE_TAG } from "@/node-lib/cache";
import {
  parseSubjectPhaseSlug,
  type CurriculumSelectionSlugs,
} from "@/utils/curriculum/slugs";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { BrowseFilters } from "@/context/BrowseFilters/types";
import { scopeYearsToKeystageFilter } from "@/utils/curriculum/filtering";
const PAGE_KEY = "programme-page-data";

export async function getCachedFileSizes(
  subjectPhaseKeystageSlugs: Parameters<typeof getFileSizes>[0],
  curriculumDownloadsTabData: Parameters<typeof getFileSizes>[1],
) {
  "use cache";
  applyCachePolicy({ tags: [PAGE_KEY, CURRICULUM_API_CACHE_TAG] });

  return getFileSizes(subjectPhaseKeystageSlugs, curriculumDownloadsTabData);
}

async function getCachedCurriculumPhaseOptions() {
  "use cache";
  applyCachePolicy({ tags: [PAGE_KEY, CURRICULUM_API_CACHE_TAG] });

  return curriculumApi2023.curriculumPhaseOptions({
    includeNonCurriculum: true,
  });
}

async function getCachedCurriculumOverview(
  subjectSlug: string,
  phaseSlug: string,
) {
  "use cache";
  applyCachePolicy({ tags: [PAGE_KEY, CURRICULUM_API_CACHE_TAG] });

  return curriculumApi2023.curriculumOverview({
    subjectSlug,
    phaseSlug,
    includeNonCurriculum: true,
  });
}

async function getCachedCurriculumSequence(
  subjectSlug: string,
  phaseSlug: string,
  ks4OptionSlug: string | null,
  excludeCoreUnits: boolean,
) {
  "use cache";
  applyCachePolicy({ tags: [PAGE_KEY, CURRICULUM_API_CACHE_TAG] });

  return curriculumApi2023.curriculumSequence({
    subjectSlug,
    phaseSlug,
    ks4OptionSlug,
    includeNonCurriculum: true,
    excludeUnitsWithNoPublishedLessons: true,
    excludeCoreUnits,
  });
}

async function getCachedCurriculumSequenceSlugs(
  subjectSlug: string,
  phaseSlug: string,
) {
  "use cache";
  applyCachePolicy({ tags: [PAGE_KEY, CURRICULUM_API_CACHE_TAG] });

  return curriculumApi2023.curriculumSequenceSlugs({
    subjectSlug,
    phaseSlug,
    includeNonCurriculum: true,
  });
}

// Helper function to sort units consistently
const sortUnits = (units: CurriculumUnit[]): CurriculumUnit[] => {
  const sorted = [...units];
  // Sort units to have examboard versions first
  sorted.sort((a) => {
    if (a.examboard) {
      return -1;
    }
    return 1;
  });
  // Sort by unit order
  sorted.sort((a, b) => a.order - b.order);
  return sorted;
};

export async function getSubjectPhaseOptions(subjectPhaseSlug: string) {
  const subjectPhaseKeystageSlugs = parseSubjectPhaseSlug(subjectPhaseSlug);

  if (!subjectPhaseKeystageSlugs) {
    return null;
  }
  const originalSubjects = await getCachedCurriculumPhaseOptions();
  const subjects = filterValidCurriculumPhaseOptions(originalSubjects);

  return { subjects, subjectPhaseKeystageSlugs };
}

async function getKs4OptionFilterDimensions(
  subjectPhaseKeystageSlugs: CurriculumSelectionSlugs,
  subjects: CurriculumPhaseOptions,
): Promise<Record<string, Ks4OptionFilterDimension>> {
  if (subjectPhaseKeystageSlugs.phaseSlug !== "secondary") {
    return {};
  }

  const ks4Options =
    subjects.find(
      (subject) => subject.slug === subjectPhaseKeystageSlugs.subjectSlug,
    )?.ks4_options ?? [];
  const ks4OptionSlugs = ks4Options.map((option) => option.slug);

  if (ks4OptionSlugs.length === 0) {
    return {};
  }

  const slugUnits = await getCachedCurriculumSequenceSlugs(
    subjectPhaseKeystageSlugs.subjectSlug,
    subjectPhaseKeystageSlugs.phaseSlug,
  );

  return buildKs4OptionFilterDimensions(slugUnits, ks4OptionSlugs);
}

export async function getProgrammeData(
  subjectPhaseSlug: string,
  subjects: CurriculumPhaseOptions,
) {
  const subjectPhaseKeystageSlugs = parseSubjectPhaseSlug(subjectPhaseSlug);

  if (!subjectPhaseKeystageSlugs) {
    return null;
  }

  // We exclude core units when the ks4 option is not core
  // TD: after the integrated journey launches we should make this the default in the query
  const excludeCoreUnits = subjectPhaseKeystageSlugs.ks4OptionSlug !== "core";

  const [programmeUnitsData, curriculumUnitsData, ks4OptionFilterDimensions] =
    await Promise.all([
      getCachedCurriculumOverview(
        subjectPhaseKeystageSlugs.subjectSlug,
        subjectPhaseKeystageSlugs.phaseSlug,
      ),
      getCachedCurriculumSequence(
        subjectPhaseKeystageSlugs.subjectSlug,
        subjectPhaseKeystageSlugs.phaseSlug,
        subjectPhaseKeystageSlugs.ks4OptionSlug,
        excludeCoreUnits,
      ),
      getKs4OptionFilterDimensions(subjectPhaseKeystageSlugs, subjects),
    ]);

  // Sort units to have examboard versions first, then by unit order
  curriculumUnitsData.units = sortUnits(curriculumUnitsData.units);

  return {
    programmeUnitsData,
    curriculumUnitsData,
    ks4OptionFilterDimensions,
  };
}

export const getSubjectOverride = (
  units: CurriculumUnitsTabData["units"],
  resolvedFilter: BrowseFilters,
) => {
  const overrides: string[] = [];
  units.forEach((unit) => {
    const override = unit.actions?.programme_field_overrides?.subject;
    if (override && !overrides.includes(override)) {
      const scopedYearFilters = scopeYearsToKeystageFilter(resolvedFilter);
      if (scopedYearFilters.includes(unit.year)) {
        overrides.push(override);
      }
    }
  });

  if (overrides.length === 1) {
    return overrides[0];
  }
};
