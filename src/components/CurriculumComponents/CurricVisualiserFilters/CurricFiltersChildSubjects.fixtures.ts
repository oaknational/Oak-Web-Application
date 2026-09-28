import { subjects, subjectSlugs } from "@oaknational/oak-curriculum-schema";
import z from "zod";

import { createUnit } from "@/fixtures/curriculum/unit";

export type ChildSubject = {
  subject_slug: z.infer<typeof subjectSlugs>;
  subject: z.infer<typeof subjects>;
};

const childSubjectBiology: ChildSubject = {
  subject_slug: "biology",
  subject: "Biology",
};
const childSubjectChemistry: ChildSubject = {
  subject_slug: "chemistry",
  subject: "Chemistry",
};
const childSubjectPhysics: ChildSubject = {
  subject_slug: "physics",
  subject: "Physics",
};

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
