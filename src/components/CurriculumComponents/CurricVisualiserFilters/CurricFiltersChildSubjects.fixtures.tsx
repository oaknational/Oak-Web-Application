import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { createUnit } from "@/fixtures/curriculum/unit";

const childSubjectBiology = createChildSubject({ subject_slug: "biology" });
const childSubjectChemistry = createChildSubject({ subject_slug: "chemistry" });
const childSubjectPhysics = createChildSubject({ subject_slug: "physics" });

export const basicSetup = {
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
