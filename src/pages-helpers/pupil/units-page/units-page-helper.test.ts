import { groupBy } from "lodash";

import { getSecondUnitSection , checkAndExcludeUnitsWithAgeRestrictedLessons } from "./units-page-helper";

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

describe("checkAndExcludeUnitsWithAgeRestrictedLessons", () => {
  it("should filter out units where lessonCount equals ageRestrictedLessonCount", () => {
    const units = [
      unitBrowseDataFixture({ lessonCount: 5, ageRestrictedLessonCount: 5 }),
      unitBrowseDataFixture({ lessonCount: 10, ageRestrictedLessonCount: 3 }),
      unitBrowseDataFixture({ lessonCount: 8, ageRestrictedLessonCount: 8 }),
      unitBrowseDataFixture({ lessonCount: 6, ageRestrictedLessonCount: 0 }),
    ];

    const result = checkAndExcludeUnitsWithAgeRestrictedLessons(units);

    expect(result).toHaveLength(2);
    expect(result.map((u) => u.lessonCount)).toEqual([10, 6]);
    expect(
      result.every((u) => u.lessonCount !== u.ageRestrictedLessonCount),
    ).toBe(true);
  });

  it("should return an empty array when all units have all lessons age restricted", () => {
    const units = [
      unitBrowseDataFixture({ lessonCount: 3, ageRestrictedLessonCount: 3 }),
      unitBrowseDataFixture({ lessonCount: 7, ageRestrictedLessonCount: 7 }),
    ];

    const result = checkAndExcludeUnitsWithAgeRestrictedLessons(units);

    expect(result).toHaveLength(0);
  });

  it("should return all units when none have all lessons age restricted", () => {
    const units = [
      unitBrowseDataFixture({ lessonCount: 5, ageRestrictedLessonCount: 2 }),
      unitBrowseDataFixture({ lessonCount: 10, ageRestrictedLessonCount: 0 }),
    ];

    const result = checkAndExcludeUnitsWithAgeRestrictedLessons(units);

    expect(result).toHaveLength(2);
    expect(result).toEqual(units);
  });
});
