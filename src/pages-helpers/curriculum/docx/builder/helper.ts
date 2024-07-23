import { Slugs } from "..";

import {
  Thread,
  Unit,
} from "@/components/CurriculumComponents/CurriculumVisualiser";

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

export function notUndefined<TValue>(
  value: TValue | undefined,
): value is TValue {
  return value !== undefined;
}

export function createCurriculumSlug(slugs: Slugs) {
  return `${slugs.subjectSlug}-${slugs.phaseSlug}${
    slugs.examboardSlug ? `-${slugs.examboardSlug}` : ""
  }`;
}

// TODO: This is from from Sonali's work that's not yet merged
export function createThreadOptions(units: Unit[]): Thread[] {
  const threadOptions = [] as Thread[];

  units.forEach((unit: Unit) => {
    // Populate threads object

    unit.threads.forEach((thread) => {
      if (threadOptions.every((to) => to.slug !== thread.slug)) {
        threadOptions.push(thread);
      }
    });
  });

  // Sort threads

  const threadOrders = new Set(threadOptions.map((to) => to.order));
  if (threadOptions.length > threadOrders.size) {
    // In secondary science multiple threads can have the same order value due
    // to multiple subjects (eg biology, chemistry, physics) being shown, so
    // if orders are not unique, sort alphabetically by slug

    threadOptions.sort((a, b) => a.slug.localeCompare(b.slug));
  } else {
    // If orders are unique, use them to sort

    threadOptions.sort((a, b) => a.order - b.order);
  }
  return threadOptions;
}

export function threadUnitByYear(units: Unit[], threadSlug: string) {
  const output = {} as Record<string, Unit[]>;

  units.forEach((unit: Unit) => {
    unit.threads.forEach((thread) => {
      if (thread.slug === threadSlug) {
        output[unit.year] = output[unit.year] ?? [];
        if (
          output[unit.year] &&
          // Check if unit is not already within output
          !output[unit.year]!.find((yearUnit) => yearUnit.slug === unit.slug)
        ) {
          output[unit.year]!.push(unit);
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
