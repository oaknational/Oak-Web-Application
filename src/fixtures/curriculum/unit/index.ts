import { getTitleFromSlug } from "../../shared/helper";

import { Unit } from "@/utils/curriculum/types";

const BASE_UNIT: Unit = {
  connection_prior_unit_description: null,
  connection_future_unit_description: null,
  connection_future_unit_title: null,
  connection_prior_unit_title: null,
  domain: null,
  domain_id: null,
  examboard: null,
  examboard_slug: null,
  planned_number_of_lessons: null,
  phase: "",
  phase_slug: "",
  keystage_slug: "ks2",
  slug: "test",
  title: "Test",
  lessons: [],
  order: 0,
  subject: "Transfiguration",
  subject_slug: "transfiguration",
  subject_parent: null,
  subject_parent_slug: null,
  tier: null,
  tier_slug: null,
  tags: null,
  subjectcategories: null,
  threads: [],
  description: null,
  why_this_why_now: null,
  cycle: "1",
  unit_options: [],
  state: "published",
  year: "5",
};

export function getPhaseTitle(year: string) {
  if (parseInt(year) < 7) {
    return "Primary";
  } else {
    return "Secondary";
  }
}

export function getPhaseSlug(year: string) {
  if (parseInt(year) < 7) {
    return "primary";
  } else {
    return "secondary";
  }
}

let slugTitleUuid = 0;
export function randomSlugTitle() {
  slugTitleUuid++;
  return { slug: `test-${slugTitleUuid}`, title: `Test ${slugTitleUuid}` };
}

export function getKeystageSlug(year: string) {
  const yearNum = parseInt(year);
  if (yearNum <= 2) return "ks1";
  if (yearNum <= 6) return "ks2";
  if (yearNum <= 9) return "ks3";
  return "ks4";
}

export function createUnit(partial: Partial<Unit> = {}) {
  const phase = partial.phase_slug
    ? getTitleFromSlug(partial.phase_slug)
    : getPhaseTitle(partial.year ?? BASE_UNIT.year);
  const phase_slug = getPhaseSlug(partial.year ?? BASE_UNIT.year);
  const keystage_slug = getKeystageSlug(partial.year ?? BASE_UNIT.year);
  const subject_slug = partial.subject_slug ?? BASE_UNIT.subject_slug;
  // TODO: Change unlying MV to use foo_slug / foo_title
  const subject = getTitleFromSlug(subject_slug);
  const title = getTitleFromSlug(partial?.slug);

  return {
    ...BASE_UNIT,
    phase: phase ?? "",
    phase_slug: phase_slug ?? "",
    keystage_slug,
    subject: subject ?? "",
    subject_slug: subject_slug ?? "",
    year: partial.year ?? BASE_UNIT.year,
    ...(title ? { title } : {}),
    ...partial,
  };
}
