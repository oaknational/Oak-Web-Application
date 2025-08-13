import { capitalize } from "lodash";
import { examboardSlugs } from "@oaknational/oak-curriculum-schema";

import {
  groupUnitsBySubjectCategory,
  subjectFromUnits,
} from "../docx/builder/helper";
import { JSZipCached } from "../docx/docx";
import { CurriculumUnitsFormattedData } from "../docx/tab-helpers";
import { Slugs } from "../docx";

import { SubjectCategory, Unit } from "@/utils/curriculum/types";
import { keystageFromYear } from "@/utils/curriculum/keystage";

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
    return units.map((unit, unitIndex) => {
      return {
        ...unit,
        order: unitIndex + 1,
      };
    });
  }
}

export function ks4OptionSlugToPathway(ks4OptionSlug?: string | null) {
  if (ks4OptionSlug) {
    return ks4OptionSlug === "core" ? `Core` : "GCSE";
  }
}

function isExamboardSlug(examboardSlug: string) {
  return Object.keys(examboardSlugs.Values).includes(examboardSlug ?? "");
}

// This is an old HACK and should be replace with "features" on the programme
export function getSubjectOveride(
  subject_slug: string,
  year: string,
  examboardSlug?: string,
) {
  if (
    examboardSlug &&
    subject_slug === "computing" &&
    keystageFromYear(year) === "ks4" &&
    isExamboardSlug(examboardSlug)
  ) {
    return "Computer Science";
  }
}

export function generateSheetTitle(
  formattedData: CurriculumUnitsFormattedData,
  year: string,
) {
  // Guard, should never trigger
  if (!formattedData.yearData[year]) {
    throw new Error("Missing yearData");
  }

  const { groupAs } = formattedData.yearData[year];
  if (groupAs && year === "all-years") {
    return `${groupAs}`;
  }

  return `Year ${year}`;
}

export function generateYearTitle(
  formattedData: CurriculumUnitsFormattedData,
  year: string,
  slugs: Slugs,
) {
  // Guard, should never trigger
  if (!formattedData.yearData[year]) {
    throw new Error("invalid");
  }

  const { groupAs } = formattedData.yearData[year];
  if (groupAs && year === "all-years") {
    return `${groupAs} (all years)`;
  }

  const { units } = formattedData.yearData[year];
  const tierTitle = slugs.tierSlug ? `${capitalize(slugs.tierSlug)}` : "";
  const childSubjectTitle =
    subjectFromUnits(units, slugs.childSubjectSlug) ?? "";
  const subjectOverrideTitle = getSubjectOveride(
    units[0]!.subject_slug,
    year,
    slugs.ks4OptionSlug,
  );

  const subjectTitle = units[0]!.subject;

  const title = [
    !childSubjectTitle ? (subjectOverrideTitle ?? subjectTitle) : null,
    !slugs.tierSlug ? ks4OptionSlugToPathway(slugs.ks4OptionSlug) : null,
    childSubjectTitle,
    tierTitle,
  ]
    .filter(Boolean)
    .join(", ");

  return `Year ${year} ${title}`;
}
