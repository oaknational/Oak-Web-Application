import { capitalize } from "lodash";
import {
  examboardSlugs,
  ProgrammeFields,
} from "@oaknational/oak-curriculum-schema";

import {
  groupUnitsBySubjectCategory,
  subjectFromUnits,
} from "../docx/builder/helper";
import { JSZipCached } from "../docx/docx";
import { CurriculumUnitsFormattedData } from "../docx/tab-helpers";
import { Slugs } from "../docx";

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

export function examboardTitleToPathway(examboardTitle?: string | null) {
  if (examboardTitle) {
    return examboardTitle === "Core" ? `${examboardTitle}` : "GCSE";
  }
}

function isExamboardSlug(
  examboardSlug: ProgrammeFields["examboard_slug"] | string | null,
): examboardSlug is ProgrammeFields["examboard_slug"] {
  return Object.keys(examboardSlugs.Values).includes(examboardSlug ?? "");
}

// This is an old HACK and should be replace with "features" on the programme
export function getSubjectOveride(
  subject: string,
  keyStageSlug: Slugs["keyStageSlug"],
) {
  if (
    keyStageSlug &&
    subject === "Computing" &&
    isExamboardSlug(keyStageSlug)
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
    throw new Error("invalid");
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

  // HACKS
  const subjectTitle = units[0]!.subject;
  const examboardTitle = units[0]!.examboard;

  const tierTitle = slugs.tierSlug ? `${capitalize(slugs.tierSlug)}` : "";

  const childSubjectTitle =
    subjectFromUnits(units, slugs.childSubjectSlug) ?? "";

  const subjectOverrideTitle = getSubjectOveride(
    subjectTitle,
    slugs.keyStageSlug,
  );

  const title = [
    !childSubjectTitle ? (subjectOverrideTitle ?? subjectTitle) : null,
    !slugs.tierSlug ? examboardTitleToPathway(examboardTitle) : null,
    childSubjectTitle,
    tierTitle,
  ]
    .filter(Boolean)
    .join(", ");

  return `Year ${year} ${title}`;
}
