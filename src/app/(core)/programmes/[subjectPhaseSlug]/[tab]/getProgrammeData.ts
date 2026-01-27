import { cache } from "react";

import curriculumApi2023, {
  CurriculumUnit,
  type CurriculumApi,
} from "@/node-lib/curriculum-api-2023";
import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";

// Single cached function to fetch all common programme data
// This deduplicates requests between generateMetadata and page component
export const getCachedProgrammeData = cache(
  async (subjectPhaseSlug: string) => {
    return getProgrammeData(curriculumApi2023, subjectPhaseSlug);
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

export async function getProgrammeData(
  curriculumApi2023: CurriculumApi,
  subjectPhaseSlug: string,
) {
  const subjectPhaseKeystageSlugs = parseSubjectPhaseSlug(subjectPhaseSlug);

  if (!subjectPhaseKeystageSlugs) {
    return null;
  }

  const [programmeUnitsData, curriculumUnitsData, subjects] = await Promise.all(
    [
      curriculumApi2023.curriculumOverview({
        subjectSlug: subjectPhaseKeystageSlugs.subjectSlug,
        phaseSlug: subjectPhaseKeystageSlugs.phaseSlug,
      }),
      curriculumApi2023.curriculumSequence(subjectPhaseKeystageSlugs),
      curriculumApi2023.curriculumPhaseOptions(),
    ],
  );

  const curriculumPhaseOptions = {
    subjects: filterValidCurriculumPhaseOptions(subjects),
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
