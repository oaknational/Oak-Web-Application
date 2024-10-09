import { FactorData } from "./getAvailableProgrammeFactor";
import { getFactorDataFromSlug } from "./getFactorDataFromSlug";

describe("getFactorDataFromSlug", () => {
  it("should return the correct factor data", () => {
    const factorSlug = "aqa";
    const availableFactors: FactorData[] = [
      {
        factorSlug: "aqa",
        factor: "AQA",
        factorDisplayOrder: 1,
        factorDescription: null,
        isLegacy: false,
      },
      {
        factorSlug: "edexcel",
        factor: "Edexcel",
        factorDisplayOrder: 2,
        factorDescription: null,
        isLegacy: false,
      },
    ];
    const result = getFactorDataFromSlug({
      factorSlug,
      availableFactors,
    });
    expect(result).toEqual({
      factorSlug: "aqa",
      factor: "AQA",
      factorDisplayOrder: 1,
      factorDescription: null,
      isLegacy: false,
    });
  });

  it("should throw an error if the factor data is not found", () => {
    const factorSlug = "ocr";
    const availableFactors: FactorData[] = [
      {
        factorSlug: "aqa",
        factor: "AQA",
        factorDisplayOrder: 1,
        factorDescription: null,
        isLegacy: false,
      },
      {
        factorSlug: "edexcel",
        factor: "Edexcel",
        factorDisplayOrder: 2,
        factorDescription: null,
        isLegacy: false,
      },
    ];
    expect(() =>
      getFactorDataFromSlug({
        factorSlug,
        availableFactors,
      }),
    ).toThrow();
  });
});
