import { getTabName, getTabSlug } from "./tabSchema";

describe("tabSchema", () => {
  it("returns a tab name from a given valid slug", () => {
    const result = getTabName("units");
    expect(result).toEqual("Unit sequence");
  });
  it("returns a tab slug from a valid tab name", () => {
    const result = getTabSlug("Explainer");
    expect(result).toEqual("overview");
  });
});
