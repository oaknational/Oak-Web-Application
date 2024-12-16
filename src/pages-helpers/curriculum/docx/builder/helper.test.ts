import { generateOakIconURL } from "@oaknational/oak-components";

import { xmlRootToJson } from "../xml";
import { CombinedCurriculumData } from "..";

import {
  generateGridCols,
  uncapitalize,
  uncapitalizeSubject,
  generateIconURL,
  subjectFromUnits,
} from "./helper";

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
});
