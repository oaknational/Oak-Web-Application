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
      nationalCurriculum: [],
      subjectCategories: [],
      units: [createUnit({ year: "10" }), createUnit({ year: "10" })],
    },
    "11": {
      childSubjects: [],
      pathways: [],
      tiers: [],
      groupAs: null,
      isSwimming: false,
      nationalCurriculum: [],
      subjectCategories: [],
      units: [createUnit({ year: "11" })],
    },
  },
  threadOptions: [],
  yearOptions: ["10", "11"],
};
