import {
  CurriculumPhaseOptions,
  CurriculumUnit,
  type CurriculumApi,
} from "@/node-lib/curriculum-api-2023";
import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { isExamboardSlug } from "@/pages-helpers/pupil/options-pages/options-pages-helpers";

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

export async function getProgrammeData(
  curriculumApi2023: CurriculumApi,
  subjectPhaseSlug: string,
) {
  const subjectPhaseKeystageSlugs = parseSubjectPhaseSlug(subjectPhaseSlug);

  if (!subjectPhaseKeystageSlugs) {
    return null;
  }

  // We exclude core units when an examboard is selected
  // TD: after the integrated journey launches we should make this the default in the query
  const excludeCoreUnits = isExamboardSlug(
    subjectPhaseKeystageSlugs.ks4OptionSlug,
  );

  const [programmeUnitsData, curriculumUnitsData, originalSubjects] =
    await Promise.all([
      curriculumApi2023.curriculumOverview({
        subjectSlug: subjectPhaseKeystageSlugs.subjectSlug,
        phaseSlug: subjectPhaseKeystageSlugs.phaseSlug,
        includeNonCurriculum: true,
      }),
      curriculumApi2023.curriculumSequence({
        ...subjectPhaseKeystageSlugs,
        includeNonCurriculum: true,
        excludeUnitsWithNoPublishedLessons: true,
        excludeCoreUnits,
      }),
      curriculumApi2023.curriculumPhaseOptions({ includeNonCurriculum: true }),
    ]);

  let subjects = filterValidCurriculumPhaseOptions(originalSubjects);

  if (excludeCoreUnits) {
    subjects = excludeCoreFromSubjects(subjects);
  }

  const curriculumPhaseOptions = {
    subjects,
    tab: "units" as const,
  };

  // Sort units to have examboard versions first, then by unit order
  curriculumUnitsData.units = sortUnits(curriculumUnitsData.units);

  return {
    programmeUnitsData,
    curriculumUnitsData,
    curriculumPhaseOptions,
    subjectPhaseKeystageSlugs,
  };
}
