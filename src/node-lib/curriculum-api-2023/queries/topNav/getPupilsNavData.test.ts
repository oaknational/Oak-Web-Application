import { getPupilsNavData } from "./getPupilsNavData";
import { mockResponseByYears } from "./fixtures";

describe("getPupilsNavData", () => {
  it("returns correct data for primary", () => {
    const result = getPupilsNavData(mockResponseByYears, "primary");
    expect(result.title).toBe("Primary");
    expect(result.children).toHaveLength(6);
  });
  it("returns correct data for secondary", () => {
    const result = getPupilsNavData(mockResponseByYears, "secondary");
    expect(result.title).toBe("Secondary");
    expect(result.children).toHaveLength(5);
  });
});
