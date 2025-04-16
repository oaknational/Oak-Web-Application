import { CurriculumFilters, Unit, YearData } from "./types";
import { sortYears } from "./sorting";
import { isVisibleUnit } from "./isVisibleUnit";
import { filteringFromYears } from "./filtering";

import { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";

export type MODES = "core" | "non_core" | "all";

export function applyFiltering(
  filters: CurriculumFilters,
  unitsByYearSelector: UnitsByPathway,
) {
  function filterIncludes(key: keyof CurriculumFilters, ids: string[]) {
    const filterValues = filters[key];
    return ids.every((id) => {
      return filterValues.includes(id);
    });
  }

  const step1 = Object.values(unitsByYearSelector).filter((item) =>
    filterIncludes("years", [item.year]),
  );
  const step2 = step1.map((item) => {
    return {
      ...item,
      units: item.units.filter((unit) => {
        const yearBasedFilters = filteringFromYears(item, filters);
        return isVisibleUnit(yearBasedFilters, item.year, unit);
      }),
    };
  });
  return step2;
}

export function getModes(shouldIncludeCore: boolean, ks4Options: Ks4Option[]) {
  const yearTypes: MODES[] = [];
  if (!ks4Options?.find((opt) => opt.slug === "core")) {
    yearTypes.push("all");
  } else {
    if (!shouldIncludeCore || ks4Options?.find((opt) => opt.slug === "core")) {
      yearTypes.push("core");
    }
    if (shouldIncludeCore) {
      yearTypes.push("non_core");
    }
  }
  return yearTypes;
}

type Out = {
  type: MODES;
  year: string;
  units: Unit[];
} & YearData[number];

type groupUnitsByPathwayOptions = {
  modes: MODES[];
  yearData: YearData;
};
export function groupUnitsByPathway({
  modes,
  yearData,
}: groupUnitsByPathwayOptions) {
  const yearSelectors = modes.flatMap((type) => {
    return Object.keys(yearData)
      .map((year) => ({ year, type }))
      .filter(({ year }) => {
        if (type === "non_core") {
          if (year === "10" || year === "11") {
            return true;
          } else {
            return false;
          }
        } else if (type === "core") {
          if (year === "10" || year === "11") {
            return (
              yearData[year]!.pathways.findIndex(
                (item) => item.pathway_slug === "core",
              ) > -1
            );
          }
        }
        return true;
      })
      .sort((a, b) => sortYears(a.year, b.year));
  });

  const unitsByYearSelector = yearSelectors
    .map(({ year, type }) => {
      const yearItem = yearData[year] as YearData[string];

      const isExamboard = type === "non_core";

      const filteredUnits = yearItem.units.filter((unit: Unit) => {
        if (isExamboard && unit.pathway_slug === "core") {
          return false;
        }
        if (
          type !== "all" &&
          ["10", "11"].includes(year) &&
          !isExamboard &&
          unit.pathway_slug !== "core"
        ) {
          return false;
        }
        return unit;
      });

      return {
        type,
        year,
        ...yearItem,
        units: filteredUnits,
      };
    })
    .filter(({ units }) => {
      return units.length > 0;
    });

  const out: Record<string, Out> = {};
  for (const item of unitsByYearSelector) {
    out[item.year + "_" + item.type] = item;
  }

  return out;
}

export type UnitsByPathway = ReturnType<typeof groupUnitsByPathway>;
