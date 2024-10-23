import { xmlRootToJson } from "../xml";

import {
  generateGridCols,
  keyStageFromPhaseTitle,
  uncapitalize,
  uncapitalizeSubject,
  generateOakIconURL,
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

  it("keyStageFromPhaseTitle", () => {
    expect(keyStageFromPhaseTitle("Primary")).toEqual("KS1 & KS2");
    expect(keyStageFromPhaseTitle("Secondary")).toEqual("KS3 & KS4");
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

  describe("generateOakIconURL", () => {
    const baseURL = `https://${process.env.NEXT_PUBLIC_OAK_ASSETS_HOST}/${process.env.NEXT_PUBLIC_OAK_ASSETS_PATH}`;
    it("returns a books url when no valid subject icon is passed in", () => {
      const url = generateOakIconURL("potions");
      expect(url).toBe(baseURL + "/books.svg");
    });

    it("returns a valid url when cycle 1 subject icon is passed in", () => {
      const url = generateOakIconURL("maths");
      expect(url).toBe(baseURL + "/subject-icons/maths.svg");
    });

    it("returns a valid url when cycle 2 subject icon is passed in", () => {
      const url = generateOakIconURL("cooking-nutrition");
      expect(url).toBe(baseURL + "/subject-icons/cooking-nutrition.svg");
    });
  });
});
