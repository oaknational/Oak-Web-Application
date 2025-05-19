import { createPathway } from "./index";

describe("createPathway", () => {
  it("default pathway", () => {
    const result = createPathway();
    expect(result).toEqual({
      pathway_slug: "blank",
      pathway: "Blank",
    });
  });

  it("pass slug", () => {
    const result = createPathway({ pathway_slug: "test" });
    expect(result).toEqual({
      pathway_slug: "test",
      pathway: "Test",
    });
  });

  it("pass title", () => {
    const result = createPathway({ pathway: "Test" });
    expect(result).toEqual({
      pathway_slug: "blank",
      pathway: "Test",
    });
  });
});
