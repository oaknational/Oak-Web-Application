import { SubjectCategory, Unit } from "@/utils/curriculum/types";

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

function createUnit(partialProps: Partial<Unit> = {}) {
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

const subjectCategoryOne: SubjectCategory = { id: 1, title: "sub-cat-1" };
const subjectCategoryTwo: SubjectCategory = { id: 2, title: "sub-cat-2" };

// Where M is missing unit and U is a present unit
// for that subject category in that year
//
// Test Cases:
//
// Unit(s) exist for subject category in each year of phase = [U, U, U, U, U]
// No units for subject category in entire phase = [M, M, M, M, M]
// Missing unit in first year of phase = [M, U, U, U, U]
// Missing unit in second year of phase = [U, M, U, U, U]
// Missing consecutive units in the beginning of the phase = [U, M, M, U, U]
// Missing unit at the end of the phase = [U, U, U, U, M]
// Missing consecutive units in the end of the phase = [U, U, U, M, M]
// Missing alternate units = [U, M, U, M, U]
// Missing units in the middle of the phase = [U, M, M, U, U]

export const noMissingUnitsFixture = {
  "7": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "8": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "9": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "9", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "10": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingUnitsForEntirePhaseFixture = {
  "7": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  },
  "8": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  },
  "9": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingUnitsForFirstYearFixture = {
  "7": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  },
  "8": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "9": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "9", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "10": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingUnitsForSecondYearFixture = {
  "7": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "8": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  },
  "9": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "9", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "10": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingConsecutiveUnitsAtStartFixture = {
  "7": {
    childSubjects: [],
    tiers: [],
    labels: [],
    groupAs: null,
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  },
  "8": {
    childSubjects: [],
    tiers: [],
    labels: [],
    groupAs: null,
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  },
  "9": {
    childSubjects: [],
    tiers: [],
    labels: [],
    groupAs: null,
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    tiers: [],
    labels: [],
    groupAs: null,
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    tiers: [],
    labels: [],
    groupAs: null,
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingUnitsInMiddleFixture = {
  "7": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "8": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  },
  "9": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingConsecutiveUnitsAtEndFixture = {
  "7": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "8": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "9": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingAlternateUnitsFixture = {
  "7": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  },
  "8": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "9": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingUnitForLastYearFixture = {
  "7": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "8": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "9": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "9", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "10": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const primaryFiltersFixture = {
  childSubjects: [],
  subjectCategories: ["1"],
  tiers: [],
  years: ["1", "2", "3", "4", "5", "6"],
  threads: [],
};

export const secondaryFiltersFixture = {
  childSubjects: [],
  subjectCategories: ["1"],
  tiers: [],
  years: ["7", "8", "9", "10", "11"],
  threads: [],
};
