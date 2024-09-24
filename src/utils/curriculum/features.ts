import { ENABLE_CYCLE_2, SWIMMING_HACK } from "./constants";

import { Unit } from "@/components/CurriculumComponents/CurriculumVisualiser";

export function isCycleTwoEnabled() {
  return ENABLE_CYCLE_2;
}

export function useCycleTwoEnabled() {
  return ENABLE_CYCLE_2;
}

export function isSwimmingHackEnabled() {
  return ENABLE_CYCLE_2 && SWIMMING_HACK;
}

export function getUnitFeatures(unit: Unit) {
  // HACK: Swimming primary isn't yet published so we're hacking in some secondary units and giving them the overrides
  if (
    isSwimmingHackEnabled() &&
    [
      "health-and-wellbeing-hiit-and-couch-to-5k-team-challenges-to-develop-fitness",
      "sport-psychology-skill-and-ability",
    ].includes(unit.slug)
  ) {
    return {
      labels: ["swimming"],
      exclusions: ["pupils"],
      group_as: "Swimming",
      programmes_fields_overrides: {
        year: "all-years",
        keystage: "All keystages",
      },
    };
  }
}
