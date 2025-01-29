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
        keystage_slug: "ks2",
        features: { pe_swimming: true },
      } as Unit),
    ).toEqual({
      labels: ["swimming"],
      exclusions: ["pupils"],
      group_units_as: "Swimming and water safety",
      programme_field_overrides: {
        year: "All years",
        keystage: "All keystages",
      },
    });

    expect(
      getUnitFeatures({
        subject_slug: "physical-education",
        keystage_slug: "ks2",
        year: "3",
      } as Unit),
    ).toEqual(undefined);
  });

  it("returns computer science override when matching unit", () => {
    expect(
      getUnitFeatures({
        subject_slug: "computing",
        keystage_slug: "ks4",
        year: "11",
        pathway_slug: "gcse",
      } as Unit),
    ).toEqual({
      programme_field_overrides: {
        subject: "Computer Science",
      },
    });

    expect(
      getUnitFeatures({
        subject_slug: "computing",
        keystage_slug: "ks4",
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
        keystage_slug: "ks2",
        phase_slug: "primary",
        year: "3",
      } as Unit),
    ).toEqual({
      subjectcategories: {
        all_disabled: true,
        default_category_id: 4,
        group_by_subjectcategory: true,
      },
    });

    expect(
      getUnitFeatures({
        subject_slug: "english",
        keystage_slug: "ks3",
        phase_slug: "secondary",
        year: "7",
      } as Unit),
    ).toEqual(undefined);

    expect(
      getUnitFeatures({
        subject_slug: "english",
        keystage_slug: "ks4",
        phase_slug: "secondary",
        year: "10",
      } as Unit),
    ).toEqual({
      subjectcategories: {
        all_disabled: true,
        default_category_id: 19,
        group_by_subjectcategory: true,
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
