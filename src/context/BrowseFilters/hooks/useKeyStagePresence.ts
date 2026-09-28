import { useMemo } from "react";

import { useBrowseFiltersStore } from "../BrowseFiltersProvider";

import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import {
  byKeyStageSlug,
  presentAtKeyStageSlugs,
} from "@/utils/curriculum/keystage";

/**
 * Derives, from the store's current `yearsForKeystage`, which keystages each
 * filter type is present at - shared so `byKeyStageSlug`/`presentAtKeyStageSlugs`
 * aren't recomputed independently by every filter component.
 */
export function useKeyStagePresence(data: CurriculumUnitsFormattedData) {
  const yearsForKeystage = useBrowseFiltersStore(
    (store) => store.yearsForKeystage,
  );

  return useMemo(() => {
    const keyStageSlugData = byKeyStageSlug(data.yearData);
    const childSubjectsAt = presentAtKeyStageSlugs(
      keyStageSlugData,
      "childSubjects",
      yearsForKeystage,
    );
    const subjectCategoriesAt = presentAtKeyStageSlugs(
      keyStageSlugData,
      "subjectCategories",
      yearsForKeystage,
    ).filter((ks) => !childSubjectsAt.includes(ks));
    const tiersAt = presentAtKeyStageSlugs(
      keyStageSlugData,
      "tiers",
      yearsForKeystage,
    );

    return { childSubjectsAt, subjectCategoriesAt, tiersAt };
  }, [data.yearData, yearsForKeystage]);
}
