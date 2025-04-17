import { getModes, groupUnitsByPathway } from "./by-pathway";
import { YearData } from "./types";

import { createUnit } from "@/fixtures/curriculum/unit";
import { createPathway } from "@/fixtures/curriculum/pathway";

describe("getModes", () => {
  const coreKs4Option = { slug: "core", title: "Core" };
  const gcseKs4Option = { slug: "gcse", title: "GCSE" };
  it("", () => {
    expect(getModes(false, [gcseKs4Option])).toEqual(["all"]);
  });

  it("", () => {
    expect(getModes(true, [coreKs4Option, gcseKs4Option])).toEqual([
      "core",
      "non_core",
    ]);
    expect(getModes(true, [gcseKs4Option])).toEqual(["all"]);
    expect(getModes(true, [coreKs4Option])).toEqual(["core", "non_core"]);
  });
});

describe("groupUnitsByPathway", () => {
  it("all", () => {
    const unitsAll9 = [
      createUnit({ pathway_slug: "core", year: "9" }),
      createUnit({ pathway_slug: "core", year: "9" }),
    ];
    const unitsAll10 = [
      createUnit({ pathway_slug: "core", year: "10" }),
      createUnit({ pathway_slug: "core", year: "10" }),
    ];
    const unitsAll11 = [
      createUnit({ pathway_slug: "core", year: "11" }),
      createUnit({ pathway_slug: "core", year: "11" }),
    ];
    expect(
      groupUnitsByPathway({
        modes: ["all"],
        yearData: {
          "9": {
            units: unitsAll9,
          },
          "10": {
            units: unitsAll10,
          },
          "11": {
            units: unitsAll11,
          },
        } as unknown as YearData,
      }),
    ).toEqual({
      "9_all": {
        type: "all",
        year: "9",
        units: unitsAll9,
      },
      "10_all": {
        type: "all",
        year: "10",
        units: unitsAll10,
      },
      "11_all": {
        type: "all",
        year: "11",
        units: unitsAll11,
      },
    });
  });

  it.only("core & non_core", () => {
    const unitsAll9 = [createUnit({ year: "9" }), createUnit({ year: "9" })];
    const unitsAll10 = [
      createUnit({ pathway_slug: "core", year: "10" }),
      createUnit({ pathway_slug: "core", year: "10" }),
      createUnit({ pathway_slug: "gcse", year: "10" }),
      createUnit({ pathway_slug: "gcse", year: "10" }),
    ];
    const unitsAll11 = [
      createUnit({ pathway_slug: "core", year: "11" }),
      createUnit({ pathway_slug: "core", year: "11" }),
      createUnit({ pathway_slug: "gcse", year: "11" }),
      createUnit({ pathway_slug: "gcse", year: "11" }),
    ];
    const corePathway = createPathway({ pathway_slug: "core" });
    const gcsePathway = createPathway({ pathway_slug: "gcse" });
    const out = groupUnitsByPathway({
      modes: ["core", "non_core"],
      yearData: {
        "9": {
          units: unitsAll9,
        },
        "10": {
          pathways: [corePathway, gcsePathway],
          units: unitsAll10,
        },
        "11": {
          pathways: [corePathway, gcsePathway],
          units: unitsAll11,
        },
      } as unknown as YearData,
    });
    expect(out).toEqual({
      "9_core": {
        type: "core",
        year: "9",
        units: unitsAll9.slice(0, 2),
      },
      "10_core": {
        type: "core",
        pathways: [corePathway, gcsePathway],
        year: "10",
        units: unitsAll10.slice(0, 2),
      },
      "11_core": {
        type: "core",
        pathways: [corePathway, gcsePathway],
        year: "11",
        units: unitsAll11.slice(0, 2),
      },
      "10_non_core": {
        type: "non_core",
        pathways: [corePathway, gcsePathway],
        year: "10",
        units: unitsAll10.slice(2),
      },
      "11_non_core": {
        type: "non_core",
        pathways: [corePathway, gcsePathway],
        year: "11",
        units: unitsAll11.slice(2),
      },
    });
  });
});
