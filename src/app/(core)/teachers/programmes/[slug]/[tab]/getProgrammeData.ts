import curriculumApi2023, {
  CurriculumPhaseOptions,
  CurriculumUnit,
  CurriculumUnitsTabData,
  type ExamboardFilterDimension,
} from "@/node-lib/curriculum-api-2023";
import { cacheData, CURRICULUM_API_CACHE_TAG } from "@/node-lib/cache";
import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";
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

const getCachedCurriculumSequenceFilterDimensions = cacheData(
  async (subjectSlug: string, phaseSlug: string, examBoardSlugsKey: string) =>
    curriculumApi2023.curriculumSequenceFilterDimensions({
      subjectSlug,
      phaseSlug,
      examBoardSlugs: examBoardSlugsKey.split(",").filter(Boolean),
      includeNonCurriculum: true,
    }),
  [PAGE_KEY, "curriculum-sequence-filter-dimensions"],
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

export async function getProgrammeData(subjectPhaseSlug: string) {
  const subjectPhaseKeystageSlugs = parseSubjectPhaseSlug(subjectPhaseSlug);

  if (!subjectPhaseKeystageSlugs) {
    return null;
  }

  // We exclude core units when the ks4 option is not core
  // TD: after the integrated journey launches we should make this the default in the query
  const excludeCoreUnits = subjectPhaseKeystageSlugs.ks4OptionSlug !== "core";

  const fetchExamboardFilterDimensions = async (): Promise<
    Record<string, ExamboardFilterDimension>
  > => {
    if (subjectPhaseKeystageSlugs.phaseSlug !== "secondary") {
      return {};
    }

    const originalSubjects = await getCachedCurriculumPhaseOptions();
    let subjects = filterValidCurriculumPhaseOptions(originalSubjects);
    if (excludeCoreUnits) {
      subjects = excludeCoreFromSubjects(subjects);
    }

    const ks4Options =
      subjects.find(
        (subject) => subject.slug === subjectPhaseKeystageSlugs.subjectSlug,
      )?.ks4_options ?? [];
    const examBoardSlugs = getExamBoardSlugsFromKs4Options(ks4Options);

    if (examBoardSlugs.length === 0) {
      return {};
    }

    return getCachedCurriculumSequenceFilterDimensions(
      subjectPhaseKeystageSlugs.subjectSlug,
      subjectPhaseKeystageSlugs.phaseSlug,
      examBoardSlugs.slice().sort().join(","),
    );
  };

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
      fetchExamboardFilterDimensions(),
    ]);

  // Sort units to have examboard versions first, then by unit order
  curriculumUnitsData.units = sortUnits(curriculumUnitsData.units);

  return {
    programmeUnitsData,
    curriculumUnitsData,
    examboardFilterDimensions,
  };
}

export function getExamBoardSlugsFromKs4Options(
  ks4Options: { slug: string }[],
): string[] {
  return ks4Options
    .map((option) => option.slug)
    .filter((slug) => isExamboardSlug(slug));
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
