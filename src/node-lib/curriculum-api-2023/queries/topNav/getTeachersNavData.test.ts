import { getProgrammeCount, getTeachersNavData } from "./getTeachersNavData";
import { mockResponseData } from "./fixtures";

describe("getTeachersNavData", () => {
  it("gets primary data", () => {
    const result = getTeachersNavData(mockResponseData, "primary");
    expect(result.title).toBe("Primary");
    expect(result.children).toHaveLength(3);
  });
  it("gets secondary data", () => {
    const result = getTeachersNavData(mockResponseData, "secondary");
    expect(result.title).toBe("Secondary");
    expect(result.children).toHaveLength(2);
  });
  it("correctly identifies non curriculum subjects", () => {
    const result = getTeachersNavData(mockResponseData, "primary");
    const financialEducation = result.children[0]?.children.find(
      (s) => s.slug === "financial-education",
    );
    expect(financialEducation?.nonCurriculum).toBeTruthy();
  });
  it("includes EYFS in primary", () => {
    const result = getTeachersNavData(mockResponseData, "primary");
    const eyfs = result.children.find(
      (ks) => ks.slug === "early-years-foundation-stage",
    );
    expect(eyfs).toBeDefined();
  });
  it("removes duplicate subjects from keystages", () => {
    const result = getTeachersNavData(mockResponseData, "primary");
    const subjects = result.children[0]?.children;

    expect(subjects).toHaveLength(2);
  });
  it("includes pathways for ks4 subjects", () => {
    const result = getTeachersNavData(mockResponseData, "secondary");
    const computing = result.children[1]?.children?.filter(
      (s) => s.slug === "computing",
    );
    expect(computing).toHaveLength(2);
  });
  it("returns a valid programme slug for subjects with one programme per keystage", () => {
    const result = getTeachersNavData(mockResponseData, "secondary");
    const multipleProgrammeSubject = result.children[1]?.children?.find(
      (s) => s.programmeCount === 1,
    );
    expect(multipleProgrammeSubject?.programmeSlug).not.toBeNull();
  });
  it("returns programme slug as null for subjects with multiple programmes at keystage", () => {
    const result = getTeachersNavData(mockResponseData, "secondary");
    const multipleProgrammeSubject = result.children[1]?.children?.find(
      (s) => s.programmeCount > 1,
    );
    expect(multipleProgrammeSubject?.programmeSlug).toBeNull();
  });
  it("uses subect name overrides", () => {
    const result = getTeachersNavData(mockResponseData, "secondary");
    const gcseComputing = result.children[1]?.children.find(
      (s) => s.slug === "computing" && s.programmeCount > 1,
    );

    expect(gcseComputing?.title).toEqual("Computer science (GCSE)");
  });
  it("handles subjects with only one pathway and examboards (RE)", () => {
    const result = getTeachersNavData(mockResponseData, "secondary");
    const gcseRe = result.children[1]?.children.filter(
      (s) => s.slug === "religious-education",
    );

    expect(gcseRe).toHaveLength(1); // No core option
    expect(gcseRe?.[0]?.title).toBe("Religious education (GCSE)"); // gcse in title
    expect(gcseRe?.[0]?.programmeCount).toBe(3); // one programme per examboard
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
