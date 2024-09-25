import {
  isCycleTwoEnabled,
  useCycleTwoEnabled,
  isSwimmingHackEnabled,
  getUnitFeatures,
} from "./features";

import { Unit } from "@/components/CurriculumComponents/CurriculumVisualiser";

const MOCK_ENABLE_CYCLE_2 = jest.fn();
const MOCK_SWIMMING_HACK = jest.fn();
jest.mock("./constants", () => ({
  __esModule: true,
  get ENABLE_CYCLE_2() {
    return MOCK_ENABLE_CYCLE_2() ?? false;
  },
  get SWIMMING_HACK() {
    return MOCK_SWIMMING_HACK() ?? false;
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

describe("isSwimmingHackEnabled", () => {
  it("true when ENABLE_CYCLE_2 & SWIMMING_HACK is true", () => {
    MOCK_ENABLE_CYCLE_2.mockReturnValue(true);
    MOCK_SWIMMING_HACK.mockReturnValue(true);
    expect(isSwimmingHackEnabled()).toEqual(true);
  });

  it("false when neither true", () => {
    expect(isSwimmingHackEnabled()).toEqual(false);
  });

  it("false when only SWIMMING_HACK is true", () => {
    MOCK_SWIMMING_HACK.mockReturnValue(true);
    expect(isSwimmingHackEnabled()).toEqual(false);
  });
});

describe("getUnitFeatures", () => {
  it("returns swimming rules when hack enabled and matching unit", () => {
    MOCK_ENABLE_CYCLE_2.mockReturnValue(true);
    MOCK_SWIMMING_HACK.mockReturnValue(true);
    expect(
      getUnitFeatures({ slug: "sport-psychology-skill-and-ability" } as Unit),
    ).toEqual({
      labels: ["swimming"],
      exclusions: ["pupils"],
      group_as: "Swimming",
      programmes_fields_overrides: {
        year: "all-years",
        keystage: "All keystages",
      },
    });
  });

  it("returns computer science override when matching unit", () => {
    MOCK_ENABLE_CYCLE_2.mockReturnValue(true);
    MOCK_SWIMMING_HACK.mockReturnValue(false);
    expect(
      getUnitFeatures({ subject_slug: "computing", year: "11" } as Unit),
    ).toEqual({
      programmes_fields_overrides: {
        subject: "Computer Science",
      },
    });

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