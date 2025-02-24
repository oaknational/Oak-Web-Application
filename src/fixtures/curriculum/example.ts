import { createUnit } from "./unit";

import { SubjectCategory } from "@/utils/curriculum/types";

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

export const missingUnitsForFirstYearPrimaryFixture = {
  "1": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [createUnit({ year: "1", subjectcategories: [subjectCategoryTwo] })],
  },
  "2": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "2", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "2", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "3": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "3", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "3", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "4": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "4", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "4", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "5": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "5", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "5", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "6": {
    childSubjects: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    labels: [],
    groupAs: null,
    units: [
      createUnit({ year: "6", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "6", subjectcategories: [subjectCategoryTwo] }),
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

export const missingConsecutiveUnitsAtStartPrimaryFixture = {
  "1": {
    childSubjects: [],
    tiers: [],
    labels: [],
    groupAs: null,
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "1", subjectcategories: [subjectCategoryTwo] })],
  },
  "2": {
    childSubjects: [],
    tiers: [],
    labels: [],
    groupAs: null,
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "2", subjectcategories: [subjectCategoryTwo] })],
  },
  "3": {
    childSubjects: [],
    tiers: [],
    labels: [],
    groupAs: null,
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "3", subjectcategories: [subjectCategoryTwo] })],
  },
  "4": {
    childSubjects: [],
    tiers: [],
    labels: [],
    groupAs: null,
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "4", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "4", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "5": {
    childSubjects: [],
    tiers: [],
    labels: [],
    groupAs: null,
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "5", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "5", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "6": {
    childSubjects: [],
    tiers: [],
    labels: [],
    groupAs: null,
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "6", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "6", subjectcategories: [subjectCategoryTwo] }),
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
