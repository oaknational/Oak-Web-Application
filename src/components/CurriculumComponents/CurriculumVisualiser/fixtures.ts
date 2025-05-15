import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { createUnit } from "@/fixtures/curriculum/unit";
import { createTier } from "@/fixtures/curriculum/tier";
import { YearData } from "@/utils/curriculum/types";
import { createPathway } from "@/fixtures/curriculum/pathway";

const subjectCategoryOne = createSubjectCategory({ id: 1, title: "sub-cat-1" });
const subjectCategoryTwo = createSubjectCategory({ id: 2, title: "sub-cat-2" });

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
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "9", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "10": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingUnitsForEntirePhaseFixture = {
  "7": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingUnitsForFirstYearFixture = {
  "7": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "9", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "10": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingUnitsForFirstYearPrimaryFixture = {
  "1": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "1", subjectcategories: [subjectCategoryTwo] })],
  },
  "2": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "2", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "2", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "3": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "3", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "3", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "4": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "4", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "4", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "5": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "5", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "5", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "6": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "6", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "6", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingUnitsForSecondYearFixture = {
  "7": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "9", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "10": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingConsecutiveUnitsAtStartFixture = {
  "7": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
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
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "1", subjectcategories: [subjectCategoryTwo] })],
  },
  "2": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "2", subjectcategories: [subjectCategoryTwo] })],
  },
  "3": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "3", subjectcategories: [subjectCategoryTwo] })],
  },
  "4": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "4", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "4", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "5": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "5", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "5", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "6": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
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
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingConsecutiveUnitsAtEndFixture = {
  "7": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingAlternateUnitsFixture = {
  "7": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

export const missingUnitForLastYearFixture = {
  "7": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "9", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "10": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
  "11": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

// Primary English Fixture

export const primaryEnglishSubjectCategories = [
  createSubjectCategory({ id: 4, title: "Reading, writing & oracy" }),
  createSubjectCategory({ id: 5, title: "Grammar" }),
  createSubjectCategory({ id: 6, title: "Handwriting" }),
  createSubjectCategory({ id: 7, title: "Spelling" }),
  createSubjectCategory({ id: 8, title: "Vocabulary" }),
];

export const primaryEnglishYearData = {
  "1": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [primaryEnglishSubjectCategories[0]],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "1",
        subjectcategories: [primaryEnglishSubjectCategories[0]!],
      }),
    ],
  },
  "2": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [
      primaryEnglishSubjectCategories[0],
      primaryEnglishSubjectCategories[1],
    ],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "2",
        subjectcategories: [primaryEnglishSubjectCategories[0]!],
      }),
      createUnit({
        year: "2",
        subjectcategories: [primaryEnglishSubjectCategories[1]!],
      }),
    ],
  },
  "3": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [
      primaryEnglishSubjectCategories[0],
      primaryEnglishSubjectCategories[1],
      primaryEnglishSubjectCategories[2],
    ],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "3",
        subjectcategories: [primaryEnglishSubjectCategories[0]!],
      }),
      createUnit({
        year: "3",
        subjectcategories: [primaryEnglishSubjectCategories[1]!],
      }),
      createUnit({
        year: "3",
        subjectcategories: [primaryEnglishSubjectCategories[2]!],
      }),
    ],
  },
  "4": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [
      primaryEnglishSubjectCategories[0],
      primaryEnglishSubjectCategories[1],
      primaryEnglishSubjectCategories[2],
      primaryEnglishSubjectCategories[3],
    ],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "4",
        subjectcategories: [primaryEnglishSubjectCategories[0]!],
      }),
      createUnit({
        year: "4",
        subjectcategories: [primaryEnglishSubjectCategories[1]!],
      }),
      createUnit({
        year: "4",
        subjectcategories: [primaryEnglishSubjectCategories[2]!],
      }),
      createUnit({
        year: "4",
        subjectcategories: [primaryEnglishSubjectCategories[3]!],
      }),
    ],
  },
  "5": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [
      primaryEnglishSubjectCategories[0],
      primaryEnglishSubjectCategories[1],
      primaryEnglishSubjectCategories[2],
      primaryEnglishSubjectCategories[3],
      primaryEnglishSubjectCategories[4],
    ],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "5",
        subjectcategories: [primaryEnglishSubjectCategories[0]!],
      }),
      createUnit({
        year: "5",
        subjectcategories: [primaryEnglishSubjectCategories[1]!],
      }),
      createUnit({
        year: "5",
        subjectcategories: [primaryEnglishSubjectCategories[2]!],
      }),
      createUnit({
        year: "5",
        subjectcategories: [primaryEnglishSubjectCategories[3]!],
      }),
      createUnit({
        year: "5",
        subjectcategories: [primaryEnglishSubjectCategories[4]!],
      }),
    ],
  },
  "6": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [
      primaryEnglishSubjectCategories[2],
      primaryEnglishSubjectCategories[3],
      primaryEnglishSubjectCategories[4],
    ],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "6",
        subjectcategories: [primaryEnglishSubjectCategories[2]!],
      }),
      createUnit({
        year: "6",
        subjectcategories: [primaryEnglishSubjectCategories[3]!],
      }),
      createUnit({
        year: "6",
        subjectcategories: [primaryEnglishSubjectCategories[4]!],
      }),
    ],
  },
};

