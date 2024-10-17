import { sum } from "lodash";
import JSZip from "jszip";

import { Slugs } from "..";
import { zipToSimpleObject } from "../zip";

import { Unit } from "@/components/CurriculumComponents/CurriculumVisualiser";
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
    slugs.examboardSlug ? `-${slugs.examboardSlug}` : ""
  }`;
}

export function threadUnitByYear(units: Unit[], threadSlug: string) {
  const output = {} as Record<string, Unit[]>;

  units.forEach((unit: Unit) => {
    const year =
      getUnitFeatures(unit)?.programmes_fields_overrides.year ?? unit.year;
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

export function keyStageFromPhaseTitle(phaseTitle: string) {
  if (phaseTitle === "Primary") {
    return "KS1 & KS2";
  } else if (phaseTitle === "Secondary") {
    return "KS3 & KS4";
  }
  return phaseTitle;
}

export function cmToPxDpi(cm: number) {
  return (cm / 2.54) * 300;
}

export function makeTransparentIfSanity(input: string, height?: number) {
  const url = new URL(input);
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
