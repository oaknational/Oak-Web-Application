import {
  generateGridCols,
  keyStageFromPhaseTitle,
  notUndefined,
  uncapitalize,
  uncapitalizeSubject,
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

  describe("notUndefined", () => {
    it("true", () => {
      expect(notUndefined(undefined)).toEqual(false);
    });

    it("false", () => {
      expect(notUndefined(0)).toEqual(true);
      expect(notUndefined("")).toEqual(true);
      expect(notUndefined(false)).toEqual(true);
    });
  });

  it("keyStageFromPhaseTitle", () => {
    expect(keyStageFromPhaseTitle("Primary")).toEqual("KS1 & KS2");
    expect(keyStageFromPhaseTitle("Secondary")).toEqual("KS3 & KS4");
  });

  describe("generateGridCols", () => {
    it("single", () => {
      expect(generateGridCols(1)).toEqual("");
    });
    it("multiple", () => {
      expect(generateGridCols(3)).toEqual("");
    });
    it("with defined columns", () => {
      expect(generateGridCols(3, [1000])).toEqual("");
    });
  });
});
