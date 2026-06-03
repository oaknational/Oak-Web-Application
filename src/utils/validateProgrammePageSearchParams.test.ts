import { keystageSlugs, years } from "@oaknational/oak-curriculum-schema";
import { ReadonlyURLSearchParams } from "next/navigation";

import {
  validateSearchParams,
  validateServerSearchParams,
} from "./validateProgrammePageSearchParams";

const toReadonly = (p: URLSearchParams) =>
  p as unknown as ReadonlyURLSearchParams;

describe("validateSearchParams", () => {
  it.each([
    [
      { years: "7", keystages: "ks3" },
      { years: "7", keystages: "ks3" },
    ],
    [
      { years: "invalid", keystages: "ks1" },
      { years: undefined, keystages: "ks1" },
    ],
    [
      { years: "10", keystages: "invalid" },
      { years: "10", keystages: undefined },
    ],
    [{}, { years: undefined, keystages: undefined }],
  ])("validates params %o", (input, expected) => {
    expect(
      validateSearchParams(toReadonly(new URLSearchParams(input))),
    ).toEqual(expected);
  });

  it("returns undefined when searchParams is null", () => {
    expect(validateSearchParams(null)).toEqual({
      years: undefined,
      keystages: undefined,
    });
  });

  it.each(keystageSlugs.options)("accepts keystage slug %s", (slug) => {
    expect(
      validateSearchParams(toReadonly(new URLSearchParams({ keystages: slug })))
        .keystages,
    ).toBe(slug);
  });

  it.each(years.options)("accepts year value %s", (year) => {
    expect(
      validateSearchParams(toReadonly(new URLSearchParams({ years: year })))
        .years,
    ).toBe(year);
  });
});

describe("validateServerSearchParams", () => {
  it.each([
    [
      { years: "7", keystages: "ks3" },
      { years: "7", keystages: "ks3" },
    ],
    [
      { years: "invalid", keystages: "invalid" },
      { years: undefined, keystages: undefined },
    ],
    [{}, { years: undefined, keystages: undefined }],
    [
      { years: ["7", "8"], keystages: ["ks1", "ks2"] },
      { years: undefined, keystages: undefined },
    ],
    [
      { years: undefined, keystages: undefined },
      { years: undefined, keystages: undefined },
    ],
  ])("validates params %o", (input, expected) => {
    expect(validateServerSearchParams(input)).toEqual(expected);
  });
});
