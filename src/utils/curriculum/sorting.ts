import { Actions } from "@oaknational/oak-curriculum-schema";

import { Subject, SubjectCategory, Tier, Unit } from "./types";

type SubjectCategoryActions = {
  subject_category_actions?: {
    default_category_id?: number | null;
  } | null;
};

export function sortYears(a: string, b: string) {
  if (a === "all-years") {
    return -1;
  } else if (b === "all-years") {
    return 1;
  }
  return Number.parseInt(a) - Number.parseInt(b);
}

type SortSubjectCategoriesOnFeaturesReturn = (
  a: Pick<SubjectCategory, "id">,
  b: Pick<SubjectCategory, "id">,
) => number;
type TierSortable = Pick<Tier, "tier_slug">;
type ChildSubjectSortable = Pick<Subject, "subject_slug">;

export function sortSubjectCategoriesOnFeatures(
  actions: (Actions & SubjectCategoryActions) | null,
): SortSubjectCategoriesOnFeaturesReturn {
  const default_category_id =
    actions?.subject_category_actions?.default_category_id ?? -1;
  if (default_category_id > -1) {
    return (a, b) => {
      if (a.id === default_category_id) {
        return -100000;
      } else {
        return a.id - b.id;
      }
    };
  }
  return (a, b) => a.id - b.id;
}

export function sortTiers(a: TierSortable, b: TierSortable) {
  if (a.tier_slug < b.tier_slug) {
    return -1;
  } else if (a.tier_slug > b.tier_slug) {
    return 1;
  } else {
    return 0;
  }
}

export function sortChildSubjects(
  a: ChildSubjectSortable,
  b: ChildSubjectSortable,
) {
  // Special logic we always want combined-science first.
  if (a.subject_slug === "combined-science") return -10;
  if (b.subject_slug === "combined-science") return 10;

  // Alphabetical
  if (a.subject_slug < b.subject_slug) return -1;
  if (a.subject_slug > b.subject_slug) return 1;
  return 0;
}

export function sortUnits(a: Unit, b: Unit) {
  const aYear = Number.parseInt(a.year, 10);
  const bYear = Number.parseInt(b.year, 10);

  // We now have grouped years so we must order by year number and unit order.
  return aYear * 100 + a.order - (bYear * 100 + b.order);
}

function getKs4OptionSortGroup(slug: string) {
  switch (slug) {
    case "gcse":
      return 0;
    case "core":
      return 1;
    default:
      return 2;
  }
}

/**
 * Sorts KS4 options for display, grouping GCSE and core options together and
 * placing exam boards last.
 */
export function sortKs4OptionsForDisplay<
  T extends { slug: string; title: string },
>(ks4Options: T[]): T[] {
  return [...ks4Options].toSorted((a, b) => {
    const groupDiff =
      getKs4OptionSortGroup(a.slug) - getKs4OptionSortGroup(b.slug);

    if (groupDiff !== 0) {
      return groupDiff;
    }

    return a.title.localeCompare(b.title);
  });
}
