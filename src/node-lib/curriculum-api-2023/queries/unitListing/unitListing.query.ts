import {
  syntheticUnitvariantLessonsSchema,
  yearSlugs,
  yearDescriptions,
} from "@oaknational/oak-curriculum-schema";
import { kebabCase } from "lodash";
import { z } from "zod";

import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import { getTiersForProgramme } from "./tiers/getTiersForProgramme";
import { getUnitsForProgramme } from "./units/getUnitsForProgramme";
import { getAllLearningThemes } from "./threads/getAllLearningThemes";

import { NEW_COHORT } from "@/config/cohort";

// category icons don't have a consistent naming convention
const categoryIconMap = {
  Grammar: "subject-english-grammar",
  Handwriting: "subject-english-handwriting",
  "Reading, writing & oracy": "subject-english-reading-writing-oracy",
  Spelling: "subject-english-spelling",
  Vocabulary: "subject-english-vocabulary",
  Physics: "subject-physics",
  Biology: "subject-biology",
  Chemistry: "subject-chemistry",
};
export type CategoryKeys = keyof typeof categoryIconMap;

const unitListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string }) => {
    const res = await sdk.unitListing(args);
    const unitsForProgramme = res.units;

    if (!unitsForProgramme || unitsForProgramme.length === 0) {
      return null;
    }

    const parsedRawUnits = unitsForProgramme.map((p) =>
      syntheticUnitvariantLessonsSchema.parse(p),
    );

    const firstUnit = parsedRawUnits[0];

    if (!firstUnit) {
      throw new OakError({
        code: "curriculum-api/not-found",
      });
    }

    const programmeFields = firstUnit.programme_fields;

    const isLegacy = firstUnit.is_legacy;
    const hasTiers = parsedRawUnits.some(
      (p) => p.programme_fields.tier_slug !== null,
    );
    const tiers = hasTiers
      ? await getTiersForProgramme(
          sdk,
          programmeFields.subject_slug,
          programmeFields.keystage_slug,
          programmeFields.examboard_slug,
          isLegacy,
        )
      : [];

    const units = await getUnitsForProgramme(parsedRawUnits);

    const yearGroups = Array.from(
      units
        .reduce((acc, unit) => {
          const yearTitle = yearDescriptions.parse(unit[0]?.yearTitle);
          const yearSlug = yearSlugs.parse(unit[0]?.year);

          if (yearTitle && yearSlug && !acc.has(yearTitle)) {
            acc.set(yearTitle, {
              yearTitle: yearTitle,
              year: yearSlug,
            });
          }
          return acc;
        }, new Map<z.infer<typeof yearDescriptions>, { yearTitle: z.infer<typeof yearDescriptions>; year: z.infer<typeof yearSlugs> }>())
        .values(),
    );

    const learningThemes = getAllLearningThemes(units);

    const subjectCategories = Array.from(
      parsedRawUnits
        .reduce((acc, unit) => {
          if (!unit.unit_data.subjectcategories) {
            return acc;
          }
          (unit.unit_data.subjectcategories as CategoryKeys[]).forEach(
            (category) => {
              if (typeof category === "string" && !acc.has(category)) {
                acc.set(category, {
                  label: category,
                  iconName: categoryIconMap[category],
                  slug: kebabCase(category),
                });
              }
            },
          );
          return acc;
        }, new Map<string, { label: string; iconName: string; slug: string }>())
        .values(),
    ).sort((a, b) => a.label.localeCompare(b.label));

    const hasNewContent = units
      .flatMap((unit) => unit.flatMap((u) => u.cohort ?? "2020-2023"))
      .includes(NEW_COHORT);

    return {
      programmeSlug: args.programmeSlug,
      keyStageSlug: programmeFields.keystage_slug,
      keyStageTitle: programmeFields.keystage_description,
      examBoardSlug: programmeFields.examboard_slug,
      examBoardTitle: programmeFields.examboard,
      subjectSlug: programmeFields.subject_slug,
      subjectTitle: programmeFields.subject,
      subjectParent: programmeFields.subject_parent || null,
      tierSlug: programmeFields.tier_slug,
      tiers: tiers,
      units: units,
      phase: programmeFields.phase_slug,
      learningThemes: learningThemes,
      hasNewContent,
      subjectCategories,
      yearGroups,
    };
  };

export default unitListingQuery;
