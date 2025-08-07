import { sum } from "lodash";
import JSZip from "jszip";
import {
  generateOakIconURL,
  isValidIconName,
} from "@oaknational/oak-components";

import { zipToSimpleObject } from "../zip";
import { Slugs } from "..";

import { CombinedCurriculumData, Unit } from "@/utils/curriculum/types";

/**
 * Uncapitalize everything except acronyms
 * @param input capitalized string
 * @returns uncapitalized string
 */
export function uncapitalize(input: string, titleCaseWords: string[] = []) {
  const chars = input.split("");
  let output = ``;
  for (let i = 0; i < chars.length; i++) {
    let j = i;
    let allUpperCase = true;
    let doBreak = false;
    let word = "";
    while (j < chars.length) {
      if (chars[j] === " ") {
        doBreak = true;
      } else if (!chars[j]!.match(/[A-Z]/)) {
        allUpperCase = false;
      }
      word += chars[j];
      j++;
      if (doBreak) break;
    }

    if (titleCaseWords.includes(word.toLowerCase())) {
      const firstLetter = word.slice(0, 1);
      const rest = word.slice(1);
      output += `${firstLetter.toUpperCase()}${rest}`;
    } else if (allUpperCase) {
      output += word;
    } else {
      output += word.toLowerCase();
    }
    i = j - 1;
  }
  return output;
}

export function subjectFromUnits(
  units: CombinedCurriculumData["units"],
  subject_slug?: string,
) {
  if (subject_slug) {
    return units.find((u) => u.subject_slug === subject_slug)?.subject;
  }
}

/**
 * Uncapitalize with language exceptions
 * @param input capitalized string
 * @returns uncapitalized string
 */
export function uncapitalizeSubject(input: string) {
  return uncapitalize(input, ["english", "french", "spanish", "german"]);
}

export function createCurriculumSlug(slugs: Slugs) {
  return `${slugs.subjectSlug}-${slugs.phaseSlug}${
    slugs.ks4OptionSlug ? `-${slugs.ks4OptionSlug}` : ""
  }`;
}

export function unitsByYear(units: Unit[]) {
  const output = {} as Record<string, Unit[]>;

  units.forEach((unit: Unit) => {
    const year =
      unit.actions?.programme_field_overrides?.year_slug ?? unit.year;
    output[year] = output[year] ?? [];
    if (
      output[year] &&
      // Check if unit is not already within output
      !output[year]!.find((yearUnit) => yearUnit.slug === unit.slug)
    ) {
      output[year]!.push({
        ...unit,
        order: output[year].length,
      });
    }
  });

  return output;
}

export function cmToPxDpi(cm: number) {
  return (cm / 2.54) * 300;
}

export function makeTransparentIfSanity(input: string, height?: number) {
  const url = new URL(input);
  if (url.protocol === "data:") {
    return url.href;
  }
  url.searchParams.set("fm", "png");
  url.searchParams.set("bg", "00FFFFFF");
  if (height) {
    url.searchParams.set("h", String(Math.round(height)));
  }
  return url.href;
}

const MAX_TABLE_WIDTH = 3400 * 3;
export function generateGridCols(amount: number, sizes: number[] = []) {
  const alreadyAccountedFor = sum(sizes);
  const width = Math.floor(
    (MAX_TABLE_WIDTH - alreadyAccountedFor) / (amount - sizes.length),
  );
  return Array(amount)
    .fill(true)
    .map((_, index) => {
      const colWidth = index < sizes.length ? sizes : width;
      return `<w:gridCol w:w="${colWidth}" />`;
    })
    .join("");
}

export function zipToSnapshotObject(zip: JSZip) {
  return zipToSimpleObject(zip, { hashBuffers: true });
}

export const generateIconURL = (subjectSlug: string): string => {
  const key = `subject-${subjectSlug}`;
  const iconName = isValidIconName(key) ? key : "subject-english";
  return generateOakIconURL(iconName);
};

export function groupUnitsBySubjectCategory(units: Unit[]) {
  const out: Record<string, Unit[]> = {};
  const subjectCategories: Record<
    string,
    NonNullable<Unit["subjectcategories"]>[number]
  > = {};
  for (const unit of units) {
    for (const subjectcategory of unit.subjectcategories ?? []) {
      if (out[subjectcategory.id] === undefined) {
        subjectCategories[subjectcategory.id] = subjectcategory;
        out[subjectcategory.id] = [];
      }
      out[subjectcategory.id]!.push({
        ...unit,
        order: out[subjectcategory.id]!.length + 1,
      });
    }
  }

  return Object.entries(out).map(([subjectcategoryId, units]) => {
    return {
      subjectCategory: subjectCategories[subjectcategoryId]!,
      units,
    };
  });
}

export function getPathKeyFromUnit(unit: Unit) {
  const year = unit.actions?.programme_field_overrides?.year_slug ?? unit.year;

  return "pathway_slug" in unit && unit.pathway_slug
    ? `${year}-${unit.pathway_slug}`
    : `${year}-none`;
}

/**
 * Groups units by a composite key of year and pathway slug.
 * Keys are strings like "9", "10-core", "11-gcse".
 * Units with null or undefined `pathway_slug` are grouped under the year key only (e.g., "10").
 *
 * @param units - Array of curriculum units.
 * @returns An object where keys are year-pathway strings and values are arrays of units belonging to that group.
 */
export function groupUnitsByYearAndPathway(units: Unit[]): {
  [yearPathwayKey: string]: Unit[];
} {
  const grouped: { [yearPathwayKey: string]: Unit[] } = {};
  for (const unit of units) {
    const key = getPathKeyFromUnit(unit);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push({
      ...unit,
      order: grouped[key].length + 1,
    });
  }
  return grouped;
}

/**
 * Parses a year-pathway key string into its constituent parts.
 * Handles keys like "9", "10-core", "11-gcse".
 * Guarantees returning a non-empty string for the year, defaulting to "0" if the key is malformed.
 *
 * @param key - The year-pathway key string (e.g., "11-gcse", "9").
 * @returns An object containing the parsed `year` (string) and `pathway` (string or null).
 */
export function parseYearPathwayKey(key: string): {
  year: string;
  pathway: string | null;
} {
  const parts = key.split("-");
  return {
    year: parts.slice(0, -1).join("-"),
    pathway: parts.slice(-1).join("-"),
  };
}

/**
 * Comparator function for sorting year-pathway keys.
 * Sorts KS3 chronologically, then KS4 pathways grouped (Core then GCSE), with years sorted within each pathway group.
 * Example sort order: "7" < "8" < "9" < "10-core" < "11-core" < "10-gcse" < "11-gcse".
 */
export function sortYearPathways(keyA: string, keyB: string): number {
  const { year: yearAStr, pathway: pathwayA } = parseYearPathwayKey(keyA);
  const { year: yearBStr, pathway: pathwayB } = parseYearPathwayKey(keyB);

  const yearNumA = parseInt(yearAStr);
  const yearNumB = parseInt(yearBStr);

  const pathwayOrder = { core: 0, gcse: 1, none: -1 };
  const orderA =
    pathwayOrder[pathwayA as keyof typeof pathwayOrder] ?? pathwayOrder.none;
  const orderB =
    pathwayOrder[pathwayB as keyof typeof pathwayOrder] ?? pathwayOrder.none;

  const pathwayCompare = orderA - orderB;
  const yearCompare = yearNumA - yearNumB;
  return pathwayCompare + yearCompare;
}

export function getSuffixFromPathway(pathway: string | null) {
  if (pathway === "core") {
    return "(Core)";
  } else if (pathway === "gcse") {
    return "(GCSE)";
  }
}
