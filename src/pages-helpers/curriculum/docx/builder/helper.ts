import { sum } from "lodash";
import JSZip from "jszip";
import {
  generateOakIconURL,
  isValidIconName,
} from "@oaknational/oak-components";

import { CombinedCurriculumData, Slugs } from "..";
import { zipToSimpleObject } from "../zip";

import { Unit } from "@/utils/curriculum/types";

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

export function threadUnitByYear(units: Unit[], threadSlug: string) {
  const output = {} as Record<string, Unit[]>;

  units.forEach((unit: Unit) => {
    const year =
      unit.actions?.programme_field_overrides?.year_slug ?? unit.year;
    unit.threads.forEach((thread) => {
      if (thread.slug === threadSlug) {
        output[year] = output[year] ?? [];
        if (
          output[year] &&
          // Check if unit is not already within output
          !output[year]!.find((yearUnit) => yearUnit.slug === unit.slug)
        ) {
          output[year]!.push(unit);
        }
      }
    });
  });

  return output;
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
      out[subjectcategory.id]!.push(unit);
    }
  }

  return Object.entries(out).map(([subjectcategoryId, units]) => {
    return {
      subjectCategory: subjectCategories[subjectcategoryId]!,
      units,
    };
  });
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
    const year = unit.year;

    const pathway = unit.pathway_slug || "default";

    const key = pathway === "default" ? `${year}` : `${year}-${pathway}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(unit);
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
  const firstPart = parts[0] ?? "";
  let year: string;
  let pathway: string | null;

  // Check if the first part looks like a year (is numeric)
  if (firstPart.match(/^\d+$/)) {
    year = firstPart;
    pathway = parts.length > 1 ? parts.slice(1).join("-") : null;
  } else {
    // If first part is not numeric, assume it's a pathway and default year
    year = "0";
    pathway = firstPart.length > 0 ? firstPart : null; // Use the firstPart as pathway if it exists
  }

  year = year.length > 0 ? year : "0";

  return { year, pathway };
}

/**
 * Comparator function for sorting year-pathway keys chronologically.
 * Sorts primarily by year number, then by pathway slug according to a defined order (core < gcse < default/null).
 * Example sort order: "9" < "10-core" < "10-gcse" < "10" < "11-core" < "11-gcse".
 *
 * @param keyA - The first year-pathway key to compare.
 * @param keyB - The second year-pathway key to compare.
 * @returns A negative value if keyA comes before keyB, a positive value if keyA comes after keyB, or 0 if they are equivalent for sorting.
 */
export function sortYearPathways(keyA: string, keyB: string): number {
  const { year: yearAStr, pathway: pathwayA } = parseYearPathwayKey(keyA);
  const { year: yearBStr, pathway: pathwayB } = parseYearPathwayKey(keyB);

  // Now yearAStr and yearBStr are guaranteed to be non-empty strings by parseYearPathwayKey
  const yearNumA = parseInt(yearAStr);
  const yearNumB = parseInt(yearBStr);

  if (yearNumA !== yearNumB) {
    return yearNumA - yearNumB;
  }

  // Same year, sort by pathway (e.g., core before gcse, default last)
  const pathwayOrder = { core: 1, gcse: 2, default: 99 }; // Default/null pathway comes last
  const orderA =
    pathwayOrder[pathwayA as keyof typeof pathwayOrder] ?? pathwayOrder.default;
  const orderB =
    pathwayOrder[pathwayB as keyof typeof pathwayOrder] ?? pathwayOrder.default;

  return orderA - orderB;
}

/**
 * Generates a display title from a year-pathway key.
 * Examples: "9" -> "Year 9", "10-core" -> "Year 10 (Core)".
 *
 * @param yearPathwayKey - The year-pathway key string (e.g., "10-gcse", "9").
 * @returns The formatted display title string.
 */
export function getYearPathwayDisplayTitle(yearPathwayKey: string): string {
  const { year: yearNumber, pathway } = parseYearPathwayKey(yearPathwayKey);
  let title = `Year ${yearNumber}`;

  if (pathway === "core") {
    title += " (Core)";
  } else if (pathway === "gcse") {
    title += " (GCSE)";
  }

  return title;
}
