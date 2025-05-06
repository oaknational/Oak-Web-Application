import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { createUnit } from "@/fixtures/curriculum/unit";

const childSubjectBiology = createChildSubject({ subject_slug: "biology" });
const childSubjectChemistry = createChildSubject({ subject_slug: "chemistry" });
const childSubjectPhysics = createChildSubject({ subject_slug: "physics" });

export const ks4Setup = {
  yearData: {
    "10": {
      childSubjects: [
        childSubjectBiology,
        childSubjectChemistry,
        childSubjectPhysics,
      ],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      units: [
        createUnit({
          year: "10",
          subjectcategories: [],
          subject_slug: childSubjectBiology.subject_slug,
        }),
        createUnit({
          year: "10",
          subjectcategories: [],
          subject_slug: childSubjectChemistry.subject_slug,
        }),
        createUnit({
          year: "10",
          subjectcategories: [],
          subject_slug: childSubjectPhysics.subject_slug,
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
      childSubjects: [childSubjectBiology],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      units: [
        createUnit({
          year: "7",
          subjectcategories: [],
          subject_slug: childSubjectBiology.subject_slug,
        }),
      ],
    },
    "8": {
      childSubjects: [childSubjectPhysics],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      units: [
        createUnit({
          year: "8",
          subjectcategories: [],
          subject_slug: childSubjectPhysics.subject_slug,
        }),
      ],
    },
    "9": {
      childSubjects: [childSubjectBiology],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      units: [
        createUnit({
          year: "9",
          subjectcategories: [],
          subject_slug: childSubjectBiology.subject_slug,
        }),
      ],
    },
    "10": {
      childSubjects: [
        childSubjectBiology,
        childSubjectChemistry,
        childSubjectPhysics,
      ],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      units: [
        createUnit({
          year: "10",
          subjectcategories: [],
          subject_slug: childSubjectBiology.subject_slug,
        }),
        createUnit({
          year: "10",
          subjectcategories: [],
          subject_slug: childSubjectChemistry.subject_slug,
        }),
        createUnit({
          year: "10",
          subjectcategories: [],
          subject_slug: childSubjectPhysics.subject_slug,
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
