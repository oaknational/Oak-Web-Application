import { getPupilsNavData } from "./getPupilsNavData";
import { mockResponseByYears } from "./fixtures";

describe("getPupilsNavData", () => {
  it("returns correct data for primary", () => {
    const result = getPupilsNavData(mockResponseByYears, "primary");
    expect(result.phaseTitle).toBe("Primary");
    expect(result.years).toHaveLength(6);
  });
  it("returns correct data for secondary", () => {
    const result = getPupilsNavData(mockResponseByYears, "secondary");
    expect(result.phaseTitle).toBe("Secondary");
    expect(result.years).toHaveLength(5);
  });
});
