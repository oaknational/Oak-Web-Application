import { groupBy } from "lodash";

import { getSecondUnitSection } from "./units-page-helper";

import { unitBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/unitBrowseData.fixture";

describe("units-page-helper", () => {
  it("show legacy - should create data for secondary section of units correcly", () => {
    const cycle1Data = unitBrowseDataFixture({
      programmeSlug: "maths-secondary-year-10-aqa-core",
    });
    const legacyData = unitBrowseDataFixture({
      programmeSlug: "maths-secondary-year-10-l",
      isLegacy: true,
    });
    const unitsByProgramme = groupBy([cycle1Data, legacyData], "programmeSlug");

    const result = getSecondUnitSection({
      programmeSlug: "maths-secondary-year-10-aqa-core",
      baseSlug: "maths-secondary-year-10",
      tierSlug: null,
      tier: null,
      year: "year 10",
      subject: "maths",
      phase: "secondary",
      unitsByProgramme: unitsByProgramme,
      breadcrumbs: ["Maths", "Year 10"],
    });

    if (!result.units || !result.units[0] || !result.units[0][0]) {
      throw new Error("No units");
    }

    expect(result.units).toHaveLength(1);
    expect(result.units[0][0].programmeSlug).toBe("maths-secondary-year-10-l");
  });
  it("show new - should create data for secondary section of units correcly", () => {
    const cycle1Data = unitBrowseDataFixture({
      programmeSlug: "maths-secondary-year-10",
    });
    const legacyData = unitBrowseDataFixture({
      programmeSlug: "maths-secondary-year-10-l",
      isLegacy: true,
    });

    const unitsByProgramme = groupBy([cycle1Data, legacyData], "programmeSlug");

    const result = getSecondUnitSection({
      programmeSlug: "maths-secondary-year-10-l",
      baseSlug: "maths-secondary-year-10",
      tierSlug: null,
      tier: null,
      year: "year 10",
      subject: "maths",
      phase: "secondary",
      unitsByProgramme: unitsByProgramme,
      breadcrumbs: ["Maths", "Year 10"],
    });

    if (!result.units || !result.units[0] || !result.units[0][0]) {
      throw new Error("No units");
    }

    expect(result.units).toHaveLength(1);
    expect(result.units[0][0].programmeSlug).toBe("maths-secondary-year-10");
  });
  it("show tier based match - should create data for secondary section of units correcly", () => {
    const cycle1Data = unitBrowseDataFixture({
      programmeSlug: "combined-science-secondary-year-10-higher-aqa",
    });
    const legacyData = unitBrowseDataFixture({
      programmeSlug: "combined-science-secondary-year-10-higher-l",
      isLegacy: true,
    });

    const unitsByProgramme = groupBy([cycle1Data, legacyData], "programmeSlug");

    const result = getSecondUnitSection({
      programmeSlug: "combined-science-secondary-year-10-higher-aqa",
      baseSlug: "combined-science-secondary-year-10",
      tierSlug: "higher",
      tier: "Higher",
      year: "year 10",
      subject: "Combined science",
      phase: "secondary",
      unitsByProgramme: unitsByProgramme,
      breadcrumbs: ["Combined science", "Year 10"],
    });

    if (!result.units || !result.units[0] || !result.units[0][0]) {
      throw new Error("No units");
    }

    expect(result.units).toHaveLength(1);
    expect(result.units[0][0].programmeSlug).toBe(
      "combined-science-secondary-year-10-higher-l",
    );
  });
});
