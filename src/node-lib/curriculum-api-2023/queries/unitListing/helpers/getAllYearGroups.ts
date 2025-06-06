import {
  yearDescriptions,
  yearSlugs,
} from "@oaknational/oak-curriculum-schema";
import { z } from "zod";

import { GroupedUnitsSchema } from "../unitListing.schema";

export type YearGroup = {
  yearTitle: z.infer<typeof yearDescriptions>;
  yearSlug: z.infer<typeof yearSlugs>;
};

export const getAllYearGroups = (units: GroupedUnitsSchema): YearGroup[] => {
  return Array.from(
    units
      .reduce((acc, unit) => {
        const yearTitle = yearDescriptions.parse(unit[0]?.yearTitle);
        const yearSlug = yearSlugs.parse(unit[0]?.year);

        if (yearTitle && yearSlug && !acc.has(yearTitle)) {
          acc.set(yearTitle, {
            yearTitle: yearTitle,
            yearSlug: yearSlug,
          });
        }
        return acc;
      }, new Map<z.infer<typeof yearDescriptions>, YearGroup>())
      .values(),
  );
};