// Primary Science Fixture

export const primaryScienceSubjectCategories = [
  createSubjectCategory({ id: -1, title: "All" }),
  createSubjectCategory({ id: 1, title: "Biology" }),
  createSubjectCategory({ id: 2, title: "Chemistry" }),
  createSubjectCategory({ id: 3, title: "Physics" }),
];

export const primaryScienceYearData = {
  "1": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [primaryScienceSubjectCategories[1]],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "1",
        subjectcategories: [primaryScienceSubjectCategories[1]!],
      }),
    ],
  },
  "2": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [
      primaryScienceSubjectCategories[1],
      primaryScienceSubjectCategories[2],
    ],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "2",
        subjectcategories: [primaryScienceSubjectCategories[1]!],
      }),
      createUnit({
        year: "2",
        subjectcategories: [primaryScienceSubjectCategories[2]!],
      }),
    ],
  },
  "3": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [
      primaryScienceSubjectCategories[1],
      primaryScienceSubjectCategories[2],
      primaryScienceSubjectCategories[3],
    ],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "3",
        subjectcategories: [primaryScienceSubjectCategories[1]!],
      }),
      createUnit({
        year: "3",
        subjectcategories: [primaryScienceSubjectCategories[2]!],
      }),
      createUnit({
        year: "3",
        subjectcategories: [primaryScienceSubjectCategories[3]!],
      }),
    ],
  },
  "4": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [
      primaryScienceSubjectCategories[0],
      primaryScienceSubjectCategories[1],
      primaryScienceSubjectCategories[2],
      primaryScienceSubjectCategories[3],
    ],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "4",
        subjectcategories: [primaryScienceSubjectCategories[0]!],
      }),
      createUnit({
        year: "4",
        subjectcategories: [primaryScienceSubjectCategories[1]!],
      }),
      createUnit({
        year: "4",
        subjectcategories: [primaryScienceSubjectCategories[2]!],
      }),
      createUnit({
        year: "4",
        subjectcategories: [primaryScienceSubjectCategories[3]!],
      }),
    ],
  },
  "5": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [
      primaryScienceSubjectCategories[2],
      primaryScienceSubjectCategories[3],
    ],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "5",
        subjectcategories: [primaryScienceSubjectCategories[2]!],
      }),
      createUnit({
        year: "5",
        subjectcategories: [primaryScienceSubjectCategories[3]!],
      }),
    ],
  },
  "6": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [primaryScienceSubjectCategories[3]],

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "6",
        subjectcategories: [primaryEnglishSubjectCategories[3]!],
      }),
    ],
  },
};

// Secondary Science Fixture

export const tiers = [
  createTier({ tier: "Foundation", tier_slug: "foundation" }),
  createTier({ tier: "Higher", tier_slug: "higher" }),
];

export const pathways = [
  createPathway({ pathway: "Core", pathway_slug: "core" }),
  createPathway({ pathway: "GCSE", pathway_slug: "gcse" }),
];

export const secondaryScienceSubjectCategories = [
  createSubjectCategory({ id: -1, title: "All" }),
  createSubjectCategory({ id: 1, title: "Biology" }),
  createSubjectCategory({ id: 2, title: "Chemistry" }),
  createSubjectCategory({ id: 3, title: "Physics" }),
];

const secondaryScienceChildSubjects = [
  createChildSubject({ subject: "Physics", subject_slug: "physics" }),
  createChildSubject({
    subject: "Combined science",
    subject_slug: "combined-science",
  }),
  createChildSubject({ subject: "Chemistry", subject_slug: "chemistry" }),
  createChildSubject({ subject: "Biology", subject_slug: "biology" }),
];

