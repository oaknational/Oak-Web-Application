import {
  Thread,
  Unit,
} from "@/components/CurriculumComponents/CurriculumVisualiser";

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
