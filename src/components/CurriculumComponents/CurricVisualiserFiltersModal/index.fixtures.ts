import { CurriculumVisualiserFiltersProps } from "../CurricVisualiserFiltersDesktop";

import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { createUnit } from "@/fixtures/curriculum/unit";
import { createThread } from "@/fixtures/curriculum/thread";
import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createTier } from "@/fixtures/curriculum/tier";

const childSubjectBiology = createChildSubject({ subject_slug: "biology" });
const childSubjectChemistry = createChildSubject({ subject_slug: "chemistry" });
const childSubjectPhysics = createChildSubject({ subject_slug: "physics" });

const subjectCat1 = createSubjectCategory({ title: "test1" });
const subjectCat2 = createSubjectCategory({ title: "test2" });
const subjectCat3 = createSubjectCategory({ title: "test3" });

const tierFoundation = createTier({ tier_slug: "foundation" });
const tierHigher = createTier({ tier_slug: "higher" });

export const basicSetup: CurriculumVisualiserFiltersProps["data"] = {
  yearData: {
    "7": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [subjectCat1, subjectCat2, subjectCat3],
      units: [
        createUnit({
          year: "7",
        }),
        createUnit({
          year: "7",
        }),
        createUnit({
          year: "7",
          subjectcategories: [subjectCat1, subjectCat2, subjectCat3],
        }),
      ],
    },
    "8": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      units: [
        createUnit({
          year: "8",
        }),
        createUnit({
          year: "8",
        }),
        createUnit({
          year: "8",
        }),
      ],
    },
    "9": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      units: [
        createUnit({
          year: "9",
        }),
        createUnit({
          year: "9",
        }),
        createUnit({
          year: "9",
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
      tiers: [tierFoundation, tierHigher],
      groupAs: null,
      isSwimming: false,
      subjectCategories: [],
      units: [
        createUnit({
          year: "10",
          subject_slug: childSubjectBiology.subject_slug,
          tier: tierFoundation.tier_slug,
        }),
        createUnit({
          year: "10",
          subject_slug: childSubjectChemistry.subject_slug,
          tier: tierHigher.tier_slug,
        }),
        createUnit({
          year: "10",
          subject_slug: childSubjectPhysics.subject_slug,
          tier: tierHigher.tier_slug,
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
      units: [
        createUnit({
          year: "11",
        }),
      ],
    },
  },
  threadOptions: [
    createThread({ slug: "test1" }),
    createThread({ slug: "test2" }),
    createThread({ slug: "test3" }),
  ],
  yearOptions: ["7", "8", "9", "10", "11"],
};
