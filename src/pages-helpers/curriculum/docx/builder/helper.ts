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
export function uncapitalize(input: string) {
  const chars = input.split("");
  let output = ``;
  for (let i = 0; i < chars.length; i++) {
    if (
      chars[i]?.match(/[A-Z]/) &&
      (i == 0 || chars[i - 1]?.match(/[^A-Z.]/)) &&
      (i === chars.length - 1 || chars[i + 1]?.match(/[^A-Z]/))
    ) {
      output += chars[i]?.toLowerCase();
    } else {
      output += chars[i];
    }
  }
  return output;
}

/**
 * Uncapitalize with language exceptions
 * @param input capitalized string
 * @returns uncapitalized string
 */
export function uncapitalizeSubject(input: string) {
  const outputWithoutSpecialCases = uncapitalize(input);
  return outputWithoutSpecialCases.replace(
    /\b(english|french|spanish|german)\b/gi,
    (word) => {
      const firstLetter = word.slice(0, 1);
      const rest = word.slice(1);
      return `${firstLetter.toUpperCase()}${rest}`;
    },
  );
}

export function createProgrammeSlug(
  unitData?: Unit | null,
  examboardSlug?: string | null,
  tierSlug?: string | null,
) {
  tierSlug = tierSlug ?? unitData?.tier_slug;
  if (unitData?.keystage_slug === "ks4") {
    return `${unitData.subject_slug}-${unitData.phase_slug}-${
      unitData.keystage_slug
    }${tierSlug ? "-" + tierSlug : ""}${
      examboardSlug ? "-" + examboardSlug : ""
    }`;
  }
  return unitData
    ? `${unitData.subject_slug}-${unitData.phase_slug}-${unitData.keystage_slug}`
    : "";
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