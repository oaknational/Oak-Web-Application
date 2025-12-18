import { getProgrammeCount, getTeachersNavData } from "./getTeachersNavData";
import { mockResponseData } from "./fixtures";

describe("getTeachersNavData", () => {
  it("gets primary data", () => {
    const result = getTeachersNavData(mockResponseData, "primary");
    expect(result.phaseTitle).toBe("Primary");
    expect(result.keystages).toHaveLength(3);
  });
  it("gets secondary data", () => {
    const result = getTeachersNavData(mockResponseData, "secondary");
    expect(result.phaseTitle).toBe("Secondary");
    expect(result.keystages).toHaveLength(2);
  });
  it("correctly identifies non curriculum subjects", () => {
    const result = getTeachersNavData(mockResponseData, "primary");
    const financialEducation = result.keystages[0]?.subjects.find(
      (s) => s.subjectSlug === "financial-education",
    );
    expect(financialEducation?.nonCurriculum).toBeTruthy();
  });
  it("includes EYFS in primary", () => {
    const result = getTeachersNavData(mockResponseData, "primary");
    const eyfs = result.keystages.find(
      (ks) => ks.slug === "early-years-foundation-stage",
    );
    expect(eyfs).toBeDefined();
  });
  it("removes duplicate subjects from keystages", () => {
    const result = getTeachersNavData(mockResponseData, "primary");
    const subjects = result.keystages[0]?.subjects;

    expect(subjects).toHaveLength(2);
  });
});

describe("getProgrammeCount", () => {
  it("gets the correct programme count for primary subjects", () => {
    const result = getProgrammeCount({
      data: mockResponseData,
      keystageSlug: "ks1",
      subjectSlug: "art",
      pathwaySlug: null,
    });
    expect(result).toBe(1);
  });
  it("gets the correct programme count for secondary subjects with tiers", () => {
    const result = getProgrammeCount({
      data: mockResponseData,
      keystageSlug: "ks4",
      subjectSlug: "maths",
      pathwaySlug: null,
    });
    expect(result).toBe(2);
  });
  it("gets the correct programme count for secondary subjects with pathways with no pfs", () => {
    const result = getProgrammeCount({
      data: mockResponseData,
      keystageSlug: "ks4",
      subjectSlug: "computing",
      pathwaySlug: "core",
    });
    expect(result).toBe(1);
  });
  it("gets the correct programme count for secondary subjects with pathways with pfs", () => {
    const result = getProgrammeCount({
      data: mockResponseData,
      keystageSlug: "ks4",
      subjectSlug: "computing",
      pathwaySlug: "gcse",
    });
    expect(result).toBe(2);
  });
});