export const secondaryScienceYearData: YearData = {
  "7": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: secondaryScienceSubjectCategories,

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "7",
        subjectcategories: [secondaryScienceSubjectCategories[1]!],
      }),
      createUnit({
        year: "7",
        subjectcategories: [secondaryScienceSubjectCategories[3]!],
      }),
      createUnit({
        year: "7",
        subjectcategories: [secondaryScienceSubjectCategories[2]!],
      }),
    ],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: secondaryScienceSubjectCategories,

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "8",
        subjectcategories: [secondaryScienceSubjectCategories[1]!],
      }),
      createUnit({
        year: "8",
        subjectcategories: [secondaryScienceSubjectCategories[2]!],
      }),
    ],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: secondaryScienceSubjectCategories,

    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "9",
        subjectcategories: [secondaryScienceSubjectCategories[1]!],
      }),
      createUnit({
        year: "9",
        subjectcategories: [secondaryScienceSubjectCategories[2]!],
      }),
      createUnit({
        year: "9",
        subjectcategories: [secondaryScienceSubjectCategories[3]!],
      }),
    ],
  },
  "10": {
    pathways: [],
    childSubjects: secondaryScienceChildSubjects,
    tiers: [tiers[0]!, tiers[1]!],
    subjectCategories: secondaryScienceSubjectCategories,
    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "10",
        subjectcategories: [secondaryScienceSubjectCategories[1]!],
        tier: tiers[0]?.tier,
        tier_slug: tiers[0]?.tier_slug,
      }),
      createUnit({
        year: "10",
        subjectcategories: [secondaryScienceSubjectCategories[2]!],
        tier: tiers[0]?.tier,
        tier_slug: tiers[0]?.tier_slug,
      }),
      createUnit({
        year: "10",
        subjectcategories: [secondaryScienceSubjectCategories[3]!],
        tier: tiers[0]?.tier,
        tier_slug: tiers[0]?.tier_slug,
      }),
      createUnit({
        year: "10",
        subjectcategories: [secondaryScienceSubjectCategories[3]!],
        tier: tiers[0]?.tier,
        tier_slug: tiers[0]?.tier_slug,
      }),
      createUnit({
        year: "10",
        subjectcategories: [secondaryScienceSubjectCategories[1]!],
        tier: tiers[0]?.tier,
        tier_slug: tiers[0]?.tier_slug,
        subject_slug: "combined-science",
      }),
      createUnit({
        year: "10",
        subjectcategories: [secondaryScienceSubjectCategories[1]!],
        tier: tiers[1]?.tier,
        tier_slug: tiers[1]?.tier_slug,
        subject_slug: "combined-science",
      }),
    ],
  },
  "11": {
    pathways: [],
    childSubjects: secondaryScienceChildSubjects,
    tiers: [tiers[0]!, tiers[1]!],
    subjectCategories: secondaryScienceSubjectCategories,
    groupAs: null,
    isSwimming: false,
    units: [
      createUnit({
        year: "11",
        subjectcategories: [secondaryScienceSubjectCategories[3]!],
        tier: tiers[0]?.tier,
        tier_slug: tiers[0]?.tier_slug,
      }),
      createUnit({
        year: "11",
        subjectcategories: [secondaryScienceSubjectCategories[3]!],
        tier: tiers[1]?.tier,
        tier_slug: tiers[1]?.tier_slug,
      }),
      createUnit({
        year: "11",
        subjectcategories: [secondaryScienceSubjectCategories[1]!],
        tier: tiers[0]?.tier,
        tier_slug: tiers[0]?.tier_slug,
        subject_slug: "combined-science",
      }),
      createUnit({
        year: "11",
        subjectcategories: [secondaryScienceSubjectCategories[1]!],
        tier: tiers[1]?.tier,
        tier_slug: tiers[1]?.tier_slug,
        subject_slug: "combined-science",
      }),
      createUnit({
        year: "11",
        subjectcategories: [secondaryScienceSubjectCategories[2]!],
        tier: tiers[1]?.tier,
        tier_slug: tiers[1]?.tier_slug,
        subject_slug: "combined-science",
      }),
    ],
  },
};

// Secondary Maths Fixture

export const secondaryMathsYearData = {
  "7": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "7" })],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "8" })],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "9" })],
  },
  "10": {
    childSubjects: [],
    pathways: [pathways[0], pathways[1]],
    tiers: [tiers[0], tiers[1]],
    subjectCategories: [],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "10" })],
  },
  "11": {
    childSubjects: [],
    pathways: [pathways[0], pathways[1]],
    tiers: [tiers[0], tiers[1]],
    subjectCategories: [],

    groupAs: null,
    isSwimming: false,
    units: [createUnit({ year: "11" })],
  },
};
