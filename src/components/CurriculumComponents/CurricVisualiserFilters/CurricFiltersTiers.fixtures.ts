import { createTier } from "@/fixtures/curriculum/tier";
import { createUnit } from "@/fixtures/curriculum/unit";

const tierFoundation = createTier({ tier_slug: "foundation" });
const tierHigher = createTier({ tier_slug: "higher" });

export const ks4Setup = {
  yearData: {
    "10": {
      childSubjects: [],
      pathways: [],
      groupAs: null,
      tiers: [tierFoundation, tierHigher],
      isSwimming: false,
      subjectCategories: [],
      units: [
        createUnit({
          year: "10",
          tier: tierFoundation.tier_slug,
        }),
        createUnit({
          year: "10",
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
      units: [createUnit({ year: "2", threads: [] })],
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
      groupAs: null,
      tiers: [tierFoundation, tierHigher],
      isSwimming: false,
      subjectCategories: [],
      units: [
        createUnit({
          year: "7",
          tier: tierFoundation.tier_slug,
        }),
        createUnit({
          year: "7",
          tier: tierHigher.tier_slug,
        }),
      ],
    },
    "8": {
      childSubjects: [],
      pathways: [],
      groupAs: null,
      tiers: [tierFoundation, tierHigher],
      isSwimming: false,
      subjectCategories: [],
      units: [
        createUnit({
          year: "8",
          tier: tierFoundation.tier_slug,
        }),
        createUnit({
          year: "8",
          tier: tierHigher.tier_slug,
        }),
      ],
    },
    "9": {
      childSubjects: [],
      pathways: [],
      groupAs: null,
      tiers: [tierFoundation, tierHigher],
      isSwimming: false,
      subjectCategories: [],
      units: [
        createUnit({
          year: "9",
          tier: tierFoundation.tier_slug,
        }),
        createUnit({
          year: "9",
          tier: tierHigher.tier_slug,
        }),
      ],
    },
    "10": {
      childSubjects: [],
      pathways: [],
      groupAs: null,
      tiers: [tierFoundation, tierHigher],
      isSwimming: false,
      subjectCategories: [],
      units: [
        createUnit({
          year: "10",
          tier: tierFoundation.tier_slug,
        }),
        createUnit({
          year: "10",
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
      units: [createUnit({ year: "2", threads: [] })],
    },
  },
  threadOptions: [],
  yearOptions: [],
};
