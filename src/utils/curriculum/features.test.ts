import { getUnitFeatures } from "./features";
import { Unit } from "./types";

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("getUnitFeatures", () => {
  it("returns swimming rules when matching unit", () => {
    expect(
      getUnitFeatures({
        subject_slug: "physical-education",
        year: "3",
        features: { pe_swimming: true },
      } as Unit),
    ).toEqual({
      labels: ["swimming"],
      exclusions: ["pupils"],
      group_as: "Swimming and water safety",
      programmes_fields_overrides: {
        year: "all-years",
        keystage: "All keystages",
      },
    });

    expect(
      getUnitFeatures({
        subject_slug: "physical-education",
        year: "3",
      } as Unit),
    ).toEqual(undefined);
  });

  it("returns computer science override when matching unit", () => {
    expect(
      getUnitFeatures({
        subject_slug: "computing",
        year: "11",
        pathway_slug: "gcse",
      } as Unit),
    ).toEqual({
      programmes_fields_overrides: {
        subject: "Computer Science",
      },
    });

    expect(
      getUnitFeatures({
        subject_slug: "computing",
        year: "11",
        pathway_slug: "core",
      } as Unit),
    ).toEqual(undefined);

    expect(
      getUnitFeatures({ subject_slug: "computing", year: "9" } as Unit),
    ).toEqual(undefined);
  });

  it("returns subject category exclusion for english when matching unit", () => {
    expect(
      getUnitFeatures({
        subject_slug: "english",
        phase_slug: "primary",
        year: "3",
      } as Unit),
    ).toEqual({
      subjectcategories: {
        all_disabled: true,
        default_category_id: 4,
      },
    });

    expect(
      getUnitFeatures({
        subject_slug: "english",
        phase_slug: "secondary",
        year: "7",
      } as Unit),
    ).toEqual({
      subjectcategories: {
        all_disabled: true,
        default_category_id: 19,
      },
    });

    expect(
      getUnitFeatures({
        subject_slug: "physical-education",
        year: "3",
      } as Unit),
    ).toEqual(undefined);
  });

  it("returns nothing when hack disabled", () => {
    expect(getUnitFeatures({ slug: "test" } as Unit)).toEqual(undefined);
  });

  it("returns nothing when hack enabled but not a matching unit", () => {
    expect(getUnitFeatures({ slug: "test" } as Unit)).toEqual(undefined);
  });
});
