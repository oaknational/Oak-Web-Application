import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import {
  CurriculumOverviewMVData,
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";

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
  slug: string;
}

export interface Tier {
  tier: string;
  tier_slug: string;
}

export interface Pathway {
  pathway: string;
  pathway_slug: string;
}

export type YearData = {
  [key: string]: {
    units: Unit[];
    childSubjects: Subject[];
    tiers: Tier[];
    subjectCategories: SubjectCategory[];
    isSwimming: boolean;
    groupAs: string | null;
    pathways: Pathway[];
  };
};

export type KeyStageSlug = "ks1" | "ks2" | "ks3" | "ks4";

export type Unit = CurriculumUnitsTabData["units"][number];

export type UnitOption = Unit["unit_options"][number];

export type CurriculumFilters = {
  childSubjects: Subject["subject_slug"][];
  subjectCategories: string[];
  tiers: Tier["tier_slug"][];
  years: string[];
  threads: Thread["slug"][];
  pathways: Pathway["pathway_slug"][];
};

export type Lesson = {
  title: string;
  slug?: string;
  _state?: string;
};

export type CombinedCurriculumData = CurriculumUnitsTabData &
  CurriculumOverviewMVData &
  CurriculumOverviewSanityData;
