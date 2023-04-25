import { UnitListingData } from "..";

import unitListingFixture from "./unitListing.fixture";

const unitListingWithTiers = (
  partial?: Partial<UnitListingData>
): UnitListingData => {
  return {
    ...unitListingFixture(),
    tiers: [
      {
        tierTitle: "Foundation",
        tierSlug: "foundation",
        unitCount: 3,
        lessonCount: 34,
        tierProgrammeSlug: "maths-secondary-ks4-foundation",
      },
      {
        tierTitle: "Core",
        tierSlug: "core",
        unitCount: 3,
        lessonCount: 38,
        tierProgrammeSlug: "maths-secondary-ks4-core",
      },
      {
        tierTitle: "Higher",
        tierSlug: "higher",
        unitCount: 3,
        lessonCount: 29,
        tierProgrammeSlug: "maths-secondary-ks4-higher",
      },
    ],
    ...partial,
  };
};

export default unitListingWithTiers;
