import {
  buildExamboardFilterDimensions,
  type ExamboardFilterDimension,
} from "./buildExamboardFilterDimensions";

import curriculumApi2023, {
  CurriculumPhaseOptions,
  CurriculumUnit,
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";
import { cacheData, CURRICULUM_API_CACHE_TAG } from "@/node-lib/cache";
import {
  parseSubjectPhaseSlug,
  type CurriculumSelectionSlugs,
} from "@/utils/curriculum/slugs";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumFilters } from "@/utils/curriculum/types";
import { scopeYearsToKeystageFilter } from "@/utils/curriculum/filtersUrl";
import { isExamboardSlug } from "@/pages-helpers/pupil/options-pages/options-pages-helpers";

const PAGE_KEY = "programme-page-data";

const getCachedCurriculumPhaseOptions = cacheData(
  async () =>
    curriculumApi2023.curriculumPhaseOptions({
      includeNonCurriculum: true,
    }),
  [PAGE_KEY, "curriculum-phase-options"],
  {
    tags: [PAGE_KEY, CURRICULUM_API_CACHE_TAG],
  },
);

const getCachedCurriculumOverview = cacheData(
  async (subjectSlug: string, phaseSlug: string) =>
    curriculumApi2023.curriculumOverview({
      subjectSlug,
      phaseSlug,
      includeNonCurriculum: true,
    }),
  [PAGE_KEY, "curriculum-overview"],
  {
    tags: [PAGE_KEY, CURRICULUM_API_CACHE_TAG],
  },
);

const getCachedCurriculumSequence = cacheData(
  async (
    subjectSlug: string,
    phaseSlug: string,
    ks4OptionSlug: string | null,
    excludeCoreUnits: boolean,
  ) =>
    curriculumApi2023.curriculumSequence({
      subjectSlug,
      phaseSlug,
      ks4OptionSlug,
      includeNonCurriculum: true,
      excludeUnitsWithNoPublishedLessons: true,
      excludeCoreUnits,
    }),
  [PAGE_KEY, "curriculum-sequence"],
  {
    tags: [PAGE_KEY, CURRICULUM_API_CACHE_TAG],
  },
);

const getCachedCurriculumSequenceSlugs = cacheData(
  async (subjectSlug: string, phaseSlug: string) =>
    curriculumApi2023.curriculumSequenceSlugs({
      subjectSlug,
      phaseSlug,
      includeNonCurriculum: true,
    }),
  [PAGE_KEY, "curriculum-sequence-slugs"],
  {
    tags: [PAGE_KEY, CURRICULUM_API_CACHE_TAG],
  },
);

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

const excludeCoreFromSubjects = (subjects: CurriculumPhaseOptions) => {
  return subjects.map((subject) => ({
    ...subject,
    ks4_options:
      subject.ks4_options?.filter(({ slug }) => slug !== "core") ?? null,
  }));
};

export async function getSubjectPhaseOptions(subjectPhaseSlug: string) {
  const subjectPhaseKeystageSlugs = parseSubjectPhaseSlug(subjectPhaseSlug);

  if (!subjectPhaseKeystageSlugs) {
    return null;
  }
  const originalSubjects = await getCachedCurriculumPhaseOptions();
  let subjects = filterValidCurriculumPhaseOptions(originalSubjects);
  // We exclude core units when the ks4 option is not core
  // TD: after the integrated journey launches we should make this the default in the query
  const excludeCoreUnits = subjectPhaseKeystageSlugs.ks4OptionSlug !== "core";
  if (excludeCoreUnits) {
    subjects = excludeCoreFromSubjects(subjects);
  }

  return { subjects, subjectPhaseKeystageSlugs };
}

async function getExamboardFilterDimensions(
  subjectPhaseKeystageSlugs: CurriculumSelectionSlugs,
  subjects: CurriculumPhaseOptions,
): Promise<Record<string, ExamboardFilterDimension>> {
  if (subjectPhaseKeystageSlugs.phaseSlug !== "secondary") {
    return {};
  }

  const ks4Options =
    subjects.find(
      (subject) => subject.slug === subjectPhaseKeystageSlugs.subjectSlug,
    )?.ks4_options ?? [];
  const examBoardSlugs = ks4Options
    .map((option) => option.slug)
    .filter((slug) => isExamboardSlug(slug));

  if (examBoardSlugs.length === 0) {
    return {};
  }

  const slugUnits = await getCachedCurriculumSequenceSlugs(
    subjectPhaseKeystageSlugs.subjectSlug,
    subjectPhaseKeystageSlugs.phaseSlug,
  );

  return buildExamboardFilterDimensions(slugUnits, examBoardSlugs);
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

  const [programmeUnitsData, curriculumUnitsData, examboardFilterDimensions] =
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
      getExamboardFilterDimensions(subjectPhaseKeystageSlugs, subjects),
    ]);

  // Sort units to have examboard versions first, then by unit order
  curriculumUnitsData.units = sortUnits(curriculumUnitsData.units);

  return {
    programmeUnitsData,
    curriculumUnitsData,
    examboardFilterDimensions,
  };
}

export const getSubjectOverride = (
  units: CurriculumUnitsTabData["units"],
  resolvedFilter: CurriculumFilters,
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
