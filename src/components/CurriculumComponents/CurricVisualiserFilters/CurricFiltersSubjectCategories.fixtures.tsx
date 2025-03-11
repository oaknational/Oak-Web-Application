import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createUnit } from "@/fixtures/curriculum/unit";

const subjectCategoryBiology = createSubjectCategory({
  id: 1,
  title: "biology",
});
const subjectCategoryChemistry = createSubjectCategory({
  id: 2,
  title: "chemistry",
});
const subjectCategoryPhysics = createSubjectCategory({
  id: 3,
  title: "physics",
});

export const ks4Setup = {
  yearData: {
    "10": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [
        subjectCategoryBiology,
        subjectCategoryChemistry,
        subjectCategoryPhysics,
      ],
      units: [
        createUnit({
          year: "10",
          subjectcategories: [subjectCategoryBiology],
        }),
        createUnit({
          year: "10",
          subjectcategories: [subjectCategoryChemistry],
        }),
        createUnit({
          year: "10",
          subjectcategories: [subjectCategoryPhysics],
        }),
      ],
    },
    "11": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      units: [createUnit({ year: "2", subjectcategories: [] })],
    },
  },
  threadOptions: [],
  yearOptions: [],
};

export const ks3and4Setup = {
  yearData: {
    "7": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [
        subjectCategoryBiology,
        subjectCategoryChemistry,
        subjectCategoryPhysics,
      ],
      units: [
        createUnit({
          year: "7",
          subjectcategories: [subjectCategoryBiology],
        }),
      ],
    },
    "8": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [
        subjectCategoryBiology,
        subjectCategoryChemistry,
        subjectCategoryPhysics,
      ],
      units: [
        createUnit({
          year: "8",
          subjectcategories: [subjectCategoryBiology],
        }),
      ],
    },
    "9": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [
        subjectCategoryBiology,
        subjectCategoryChemistry,
        subjectCategoryPhysics,
      ],
      units: [
        createUnit({
          year: "9",
          subjectcategories: [subjectCategoryBiology],
        }),
      ],
    },
    "10": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [
        subjectCategoryBiology,
        subjectCategoryChemistry,
        subjectCategoryPhysics,
      ],
      units: [
        createUnit({
          year: "10",
          subjectcategories: [subjectCategoryBiology],
        }),
        createUnit({
          year: "10",
          subjectcategories: [subjectCategoryChemistry],
        }),
        createUnit({
          year: "10",
          subjectcategories: [subjectCategoryPhysics],
        }),
      ],
    },
    "11": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      units: [createUnit({ year: "11", subjectcategories: [] })],
    },
  },
  threadOptions: [],
  yearOptions: [],
};
