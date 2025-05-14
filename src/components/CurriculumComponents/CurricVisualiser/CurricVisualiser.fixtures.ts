import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { createUnit } from "@/fixtures/curriculum/unit";
import { createTier } from "@/fixtures/curriculum/tier";
import { createYearData } from "@/fixtures/curriculum/yearData";

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
  "7": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "8": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "9": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "9", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "10": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "11": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
};

export const missingUnitsForEntirePhaseFixture = {
  "7": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  }),
  "8": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  }),
  "9": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  }),
  "10": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "11": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
};

export const missingUnitsForFirstYearFixture = {
  "7": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  }),
  "8": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "9": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "9", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "10": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "11": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
};

export const missingUnitsForFirstYearPrimaryFixture = {
  "1": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "1", subjectcategories: [subjectCategoryTwo] })],
  }),
  "2": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "2", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "2", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "3": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "3", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "3", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "4": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "4", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "4", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "5": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "5", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "5", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "6": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "6", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "6", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
};

export const missingUnitsForSecondYearFixture = {
  "7": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "8": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  }),
  "9": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "9", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "10": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "11": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
};

export const missingConsecutiveUnitsAtStartFixture = {
  "7": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  }),
  "8": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  }),
  "9": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  }),
  "10": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "11": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
};

export const missingConsecutiveUnitsAtStartPrimaryFixture = {
  "1": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "1", subjectcategories: [subjectCategoryTwo] })],
  }),
  "2": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "2", subjectcategories: [subjectCategoryTwo] })],
  }),
  "3": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "3", subjectcategories: [subjectCategoryTwo] })],
  }),
  "4": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "4", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "4", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "5": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "5", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "5", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "6": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "6", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "6", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
};

export const missingUnitsInMiddleFixture = {
  "7": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "8": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] })],
  }),
  "9": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  }),
  "10": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "11": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
};

export const missingConsecutiveUnitsAtEndFixture = {
  "7": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "8": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "9": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  }),
  "10": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "11": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
};

export const missingAlternateUnitsFixture = {
  "7": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] })],
  }),
  "8": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "9": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] })],
  }),
  "10": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "11": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
};

export const missingUnitForLastYearFixture = {
  "7": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "7", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "7", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "8": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "8", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "8", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "9": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "9", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "9", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "10": createYearData({
    subjectCategories: [subjectCategoryOne, subjectCategoryTwo],
    units: [
      createUnit({ year: "10", subjectcategories: [subjectCategoryOne] }),
      createUnit({ year: "10", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
  "11": createYearData({
    subjectCategories: [subjectCategoryTwo],
    units: [
      createUnit({ year: "11", subjectcategories: [subjectCategoryTwo] }),
    ],
  }),
};

// Primary English Fixture

export const primaryEnglishSubjectCategories = [
  createSubjectCategory({ id: 4, title: "Reading, writing & oracy" }),
  createSubjectCategory({ id: 5, title: "Grammar" }),
  createSubjectCategory({ id: 6, title: "Handwriting" }),
  createSubjectCategory({ id: 7, title: "Spelling" }),
  createSubjectCategory({ id: 8, title: "Vocabulary" }),
] as const;

export const primaryEnglishYearData = {
  "1": createYearData({
    subjectCategories: [primaryEnglishSubjectCategories[0]],
    units: [
      createUnit({
        year: "1",
        subjectcategories: [primaryEnglishSubjectCategories[0]!],
      }),
    ],
  }),
  "2": createYearData({
    subjectCategories: [
      primaryEnglishSubjectCategories[0],
      primaryEnglishSubjectCategories[1],
    ],
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
  }),
  "3": createYearData({
    subjectCategories: [
      primaryEnglishSubjectCategories[0],
      primaryEnglishSubjectCategories[1],
      primaryEnglishSubjectCategories[2],
    ],
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
  }),
  "4": createYearData({
    subjectCategories: [
      primaryEnglishSubjectCategories[0],
      primaryEnglishSubjectCategories[1],
      primaryEnglishSubjectCategories[2],
      primaryEnglishSubjectCategories[3],
    ],
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
  }),
  "5": createYearData({
    subjectCategories: [
      primaryEnglishSubjectCategories[0],
      primaryEnglishSubjectCategories[1],
      primaryEnglishSubjectCategories[2],
      primaryEnglishSubjectCategories[3],
      primaryEnglishSubjectCategories[4],
    ],
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
  }),
  "6": createYearData({
    subjectCategories: [
      primaryEnglishSubjectCategories[2],
      primaryEnglishSubjectCategories[3],
      primaryEnglishSubjectCategories[4],
    ],
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
  }),
};

// Primary Science Fixture

export const primaryScienceSubjectCategories = [
  createSubjectCategory({ id: -1, title: "All" }),
  createSubjectCategory({ id: 1, title: "Biology" }),
  createSubjectCategory({ id: 2, title: "Chemistry" }),
  createSubjectCategory({ id: 3, title: "Physics" }),
] as const;

export const primaryScienceYearData = {
  "1": createYearData({
    subjectCategories: [primaryScienceSubjectCategories[1]],
    units: [
      createUnit({
        year: "1",
        subjectcategories: [primaryScienceSubjectCategories[1]!],
      }),
    ],
  }),
  "2": createYearData({
    subjectCategories: [
      primaryScienceSubjectCategories[1],
      primaryScienceSubjectCategories[2],
    ],
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
  }),
  "3": createYearData({
    subjectCategories: [
      primaryScienceSubjectCategories[1],
      primaryScienceSubjectCategories[2],
      primaryScienceSubjectCategories[3],
    ],
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
  }),
  "4": createYearData({
    subjectCategories: [
      primaryScienceSubjectCategories[0],
      primaryScienceSubjectCategories[1],
      primaryScienceSubjectCategories[2],
      primaryScienceSubjectCategories[3],
    ],
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
  }),
  "5": createYearData({
    subjectCategories: [
      primaryScienceSubjectCategories[2],
      primaryScienceSubjectCategories[3],
    ],
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
  }),
  "6": createYearData({
    subjectCategories: [primaryScienceSubjectCategories[3]],
    units: [
      createUnit({
        year: "6",
        subjectcategories: [primaryEnglishSubjectCategories[3]!],
      }),
    ],
  }),
};

// Secondary Science Fixture

export const tiers = [
  createTier({ tier: "Foundation", tier_slug: "foundation" }),
  createTier({ tier: "Higher", tier_slug: "higher" }),
] as const;

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

export const secondaryScienceYearData = {
  "7": createYearData({
    subjectCategories: secondaryScienceSubjectCategories,
    units: [
      createUnit({
        year: "7",
        subjectcategories: [secondaryScienceSubjectCategories[1]!],
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
    tiers: [tiers[0], tiers[1]],
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
    ],
  }),
  "11": createYearData({
    childSubjects: secondaryScienceChildSubjects,
    tiers: [tiers[0], tiers[1]],
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
        tier: tiers[0]?.tier,
        tier_slug: tiers[0]?.tier_slug,
      }),
    ],
  }),
};

// Secondary Maths Fixture

export const secondaryMathsYearData = {
  "7": createYearData({}),
  "8": createYearData({}),
  "9": createYearData({}),
  "10": createYearData({
    tiers: [tiers[0], tiers[1]],
  }),
  "11": createYearData({
    tiers: [tiers[0], tiers[1]],
  }),
};
