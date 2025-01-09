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
} from "./helper";

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
});
