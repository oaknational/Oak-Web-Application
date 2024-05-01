import { getAvailableProgrammeFactor } from "./getAvailableProgrammeFactor";

import { TierData } from "@/components/PupilComponents/BrowseTierSelector";
import { programmeFieldsFixture } from "@/node-lib/curriculum-api-2023/fixtures/programmeFields.fixture";
import {
  ProgrammeFields,
  PupilProgrammeListingData,
} from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";

describe("getAvailableProgrammeFactor", () => {
  const overrides: Partial<ProgrammeFields>[] = [
    {
      tier: "foundation",
      tierSlug: "foundation",
      tierDisplayOrder: 1,
      examboard: "AQA",
      examboardSlug: "aqa",
      examboardDisplayOrder: 1,
    },
    {
      tier: "foundation",
      tierSlug: "foundation",
      tierDisplayOrder: 1,
      examboard: "Edexcel",
      examboardSlug: "edexcel",
      examboardDisplayOrder: 2,
    },
    {
      tier: "core",
      tierSlug: "core",
      tierDisplayOrder: 2,
      examboard: "Edexcel",
      examboardSlug: "edexcel",
      examboardDisplayOrder: 2,
    },
    {
      tier: "core",
      tierSlug: "core",
      tierDisplayOrder: 2,
      examboard: "AQA",
      examboardSlug: "aqa",
      examboardDisplayOrder: 1,
    },
  ];

  const programmeFields = overrides.map((override) =>
    programmeFieldsFixture({ overrides: override }),
  );

  const programmes: PupilProgrammeListingData[] = programmeFields.map(
    (programmeField) => ({
      programmeSlug: "physics-test-slug",
      programmeFields: programmeField,
      yearSlug: "year-11",
    }),
  );

  it("should return unique tiers", () => {
    const result = getAvailableProgrammeFactor({
      programmes,
      factorPrefix: "tier",
    }) as TierData[];

    result.sort(
      (a, b) => (b.tierDisplayOrder ?? 0) - (a.tierDisplayOrder ?? 0),
    );
    expect(result).toEqual([
      {
        tier: "core",
        tierSlug: "core",
        tierDisplayOrder: 2,
      },
      {
        tier: "foundation",
        tierSlug: "foundation",
        tierDisplayOrder: 1,
      },
    ]);
  });

  it("should return unique examboards", () => {
    const result = getAvailableProgrammeFactor({
      programmes,
      factorPrefix: "examboard",
    }) as TierData[];

    expect(result).toEqual([
      {
        examboard: "AQA",
        examboardSlug: "aqa",
        examboardDisplayOrder: 1,
      },
      {
        examboard: "Edexcel",
        examboardSlug: "edexcel",
        examboardDisplayOrder: 2,
      },
    ]);
  });
});
