import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createUnit } from "@/fixtures/curriculum/unit";

const subjectCategoryBiology = createSubjectCategory({
  id: 1,
  slug: "biology",
  title: "biology",
});
const subjectCategoryChemistry = createSubjectCategory({
  id: 2,
  slug: "chemistry",
  title: "chemistry",
});
const subjectCategoryPhysics = createSubjectCategory({
  id: 3,
  slug: "physics",
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
      nationalCurriculum: [],
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
      keystage: "ks4",
    },
    "11": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      nationalCurriculum: [],
      subjectCategories: [],
      units: [createUnit({ year: "2", subjectcategories: [] })],
      keystage: "ks4",
    },
  },
  threadOptions: [],
  yearOptions: [],
  keystages: [],
};

export const ks3and4Setup = {
  yearData: {
    "7": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      nationalCurriculum: [],
      subjectCategories: [subjectCategoryBiology],
      units: [
        createUnit({
          year: "7",
          subjectcategories: [subjectCategoryBiology],
        }),
      ],
      keystage: "ks3",
    },
    "8": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      nationalCurriculum: [],
      subjectCategories: [subjectCategoryBiology],
      units: [
        createUnit({
          year: "8",
          subjectcategories: [subjectCategoryBiology],
        }),
      ],
      keystage: "ks3",
    },
    "9": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      nationalCurriculum: [],
      subjectCategories: [subjectCategoryBiology],
      units: [
        createUnit({
          year: "9",
          subjectcategories: [subjectCategoryBiology],
        }),
      ],
      keystage: "ks3",
    },
    "10": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      nationalCurriculum: [],
      subjectCategories: [
        subjectCategoryBiology,
        subjectCategoryChemistry,
        subjectCategoryPhysics,
      ],
      keystage: "ks4",
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
      nationalCurriculum: [],
      subjectCategories: [],
      units: [createUnit({ year: "11", subjectcategories: [] })],
      keystage: "ks4",
    },
  },
  threadOptions: [],
  yearOptions: [],
  keystages: [],
};
