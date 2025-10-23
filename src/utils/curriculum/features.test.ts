import { getIsUnitDescriptionEnabled } from "./features";
import { Unit } from "./types";

test("getIsUnitDescriptionEnabled", () => {
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
