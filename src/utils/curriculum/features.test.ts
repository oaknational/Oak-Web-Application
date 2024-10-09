import {
  isCycleTwoEnabled,
  useCycleTwoEnabled,
  getUnitFeatures,
} from "./features";

import { Unit } from "@/components/CurriculumComponents/CurriculumVisualiser";

const MOCK_ENABLE_CYCLE_2 = jest.fn();
const MOCK_CURRIC_PARTNER_HACK = jest.fn();
jest.mock("./constants", () => ({
  __esModule: true,
  get ENABLE_CYCLE_2() {
    return MOCK_ENABLE_CYCLE_2() ?? false;
  },
  get CURRIC_PARTNER_HACK() {
    return MOCK_CURRIC_PARTNER_HACK() ?? false;
  },
  default: {},
}));

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("isCycleTwoEnabled", () => {
  it("true when ENABLE_CYCLE_2 true", () => {
    MOCK_ENABLE_CYCLE_2.mockReturnValue(true);
    expect(isCycleTwoEnabled()).toEqual(true);
  });

  it("false when ENABLE_CYCLE_2 false", () => {
    expect(isCycleTwoEnabled()).toEqual(false);
  });
});

describe("useCycleTwoEnabled", () => {
  it("true when ENABLE_CYCLE_2 true", () => {
    MOCK_ENABLE_CYCLE_2.mockReturnValue(true);
    expect(useCycleTwoEnabled()).toEqual(true);
  });

  it("false when ENABLE_CYCLE_2 false", () => {
    expect(useCycleTwoEnabled()).toEqual(false);
  });
});

describe("getUnitFeatures", () => {
  it("returns swimming rules when matching unit", () => {
    MOCK_ENABLE_CYCLE_2.mockReturnValue(true);
    expect(
      getUnitFeatures({
        subject_slug: "physical-education",
        year: "3",
        features: { pe_swimming: true },
      } as Unit),
    ).toEqual({
      labels: ["swimming"],
      exclusions: ["pupils"],
      group_as: "Swimming",
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
    MOCK_ENABLE_CYCLE_2.mockReturnValue(true);
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

  it("returns nothing when hack disabled", () => {
    expect(getUnitFeatures({ slug: "test" } as Unit)).toEqual(undefined);
  });

  it("returns nothing when hack enabled but not a matching unit", () => {
    MOCK_ENABLE_CYCLE_2.mockReturnValue(true);
    expect(getUnitFeatures({ slug: "test" } as Unit)).toEqual(undefined);
  });
});
