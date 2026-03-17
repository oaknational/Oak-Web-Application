import {
  getAnalyticsBrowseData,
  GetAnalyticsBrowseDataParams,
} from "./getAnalyticsBrowseData";

describe("getAnalyticsBrowseData", () => {
  const baseParams: GetAnalyticsBrowseDataParams = {
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "physical-education",
    subjectTitle: "Physical Education",
    unitSlug: "running-and-jumping",
    unitTitle: "Running and jumping",
    year: "10",
    yearTitle: "Year 10",
    examBoardTitle: null,
    tierTitle: null,
    pathwayTitle: "Foundation",
    lessonSlug: "running-as-a-team",
    lessonName: "Running as a team",
    lessonReleaseDate: "2025-09-29T14:00:00.000Z",
    isLegacy: false,
  };

  it("returns AnalyticsBrowseData with correct structure for new content", () => {
    const result = getAnalyticsBrowseData(baseParams);

    expect(result).toEqual({
      keyStageSlug: "ks4",
      keyStageTitle: "Key stage 4",
      subjectSlug: "physical-education",
      subjectTitle: "Physical Education",
      unitSlug: "running-and-jumping",
      unitName: "Running and jumping",
      lessonSlug: "running-as-a-team",
      lessonName: "Running as a team",
      pathway: "Foundation",
      tierName: null,
      yearGroupName: "Year 10",
      yearGroupSlug: "year-10",
      examBoard: null,
      releaseGroup: "2023",
      phase: "secondary",
      lessonReleaseCohort: "2023-2026",
      lessonReleaseDate: "2025-09-29T14:00:00.000Z",
    });
  });

  it("returns legacy releaseGroup and lessonReleaseCohort when isLegacy is true", () => {
    const result = getAnalyticsBrowseData({
      ...baseParams,
      isLegacy: true,
    });

    expect(result.releaseGroup).toBe("legacy");
    expect(result.lessonReleaseCohort).toBe("2020-2023");
  });

  it("returns primary phase for primary key stages", () => {
    const result = getAnalyticsBrowseData({
      ...baseParams,
      keyStageSlug: "ks1",
    });

    expect(result.phase).toBe("primary");
  });

  it("returns secondary phase for ks3 and ks4", () => {
    expect(
      getAnalyticsBrowseData({ ...baseParams, keyStageSlug: "ks3" }).phase,
    ).toBe("secondary");
    expect(
      getAnalyticsBrowseData({ ...baseParams, keyStageSlug: "ks4" }).phase,
    ).toBe("secondary");
  });

  it("handles null/undefined values with defaults", () => {
    const result = getAnalyticsBrowseData({
      ...baseParams,
      year: null,
      yearTitle: null,
      lessonReleaseDate: null,
    });

    expect(result.yearGroupSlug).toBe("");
    expect(result.yearGroupName).toBe("");
    expect(result.lessonReleaseDate).toBe("unreleased");
  });
});
