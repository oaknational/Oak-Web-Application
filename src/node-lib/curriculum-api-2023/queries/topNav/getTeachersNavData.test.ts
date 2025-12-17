import { getTeachersNavData } from "./getTeachersNavData";
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
      (s) => s.slug === "financial-education",
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
});
