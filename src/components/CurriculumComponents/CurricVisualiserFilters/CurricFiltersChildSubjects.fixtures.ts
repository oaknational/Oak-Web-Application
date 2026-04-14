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
      keystages: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      nationalCurriculum: [],
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
      keystage: "ks4",
    },
    "11": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      keystages: [],
      isSwimming: false,
      subjectCategories: [],
      nationalCurriculum: [],
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
      childSubjects: [childSubjectBiology],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      nationalCurriculum: [],
      units: [
        createUnit({
          year: "7",
          subjectcategories: [],
          subject_slug: childSubjectBiology.subject_slug,
        }),
      ],
      keystage: "ks3",
    },
    "8": {
      childSubjects: [childSubjectPhysics],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      nationalCurriculum: [],
      units: [
        createUnit({
          year: "8",
          subjectcategories: [],
          subject_slug: childSubjectPhysics.subject_slug,
        }),
      ],
      keystage: "ks3",
    },
    "9": {
      childSubjects: [childSubjectBiology],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      nationalCurriculum: [],
      units: [
        createUnit({
          year: "9",
          subjectcategories: [],
          subject_slug: childSubjectBiology.subject_slug,
        }),
      ],
      keystage: "ks3",
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
      nationalCurriculum: [],
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
      keystage: "ks4",
    },
    "11": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      nationalCurriculum: [],
      units: [createUnit({ year: "2", subjectcategories: [] })],
      keystage: "ks4",
    },
  },
  threadOptions: [],
  yearOptions: [],
  keystages: [],
};
