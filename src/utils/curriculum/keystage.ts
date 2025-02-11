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

  const mappings: [string[], KeyStageSlug][] = [
    [["1", "2"], "ks1"],
    [["3", "4", "5", "6"], "ks2"],
    [["7", "8", "9"], "ks3"],
    [["10", "11"], "ks4"],
  ];

  for (const [year, yearData] of Object.entries(data)) {
    for (const [years, key] of mappings) {
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

export function presentAtKeyStageSlugs(
  KeyStageSlugData: Record<KeyStageSlug, YearDataPartialYearDataArray>,
  key: keyof YearDataPartialYearDataArray,
) {
  const out: KeyStageSlug[] = [];
  for (const [KeyStageSlug, data] of Object.entries(KeyStageSlugData)) {
    if (data[key].length > 0) {
      out.push(KeyStageSlug as KeyStageSlug);
    }
  }
  return out;
}
