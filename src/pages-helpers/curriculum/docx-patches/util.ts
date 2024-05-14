import {
  Thread,
  Unit,
} from "@/components/CurriculumComponents/CurriculumVisualiser";

// Safe version of String#includes(...)
export const textIncludes = (str: unknown, matchText: string) => {
  if (typeof str === "string") {
    return str.includes(matchText);
  }
  return false;
};

// Safe version of String#replace(...)
export const textReplacer = (
  input: unknown,
  selector: string,
  value: string,
) => {
  if (typeof input === "string") {
    return input.replace(selector, value);
  }
  return input;
};

export function threadUnitByYear(units: Unit[], threadSlug: string) {
  const output = {} as Record<string, { thread: Thread; unit: Unit }[]>;

  units.forEach((unit: Unit) => {
    unit.threads.forEach((thread) => {
      if (thread.slug === threadSlug) {
        output[unit.year] = output[unit.year] ?? [];
        if (
          output[unit.year] &&
          !output[unit.year]!.find(({ unit: u }) => u.slug === unit.slug)
        ) {
          output[unit.year]!.push({
            thread,
            unit,
          });
        }
      }
    });
  });

  return output;
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
