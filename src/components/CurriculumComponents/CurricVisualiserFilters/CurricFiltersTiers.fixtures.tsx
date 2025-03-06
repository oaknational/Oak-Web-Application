import { createTier } from "@/fixtures/curriculum/tier";
import { createUnit } from "@/fixtures/curriculum/unit";

const tierFoundation = createTier({ tier_slug: "foundation" });
const tierHigher = createTier({ tier_slug: "higher" });

export const basicSetup = {
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
