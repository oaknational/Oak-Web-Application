import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import { getTiersForProgramme } from "./tiers/getTiersForProgramme";
import { getUnitsForProgramme } from "./units/getUnitsForProgramme";
import { getAllLearningThemes } from "./filters/getAllLearningThemes";
import { getAllCategories } from "./filters/getAllCategories";
import { getAllYearGroups } from "./filters/getAllYearGroups";
import { rawSuvLessonsSchema } from "./rawSuvLessons.schema";

import { NEW_COHORT } from "@/config/cohort";

const unitListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string }) => {
    const res = await sdk.unitListing(args);
    const unitsForProgramme = res.units;

    if (!unitsForProgramme || unitsForProgramme.length === 0) {
      return null;
    }

    const parsedRawUnits = unitsForProgramme.map((p) =>
      rawSuvLessonsSchema.parse(p),
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

    const yearGroups = getAllYearGroups(units);

    const learningThemes = getAllLearningThemes(units);

    const subjectCategories = getAllCategories(parsedRawUnits);

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
