import { KeyStageSlug, Subject, SubjectCategory, Tier } from "./types";

export type YearDataPartialYearData = {
  tiers: Set<Tier>;
  childSubjects: Set<Subject>;
  subjectCategories: Set<SubjectCategory>;
};
export type YearDataPartialYearDataArray = {
  tiers: Tier[];
  childSubjects: Subject[];
  subjectCategories: SubjectCategory[];
};

const keystageYearMappings: Record<KeyStageSlug, string[]> = {
  ks1: ["1", "2"],
  ks2: ["3", "4", "5", "6"],
  ks3: ["7", "8", "9"],
  ks4: ["10", "11"],
};

export function byKeyStageSlug(
  data: Record<string, YearDataPartialYearDataArray>,
) {
  const out: Record<KeyStageSlug, YearDataPartialYearData> = {
    ks1: {
      tiers: new Set([]),
      childSubjects: new Set([]),
      subjectCategories: new Set([]),
    },
    ks2: {
      tiers: new Set([]),
      childSubjects: new Set([]),
      subjectCategories: new Set([]),
    },
    ks3: {
      tiers: new Set([]),
      childSubjects: new Set([]),
      subjectCategories: new Set([]),
    },
    ks4: {
      tiers: new Set([]),
      childSubjects: new Set([]),
      subjectCategories: new Set([]),
    },
  };

  for (const [year, yearData] of Object.entries(data)) {
    for (const [keyStr, years] of Object.entries(keystageYearMappings)) {
      const key = keyStr as KeyStageSlug;
      if (years.includes(year)) {
        yearData.tiers.forEach((tier) => out[key].tiers.add(tier));
        yearData.childSubjects.forEach((childSubject) =>
          out[key].childSubjects.add(childSubject),
        );
        yearData.subjectCategories.forEach((subjectCategory) =>
          out[key].subjectCategories.add(subjectCategory),
        );
      }
    }
  }

  const output: Record<string, YearDataPartialYearDataArray> = {};
  for (const [ksKey, obj] of Object.entries(out)) {
    output[ksKey as KeyStageSlug] = {
      tiers: [...obj.tiers],
      childSubjects: obj.childSubjects.size > 1 ? [...obj.childSubjects] : [],
      subjectCategories:
        obj.childSubjects.size < 1 ? [...obj.subjectCategories] : [],
    };
  }
  return output;
}

export function keystageFromYear(year: string) {
  for (const [keystage, years] of Object.entries(keystageYearMappings)) {
    if (years.includes(year)) {
      return keystage;
    }
  }
}

export function presentAtKeyStageSlugs(
  KeyStageSlugData: Record<KeyStageSlug, YearDataPartialYearDataArray>,
  key: keyof YearDataPartialYearDataArray,
  availableYears?: string[],
) {
  const out: KeyStageSlug[] = [];
  for (const [keyStageSlugStr, data] of Object.entries(KeyStageSlugData)) {
    const keyStageSlug = keyStageSlugStr as KeyStageSlug;
    const isValid =
      !availableYears ||
      availableYears.find((value) =>
        keystageYearMappings[keyStageSlug].includes(value),
      );
    if (isValid && data[key].length > 0) {
      out.push(keyStageSlug as KeyStageSlug);
    }
  }
  return out;
}
