import { getShouldDisplayCorePathway } from "./pathways";

describe("getShouldDisplayCorePathway", () => {
  it("has core slug", () => {
    const out = getShouldDisplayCorePathway([
      {
        slug: "core",
        title: "Core",
      },
      {
        slug: "gcse",
        title: "GCSE",
      },
    ]);
    expect(out).toEqual(true);
  });

  it("does not have core slug", () => {
    const out = getShouldDisplayCorePathway([
      {
        slug: "gcse",
        title: "GCSE",
      },
    ]);
    expect(out).toEqual(false);
  });
});
