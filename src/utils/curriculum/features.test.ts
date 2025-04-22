import { getIsUnitDescriptionEnabled } from "./features";
import { Unit } from "./types";

const ENABLE_WTWN_BY_UNIT_DESCRIPTION_FEATURE_GETTER = jest.fn();
jest.mock("@/utils/curriculum/constants", () => ({
  __esModule: true,
  get ENABLE_WTWN_BY_UNIT_DESCRIPTION_FEATURE() {
    return ENABLE_WTWN_BY_UNIT_DESCRIPTION_FEATURE_GETTER();
  },
}));

describe("getIsUnitDescriptionEnabled", () => {
  it("when false", () => {
    ENABLE_WTWN_BY_UNIT_DESCRIPTION_FEATURE_GETTER.mockReturnValue(false);
    expect(
      getIsUnitDescriptionEnabled({
        parent_programme_features: {
          unit_description: true,
        },
      } as Unit),
    ).toEqual(false);
    expect(
      getIsUnitDescriptionEnabled({
        parent_programme_features: {
          unit_description: false,
        },
      } as Unit),
    ).toEqual(false);
    expect(
      getIsUnitDescriptionEnabled({
        cycle: "1",
      } as Unit),
    ).toEqual(false);
    expect(
      getIsUnitDescriptionEnabled({
        cycle: "2",
      } as Unit),
    ).toEqual(true);
  });

  it("when true", () => {
    ENABLE_WTWN_BY_UNIT_DESCRIPTION_FEATURE_GETTER.mockReturnValue(true);
    expect(
      getIsUnitDescriptionEnabled({
        parent_programme_features: {
          unit_description: true,
        },
      } as Unit),
    ).toEqual(true);
    expect(
      getIsUnitDescriptionEnabled({
        parent_programme_features: {
          unit_description: false,
        },
      } as Unit),
    ).toEqual(false);
    expect(
      getIsUnitDescriptionEnabled({
        cycle: "1",
      } as Unit),
    ).toEqual(false);
    expect(
      getIsUnitDescriptionEnabled({
        cycle: "2",
      } as Unit),
    ).toEqual(false);
  });
});
