import { useMemo } from "react";

import { CurriculumUnitsYearData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { createTeacherProgrammeSlug } from "@/utils/curriculum/slugs";

export const useProgrammeSlugs = ({
  yearData,
}: {
  yearData: CurriculumUnitsYearData;
}) => {
  return useMemo(
    () => [
      ...new Set(
        Object.values(yearData).flatMap(({ units }) =>
          units.map((unit) =>
            createTeacherProgrammeSlug(
              unit,
              unit.examboard_slug,
              unit.tier_slug,
              unit.pathway_slug,
            ),
          ),
        ),
      ),
    ],
    [yearData],
  );
};
