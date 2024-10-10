import { getAvailableProgrammeFactor } from "./getAvailableProgrammeFactor";

import { programmeFieldsFixture } from "@/node-lib/curriculum-api-2023/fixtures/programmeFields.fixture";
import {
  ProgrammeFields,
  PupilProgrammeListingData,
} from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";

describe("getAvailableProgrammeFactors", () => {
  const overrides: Partial<ProgrammeFields>[] = [
    {
      tier: "foundation",
      tierSlug: "foundation",
      tierDescription: "Foundation",
      tierDisplayOrder: 1,
      examboard: "AQA",
      examboardSlug: "aqa",
      examboardDisplayOrder: 1,
      examboardDescription: null,
    },
    {
      tier: "foundation",
      tierSlug: "foundation",
      tierDescription: "Foundation",
      tierDisplayOrder: 1,
      examboard: "Edexcel",
      examboardSlug: "edexcel",
      examboardDisplayOrder: 2,
      examboardDescription: null,
    },
    {
      tier: "core",
      tierSlug: "core",
      tierDisplayOrder: 2,
      tierDescription: "Core",
      examboard: "Edexcel",
      examboardSlug: "edexcel",
      examboardDisplayOrder: 2,
      examboardDescription: null,
    },
    {
      tier: "core",
      tierSlug: "core",
      tierDisplayOrder: 2,
      tierDescription: "Core",
      examboard: "AQA",
      examboardSlug: "aqa",
      examboardDisplayOrder: 1,
      examboardDescription: null,
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
    });

    result.sort(
      (a, b) => (b.factorDisplayOrder ?? 0) - (a.factorDisplayOrder ?? 0),
    );
    expect(result).toEqual([
      {
        factor: "core",
        factorSlug: "core",
        factorDisplayOrder: 2,
        factorDescription: "Core",
        isLegacy: false,
      },
      {
        factor: "foundation",
        factorSlug: "foundation",
        factorDisplayOrder: 1,
        factorDescription: "Foundation",
        isLegacy: false,
      },
    ]);
  });

  it("should return unique examboards", () => {
    const result = getAvailableProgrammeFactor({
      programmes,
      factorPrefix: "examboard",
    });

    expect(result).toEqual([
      {
        factor: "AQA",
        factorSlug: "aqa",
        factorDisplayOrder: 1,
        factorDescription: null,
        isLegacy: false,
      },
      {
        factor: "Edexcel",
        factorSlug: "edexcel",
        factorDisplayOrder: 2,
        factorDescription: null,
        isLegacy: false,
      },
    ]);
  });
});
