import { sum } from "lodash";
import JSZip from "jszip";
import {
  generateOakIconURL,
  isValidIconName,
} from "@oaknational/oak-components";

import { CombinedCurriculumData, Slugs } from "..";
import { zipToSimpleObject } from "../zip";

import { Unit } from "@/utils/curriculum/types";
import { getUnitFeatures } from "@/utils/curriculum/features";

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
      getUnitFeatures(unit)?.programme_field_overrides?.Year ?? unit.year;
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
      getUnitFeatures(unit)?.programme_field_overrides?.Year ?? unit.year;
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
