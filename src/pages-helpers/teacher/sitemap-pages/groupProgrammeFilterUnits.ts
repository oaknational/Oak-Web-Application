import { keystageSlugs } from "@oaknational/oak-curriculum-schema";

import type { TeachersSitemapProgrammeFilterUnit } from "@/node-lib/curriculum-api-2023/queries/teachersSitemap/teacherSitemap.schema";
import type { CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023";
import { getSubjectPhaseSlug } from "@/components/TeacherComponents/helpers/getSubjectPhaseSlug";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";
import {
  isExamboardSlug,
  isPathwaySlug,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import { sortYears } from "@/utils/curriculum/sorting";
import type { KeyStageSlug } from "@/utils/curriculum/types";

const EYFS_KEYSTAGE_SLUG = "early-years-foundation-stage";

export type ProgrammePageSlug = {
  subjectPhaseSlug: string;
  ks4OptionSlug: string | null;
};

type ProgrammeFilterVariant = {
  subjectPhaseSlug: string;
  keystages: string[];
  years: string[];
};

export function mapKs4OptionSlugs(
  subject: CurriculumPhaseOptions[number],
  phase: CurriculumPhaseOptions[number]["phases"][number],
): ProgrammePageSlug[] {
  if (phase.slug === "primary") {
    return [
      {
        subjectPhaseSlug: getSubjectPhaseSlug({
          subject: subject.slug,
          phaseSlug: phase.slug,
        }),
        ks4OptionSlug: null,
      },
    ];
  }

  const ks4Options =
    subject.ks4_options?.filter(
      (option) => isExamboardSlug(option.slug) || isPathwaySlug(option.slug),
    ) ?? [];

  if (ks4Options.length === 0) {
    return [
      {
        subjectPhaseSlug: getSubjectPhaseSlug({
          subject: subject.slug,
          phaseSlug: phase.slug,
        }),
        ks4OptionSlug: null,
      },
    ];
  }

  return ks4Options.map((ks4Option) => ({
    subjectPhaseSlug: isExamboardSlug(ks4Option.slug)
      ? getSubjectPhaseSlug({
          subject: subject.slug,
          phaseSlug: phase.slug,
          examBoardSlug: ks4Option.slug,
        })
      : getSubjectPhaseSlug({
          subject: subject.slug,
          phaseSlug: phase.slug,
          pathwaySlug: ks4Option.slug,
        }),
    ks4OptionSlug: ks4Option.slug,
  }));
}

function unitMatchesKs4Option(
  unit: TeachersSitemapProgrammeFilterUnit,
  ks4OptionSlug: string | null,
): boolean {
  if (!ks4OptionSlug) {
    return unit.pathwaySlug === null;
  }

  const isExamboard = isExamboardSlug(ks4OptionSlug);
  const excludeCoreUnits = ks4OptionSlug !== "core";

  if (isExamboard) {
    const examboardMatches =
      unit.examboardSlug === ks4OptionSlug || unit.examboardSlug === null;
    if (!examboardMatches) {
      return false;
    }
    if (excludeCoreUnits && unit.pathwaySlug === "core") {
      return false;
    }
    return true;
  }

  return (
    unit.pathwaySlug === ks4OptionSlug ||
    unit.pathwaySlug === null ||
    (!excludeCoreUnits && unit.pathwaySlug === "core")
  );
}

export function filterUnitsForProgrammePage(
  units: TeachersSitemapProgrammeFilterUnit[],
  subjectSlug: string,
  phaseSlug: string,
  ks4OptionSlug: string | null,
): TeachersSitemapProgrammeFilterUnit[] {
  return units.filter(
    (unit) =>
      (unit.subjectSlug === subjectSlug ||
        unit.subjectParentSlug === subjectSlug) &&
      unit.phaseSlug === phaseSlug &&
      unitMatchesKs4Option(unit, ks4OptionSlug),
  );
}

type UnitWithYearOverride = Pick<
  TeachersSitemapProgrammeFilterUnit,
  "year" | "actions"
>;

export function resolveUnitYear(unit: UnitWithYearOverride): string {
  const actions = unit.actions as
    | { programme_field_overrides?: { year_slug?: string } }
    | undefined;
  return actions?.programme_field_overrides?.year_slug ?? unit.year;
}

export function createYearOptionsFromUnits(
  units: UnitWithYearOverride[],
): string[] {
  const yearOptions: string[] = [];

  for (const unit of units) {
    const year = resolveUnitYear(unit);
    if (!yearOptions.includes(year)) {
      yearOptions.push(year);
    }
  }

  return yearOptions.toSorted(sortYears);
}

export function createKeystageOptionsFromUnits(
  units: Pick<TeachersSitemapProgrammeFilterUnit, "keystageSlug">[],
): KeyStageSlug[] {
  return units
    .map((unit) => unit.keystageSlug)
    .filter((ks, index, all) => all.indexOf(ks) === index)
    .filter((ksSlug) => keystageSlugs.safeParse(ksSlug).success)
    .filter((ksSlug) => ksSlug !== EYFS_KEYSTAGE_SLUG)
    .toSorted((a, b) => a.localeCompare(b)) as KeyStageSlug[];
}

/**
 * Returns year query param values to include in the sitemap for a programme page.
 * Omits variants when there is only one year bucket (matches page year filter visibility).
 */
export function getSitemapYearVariants(yearOptions: string[]): string[] {
  if (yearOptions.length <= 1) {
    return [];
  }

  return yearOptions;
}

/**
 * Returns keystage query param values to include in the sitemap for a programme page.
 * Omits variants when there is only one keystage bucket, or when there is only one
 * year bucket (keystage params do not filter content on the page in that case).
 */
export function getSitemapKeystageVariants(
  keystages: string[],
  yearOptions: string[],
): string[] {
  if (yearOptions.length <= 1) {
    return [];
  }
  if (keystages.length <= 1) {
    return [];
  }

  return keystages;
}

export function getProgrammeFilterVariants(
  subjects: CurriculumPhaseOptions,
  units: TeachersSitemapProgrammeFilterUnit[],
): ProgrammeFilterVariant[] {
  const validSubjects = filterValidCurriculumPhaseOptions(subjects);

  return validSubjects.flatMap((subject) =>
    subject.phases.flatMap((phase) =>
      mapKs4OptionSlugs(subject, phase).flatMap(
        ({ subjectPhaseSlug, ks4OptionSlug }) => {
          const programmeUnits = filterUnitsForProgrammePage(
            units,
            subject.slug,
            phase.slug,
            ks4OptionSlug,
          );

          if (programmeUnits.length === 0) {
            return [];
          }

          const yearOptions = createYearOptionsFromUnits(programmeUnits);
          const keystages = createKeystageOptionsFromUnits(programmeUnits);

          return [
            {
              subjectPhaseSlug,
              keystages: getSitemapKeystageVariants(keystages, yearOptions),
              years: getSitemapYearVariants(yearOptions),
            },
          ];
        },
      ),
    ),
  );
}
