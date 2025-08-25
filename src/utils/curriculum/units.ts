import { Unit, UnitOption, YearData } from "./types";

export function findUnitOrOptionBySlug(
  yearData: YearData,
  unitSlug?: string | null,
): { unit: Unit | undefined; unitOption: UnitOption | undefined } {
  if (!unitSlug) return { unit: undefined, unitOption: undefined };
  const allUnits = Object.values(yearData).flatMap(
    (yearItem) => yearItem.units,
  );
  let unit = allUnits.find((unit) => unit.slug === unitSlug);
  let unitOption;
  if (!unit) {
    unit = allUnits.find((unit) =>
      unit.unit_options.find((u) => u.slug === unitSlug),
    );
    if (unit) {
      unitOption = unit.unit_options.find((u) => u.slug === unitSlug);
    }
  }

  return { unit, unitOption };
}

export function doUnitsHaveNc(units: Unit[]) {
  return units.some((unit) => {
    return unit.features?.national_curriculum_content;
  });
}

export function flatUnitsFromYearData(yearData: YearData) {
  return Object.values(yearData).flatMap((yr) => yr.units);
}
