import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { createUnit } from "@/fixtures/curriculum/unit";
import { createTier } from "@/fixtures/curriculum/tier";
import { YearData } from "@/utils/curriculum/types";
import { createPathway } from "@/fixtures/curriculum/pathway";
import { createYearData } from "@/fixtures/curriculum/yearData";

const subjectCategoryOne = createSubjectCategory({
  id: 1,
  slug: "sub-cat-1",
  title: "sub-cat-1",
});
const subjectCategoryTwo = createSubjectCategory({
  id: 2,
  slug: "sub-cat-2",
  title: "sub-cat-2",
});

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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
    units: [createUnit({ year: "1", subjectcategories: [subjectCategoryTwo] })],
  },
  "2": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "1", subjectcategories: [subjectCategoryTwo] })],
  },
  "2": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "2", subjectcategories: [subjectCategoryTwo] })],
  },
  "3": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "3", subjectcategories: [subjectCategoryTwo] })],
  },
  "4": {
    childSubjects: [],
    pathways: [],
    tiers: [],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
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
    nationalCurriculum: [],
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  },
  "10": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  },
};

// Primary English Fixture

export const primaryEnglishSubjectCategories = [
  createSubjectCategory({
    slug: "reading-writing-and-oracy",
    id: 4,
    title: "Reading, writing & oracy",
  }),
  createSubjectCategory({ slug: "grammar", id: 5, title: "Grammar" }),
  createSubjectCategory({ slug: "handwriting", id: 6, title: "Handwriting" }),
  createSubjectCategory({ slug: "spelling", id: 7, title: "Spelling" }),
  createSubjectCategory({ slug: "vocabulary", id: 8, title: "Vocabulary" }),
];

export const primaryEnglishYearData = {
  "1": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [primaryEnglishSubjectCategories[0]],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
  createSubjectCategory({ slug: "all", id: -1, title: "All" }),
  createSubjectCategory({ slug: "biology", id: 1, title: "Biology" }),
  createSubjectCategory({ slug: "chemistry", id: 2, title: "Chemistry" }),
  createSubjectCategory({ slug: "physics", id: 3, title: "Physics" }),
];

export const primaryScienceYearData = {
  "1": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [primaryScienceSubjectCategories[1]],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
    nationalCurriculum: [],
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
  createSubjectCategory({ slug: "all", id: -1, title: "All" }),
  createSubjectCategory({ slug: "biology", id: 1, title: "Biology" }),
  createSubjectCategory({ slug: "chemistry", id: 2, title: "Chemistry" }),
  createSubjectCategory({ slug: "physics", id: 3, title: "Physics" }),
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
  "7": createYearData({
    subjectCategories: secondaryScienceSubjectCategories,
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
  }),
  "8": createYearData({
    subjectCategories: secondaryScienceSubjectCategories,
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
  }),
  "9": createYearData({
    subjectCategories: secondaryScienceSubjectCategories,
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
  }),
  "10": createYearData({
    childSubjects: secondaryScienceChildSubjects,
    tiers: [tiers[0]!, tiers[1]!],
    subjectCategories: secondaryScienceSubjectCategories,
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
    ],
  }),
  "11": createYearData({
    childSubjects: secondaryScienceChildSubjects,
    tiers: [tiers[0]!, tiers[1]!],
    subjectCategories: secondaryScienceSubjectCategories,
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
  }),
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
    nationalCurriculum: [],
    units: [createUnit({ year: "7" })],
  },
  "8": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
    units: [createUnit({ year: "8" })],
  },
  "9": {
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
    units: [createUnit({ year: "9" })],
  },
  "10": {
    childSubjects: [],
    pathways: [pathways[0], pathways[1]],
    tiers: [tiers[0], tiers[1]],
    subjectCategories: [],

    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
    units: [createUnit({ year: "10" })],
  },
  "11": {
    childSubjects: [],
    pathways: [pathways[0], pathways[1]],
    tiers: [tiers[0], tiers[1]],
    subjectCategories: [],
    groupAs: null,
    isSwimming: false,
    nationalCurriculum: [],
    units: [createUnit({ year: "11" })],
  },
};

export const mockPortableTextBlocks = [
  {
    _key: "097a68d34883",
    markDefs: [],
    children: [
      {
        marks: [],
        text: "Use this KS3 and KS4 Eduqas English curriculum plan to support sequenced teaching in reading, writing and speaking. Aligned to the Eduqas GCSE specification, this curriculum helps pupils develop fluency in analysis and communication through a wide range of texts and topics.",
        _key: "4e7b5921e9960",
        _type: "span",
      },
    ],
    _type: "block",
    style: "normal",
  },
  {
    style: "normal",
    _key: "e068d634bd8e",
    markDefs: [],
    children: [
      {
        _type: "span",
        marks: [],
        text: "Threads like 'non-fiction reading and writing', 'nineteenth century literature', and 'modern literature: identity and community' help track how core skills develop.",
        _key: "f6065a0d8cca0",
      },
    ],
    _type: "block",
  },
  {
    markDefs: [],
    children: [
      {
        _key: "0a798c4db6810",
        _type: "span",
        marks: [],
        text: "Year 7 English curriculum",
      },
    ],
    level: 1,
    _type: "block",
    style: "normal",
    _key: "8657dc8354f7",
    listItem: "bullet",
  },
  {
    style: "normal",
    _key: "57900e2ccbef",
    listItem: "bullet",
    markDefs: [],
    children: [
      {
        _type: "span",
        marks: [],
        text: "Year 8 English curriculum",
        _key: "28dd9ebf1ff4",
      },
    ],
    level: 1,
    _type: "block",
  },
  {
    style: "normal",
    _key: "f1c99f0c129a",
    listItem: "bullet",
    markDefs: [],
    children: [
      {
        _type: "span",
        marks: [],
        text: "Year 9 English curriculum",
        _key: "f32a71948df4",
      },
    ],
    level: 1,
    _type: "block",
  },
  {
    _key: "f54fec9824b3",
    listItem: "bullet",
    markDefs: [],
    children: [
      {
        text: "Year 10 English curriculum",
        _key: "293500634970",
        _type: "span",
        marks: [],
      },
    ],
    level: 1,
    _type: "block",
    style: "normal",
  },
  {
    style: "normal",
    _key: "c250609382a9",
    listItem: "bullet",
    markDefs: [],
    children: [
      {
        _key: "c3ead58b71c7",
        _type: "span",
        marks: [],
        text: "Year 11 English curriculum",
      },
    ],
    level: 1,
    _type: "block",
  },
  {
    _type: "block",
    style: "normal",
    _key: "128990f60e05",
    markDefs: [],
    children: [
      {
        text: "You can find the full lesson resources for KS3 and KS4 Eduqas English and download all the resources you need for free.",
        _key: "c23fc2e02d180",
        _type: "span",
        marks: [],
      },
    ],
  },
];
