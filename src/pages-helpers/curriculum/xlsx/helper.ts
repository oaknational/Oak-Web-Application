import { groupUnitsBySubjectCategory } from "../docx/builder/helper";
import { JSZipCached } from "../docx/docx";

import { SubjectCategory, Unit } from "@/utils/curriculum/types";

export type XmlIndexMap = Record<string, string>;

export function createXmlIndexMap<T extends XmlIndexMap>(def: T) {
  const indexMap: Record<keyof typeof def, string> = {} as Record<
    keyof typeof def,
    string
  >;
  const xml = Object.entries(def)
    .map(([key, xml], index) => {
      indexMap[key as keyof typeof def] = String(index);
      return xml;
    })
    .join("\n");

  return {
    xml,
    indexMap,
  };
}

export function addOrUpdateSheet(
  zip: JSZipCached,
  sheetNumber: number,
  xml: string,
) {
  zip.writeString(
    `xl/worksheets/sheet${sheetNumber}.xml`,
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${xml}`,
  );
}

type GetFlatUnitsOutput = (Unit & {
  subjectCategory?: SubjectCategory;
})[];

export function getFlatUnits(units: Unit[]): GetFlatUnitsOutput {
  const enableGroupBySubjectCategory =
    units[0]?.actions?.subject_category_actions?.group_by_subjectcategory;

  if (enableGroupBySubjectCategory) {
    const groupedSubcatUnits = groupUnitsBySubjectCategory(units);
    const flatUnits = groupedSubcatUnits.flatMap(
      ({ units, subjectCategory }) => {
        return units.map((unit) => {
          return {
            subjectCategory,
            ...unit,
          };
        });
      },
    );
    return flatUnits;
  } else {
    return units.map((unit) => {
      return {
        ...unit,
      };
    });
  }
}
