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
  keystage_slug: "ks3",
  slug: "",
  title: "",
  lessons: [],
  order: 0,
  subject: "English",
  subject_slug: "english",
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
  year: "7",
};

function getPhaseTitle(year: string) {
  if (parseInt(year) < 7) {
    return "Primary";
  } else {
    return "Secondary";
  }
}
function getPhaseSlug(year: string) {
  if (parseInt(year) < 7) {
    return "primary";
  } else {
    return "secondary";
  }
}

let slugTitleUuid = 0;
function randomSlugTitle() {
  slugTitleUuid++;
  return [`test-${slugTitleUuid}`, `Test ${slugTitleUuid}`];
}

function getKeystageSlug(year: string) {
  const yearNum = parseInt(year);
  if (yearNum <= 2) return "ks1";
  if (yearNum <= 6) return "ks2";
  if (yearNum <= 9) return "ks3";
  return "ks4";
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export function createUnit(partialProps: Partial<Unit> = {}) {
  const phase = getPhaseTitle(partialProps.year ?? BASE_UNIT.year);
  const phase_slug = getPhaseSlug(partialProps.year ?? BASE_UNIT.year);
  const keystage_slug = getKeystageSlug(partialProps.year ?? BASE_UNIT.year);
  const [slug, title] = randomSlugTitle();
  const subject = partialProps.subject ?? BASE_UNIT.subject;
  const subject_slug = slugify(subject);

  return {
    ...BASE_UNIT,
    slug,
    title,
    phase,
    phase_slug,
    keystage_slug,
    subject,
    subject_slug,
    year: partialProps.year ?? BASE_UNIT.year,
    ...partialProps,
  };
}
