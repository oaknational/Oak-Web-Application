import { getCaseStudyTagBackground } from "./getCaseStudyTagBackground";

describe("getCaseStudyTagBackground", () => {
  it("returns the correct background for secondary tag", () => {
    expect(getCaseStudyTagBackground("secondary")).toBe("bg-decorative1-main");
  });
  it("returns the correct background for primary tag", () => {
    expect(getCaseStudyTagBackground("primary")).toBe("bg-decorative4-main");
  });
  it("returns undefined for other tags", () => {
    expect(getCaseStudyTagBackground("other")).toBeUndefined();
  });
});
