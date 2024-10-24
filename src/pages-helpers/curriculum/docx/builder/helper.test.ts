import { xmlRootToJson } from "../xml";

import { generateGridCols, uncapitalize, uncapitalizeSubject } from "./helper";

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
});
