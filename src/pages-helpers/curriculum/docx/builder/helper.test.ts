import { generateOakIconURL } from "@oaknational/oak-components";

import { xmlRootToJson } from "../xml";
import { CombinedCurriculumData } from "..";

import {
  generateGridCols,
  uncapitalize,
  uncapitalizeSubject,
  generateIconURL,
  groupUnitsBySubjectCategory,
  subjectFromUnits,
  unitsByYear,
  groupUnitsByYearAndPathway,
  parseYearPathwayKey,
  sortYearPathways,
  getSuffixFromPathway,
  makeTransparentIfSanity,
} from "./helper";

import { createUnit } from "@/fixtures/curriculum/unit";
import { Unit } from "@/utils/curriculum/types";

describe("helper", () => {
  it("uncapitalize", async () => {
    for (const [input, output] of [
      ["TeStiNg", "testing"],
      ["FOO bar BAz", "FOO bar baz"],
      ["helLO", "hello"],
    ] as const) {
      expect(uncapitalize(input)).toEqual(output);
    }
  });

  it("uncapitalizeSubject", async () => {
    for (const [input, output] of [
      ["Spanish", "Spanish"],
      ["English", "English"],
      ["Science", "science"],
      ["German", "German"],
      ["French", "French"],
      ["RSHE", "RSHE"],
    ] as const) {
      expect(uncapitalizeSubject(input)).toEqual(output);
    }
  });

  describe("generateGridCols", () => {
    it("single", () => {
      const xml = xmlRootToJson(generateGridCols(1));
      expect(xml).toEqual({
        elements: [
          {
            attributes: { "w:w": "10200" },
            name: "w:gridCol",
            type: "element",
          },
        ],
      });
    });
    it("multiple", () => {
      const xml = xmlRootToJson(generateGridCols(3));
      expect(xml).toEqual({
        elements: [
          { attributes: { "w:w": "3400" }, name: "w:gridCol", type: "element" },
          { attributes: { "w:w": "3400" }, name: "w:gridCol", type: "element" },
          { attributes: { "w:w": "3400" }, name: "w:gridCol", type: "element" },
        ],
      });
    });
    it("with defined columns", () => {
      const xml = xmlRootToJson(generateGridCols(3, [1000]));
      expect(xml).toEqual({
        elements: [
          { attributes: { "w:w": "1000" }, name: "w:gridCol", type: "element" },
          { attributes: { "w:w": "4600" }, name: "w:gridCol", type: "element" },
          { attributes: { "w:w": "4600" }, name: "w:gridCol", type: "element" },
        ],
      });
    });
  });

  describe("generateIconURL", () => {
    it("returns a books url when no valid subject icon is passed in", () => {
      const url = generateIconURL("potions");
      expect(url).toBe(generateOakIconURL("subject-english"));
    });

    it("returns a valid url when valid subject icon is passed in", () => {
      const url = generateIconURL("maths");
      expect(url).toBe(generateOakIconURL("subject-maths"));
    });
  });

  describe("groupUnitsBySubjectCategory", () => {
    it("should group with subject categories", () => {
      expect(
        groupUnitsBySubjectCategory([
          {
            slug: "a",
          },
          {
            slug: "b",
          },
        ] as CombinedCurriculumData["units"]),
      ).toEqual([]);
    });

    it("should not group without subject categories", () => {
      const input = [
        {
          slug: "a",
          subjectcategories: [
            {
              id: 1,
              title: "test1",
              category: "test1",
            },
          ],
          order: 1,
        },
        {
          slug: "b",
          subjectcategories: [
            {
              id: 2,
              title: "test2",
              category: "test2",
            },
          ],
          order: 1,
        },
      ] as CombinedCurriculumData["units"];

      const out = groupUnitsBySubjectCategory(input);
      expect(out).toEqual([
        {
          subjectCategory: input[0]!.subjectcategories![0],
          units: [input[0]!],
        },
        {
          subjectCategory: input[1]!.subjectcategories![0],
          units: [input[1]!],
        },
      ]);
    });
  });
  describe("subjectFromUnits", () => {
    const data = [
      {},
      { subject_slug: "combined-science", subject: "Combined science" },
    ] as CombinedCurriculumData["units"];
    it("return if exists and slug", () => {
      expect(subjectFromUnits(data, "combined-science")).toEqual(
        "Combined science",
      );
    });

    it("undefined if no slug", () => {
      expect(subjectFromUnits(data, undefined)).toEqual(undefined);
    });

    it("undefined if no unit with subject", () => {
      expect(subjectFromUnits(data, "foobar")).toEqual(undefined);
    });
  });

  it("unitsByYear", () => {
    const result = unitsByYear([
      {
        title: "test1",
        slug: "test1",
        year: "1",
      },
      {
        title: "test2",
        slug: "test2",
        year: "1",
      },
      {
        title: "test3",
        slug: "test3",
        year: "2",
      },
      {
        title: "test4",
        slug: "test4",
        year: "2",
      },
    ] as Unit[]);
    expect(result).toEqual({
      "1": [
        {
          title: "test1",
          slug: "test1",
          year: "1",
          order: 0,
        },
        {
          title: "test2",
          slug: "test2",
          year: "1",
          order: 1,
        },
      ],
      "2": [
        {
          title: "test3",
          slug: "test3",
          year: "2",
          order: 0,
        },
        {
          title: "test4",
          slug: "test4",
          year: "2",
          order: 1,
        },
      ],
    });
  });

  // Tests for Pathway Helpers
  const sampleUnits: Unit[] = [
    // Year 9 (No pathway)
    createUnit({
      year: "9",
      pathway_slug: null,
      title: "Introduction to Logic",
      slug: "introduction-to-logic-y9",
      order: 0,
    }),
    createUnit({
      year: "9",
      pathway_slug: undefined,
      title: "Binary Representation",
      slug: "binary-representation-y9",
      order: 1,
    }),
    // Year 10 No Pathway
    createUnit({
      year: "10",
      pathway_slug: null,
      title: "Fundamentals of Computing",
      slug: "fundamentals-of-computing-y10",
      order: 2,
    }),
    // Year 10 Core
    createUnit({
      year: "10",
      pathway_slug: "core",
      title: "Core Programming Concepts",
      slug: "core-programming-concepts-y10",
      order: 0,
    }),
    createUnit({
      year: "10",
      pathway_slug: "core",
      title: "Core Data Structures",
      slug: "core-data-structures-y10",
      order: 1,
    }),
    // Year 10 GCSE
    createUnit({
      year: "10",
      pathway_slug: "gcse",
      title: "GCSE Algorithms",
      slug: "gcse-algorithms-y10",
      order: 0,
    }),

    // Year 11 Core
    createUnit({
      year: "11",
      pathway_slug: "core",
      title: "Core Networking",
      slug: "core-networking-y11",
      order: 0,
    }),
    // Year 11 GCSE
    createUnit({
      year: "11",
      pathway_slug: "gcse",
      title: "GCSE Cybersecurity",
      slug: "gcse-cybersecurity-y11",
      order: 0,
    }),
    createUnit({
      year: "11",
      pathway_slug: "gcse",
      title: "GCSE Databases",
      slug: "gcse-databases-y11",
      order: 1,
    }),
  ];

  describe("groupUnitsByYearAndPathway", () => {
    const grouped = groupUnitsByYearAndPathway(sampleUnits);

    it("should group units by year when no pathway", () => {
      expect(grouped["9-none"]).toHaveLength(2);
      expect(grouped["9-none"]?.map((u) => u.slug)).toEqual([
        "introduction-to-logic-y9",
        "binary-representation-y9",
      ]);
    });

    it("should group units by year and pathway when pathway exists", () => {
      expect(grouped["10-core"]).toHaveLength(2);
      expect(grouped["10-core"]?.map((u) => u.slug)).toEqual([
        "core-programming-concepts-y10",
        "core-data-structures-y10",
      ]);
      expect(grouped["10-gcse"]).toHaveLength(1);
      expect(grouped["10-gcse"]?.map((u) => u.slug)).toEqual([
        "gcse-algorithms-y10",
      ]);
      expect(grouped["11-core"]).toHaveLength(1);
      expect(grouped["11-core"]?.map((u) => u.slug)).toEqual([
        "core-networking-y11",
      ]);
      expect(grouped["11-gcse"]).toHaveLength(2);
      expect(grouped["11-gcse"]?.map((u) => u.slug)).toEqual([
        "gcse-cybersecurity-y11",
        "gcse-databases-y11",
      ]);
    });

    it("should group units with null/undefined pathway under the year key only", () => {
      expect(grouped["10-none"]).toHaveLength(1);
      expect(grouped["10-none"]?.map((u) => u.slug)).toEqual([
        "fundamentals-of-computing-y10",
      ]);
      expect(
        grouped["10-core"]?.find(
          (u) => u.slug === "fundamentals-of-computing-y10",
        ),
      ).toBeUndefined();
      expect(
        grouped["10-gcse"]?.find(
          (u) => u.slug === "fundamentals-of-computing-y10",
        ),
      ).toBeUndefined();
      expect(grouped["9-none"]?.map((u) => u.slug)).toEqual([
        "introduction-to-logic-y9",
        "binary-representation-y9",
      ]);
    });

    it("should handle empty input", () => {
      expect(groupUnitsByYearAndPathway([])).toEqual({});
    });
  });

  describe("parseYearPathwayKey", () => {
    it("should parse year-only keys", () => {
      expect(parseYearPathwayKey("9-none")).toEqual({
        year: "9",
        pathway: "none",
      });
      expect(parseYearPathwayKey("12-none")).toEqual({
        year: "12",
        pathway: "none",
      });
    });

    it("should parse year-pathway keys", () => {
      expect(parseYearPathwayKey("10-core")).toEqual({
        year: "10",
        pathway: "core",
      });
      expect(parseYearPathwayKey("11-gcse")).toEqual({
        year: "11",
        pathway: "gcse",
      });
    });

    it("should handle potentially empty strings (defaults year to '')", () => {
      expect(parseYearPathwayKey("")).toEqual({ year: "", pathway: "" });
    });

    it("should handle missing year part (defaults year to '')", () => {
      expect(parseYearPathwayKey("core")).toEqual({
        year: "",
        pathway: "core",
      });
    });
  });

  describe("sortYearPathways", () => {
    it("should sort keys chronologically by year, then pathway", () => {
      const keys = [
        "7-none",
        "11-gcse",
        "10-core",
        "11-core",
        "10-gcse",
        "10-none",
        "9-none",
        "8-none",
      ].toSorted(sortYearPathways);
      expect(keys).toEqual([
        "7-none",
        "8-none",
        "9-none",
        "10-none",
        "10-core",
        "11-core",
        "10-gcse",
        "11-gcse",
      ]);

      const keys2 = [
        "7-none",
        "8-none",
        "9-none",
        "10-core",
        "11-core",
        "10-none",
        "11-gcse",
        "10-gcse",
      ].toSorted(sortYearPathways);
      expect(keys2).toEqual([
        "7-none",
        "8-none",
        "9-none",
        "10-none",
        "10-core",
        "11-core",
        "10-gcse",
        "11-gcse",
      ]);
    });

    it("should place default/null pathway last within a year group", () => {
      const keys = ["10-gcse", "10-none", "10-core"];
      keys.sort(sortYearPathways);
      expect(keys).toEqual(["10-none", "10-core", "10-gcse"]);
    });
  });
});

describe("getSuffixFromPathway", () => {
  it("core", () => {
    expect(getSuffixFromPathway("core")).toEqual("(Core)");
  });

  it("gcse", () => {
    expect(getSuffixFromPathway("gcse")).toEqual("(GCSE)");
  });

  it("none", () => {
    expect(getSuffixFromPathway("foobar")).toEqual(undefined);
  });
});

describe("makeTransparentIfSanity", () => {
  it("data:// urls", () => {
    const url =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    expect(makeTransparentIfSanity(url)).toEqual(url);
  });

  it("http:// urls", () => {
    const url = "http://localhost:3000/foo.png";
    expect(makeTransparentIfSanity(url)).toEqual(`${url}?fm=png&bg=00FFFFFF`);
  });
});
