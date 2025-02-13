import { CurriculumUnitsTabData } from "@/node-lib/curriculum-api-2023";

export function notUndefined<TValue>(
  value: TValue | undefined,
): value is TValue {
  return value !== undefined;
}

export interface Thread {
  title: string;
  slug: string;
  order: number;
}

export interface Subject {
  subject: string;
  subject_slug: string;
}

export interface Domain {
  domain: string;
  domain_id: number;
}

export interface SubjectCategory {
  id: number;
  title: string;
}

export interface Tier {
  tier: string;
  tier_slug: string;
}

export type YearData = {
  [key: string]: {
    units: Unit[];
    childSubjects: Subject[];
    tiers: Tier[];
    subjectCategories: SubjectCategory[];
    labels: string[];
    groupAs: string | null;
  };
};

export type Unit = CurriculumUnitsTabData["units"][number];

export type CurriculumFilters = {
  childSubjects: Subject["subject_slug"][];
  subjectCategories: string[];
  tiers: Tier["tier_slug"][];
  years: string[];
  threads: Thread["slug"][];
};
