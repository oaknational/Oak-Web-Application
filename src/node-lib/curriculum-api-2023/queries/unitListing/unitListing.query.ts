import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import { getTiersForProgramme } from "./tiers/getTiersForProgramme";
import { getUnitsForProgramme } from "./units/getUnitsForProgramme";
import { getAllLearningThemes } from "./filters/getAllLearningThemes";
import { getAllCategories } from "./filters/getAllCategories";
import { getAllYearGroups } from "./filters/getAllYearGroups";
import { ProgrammeFieldsCamel, rawQuerySchema } from "./unitListing.schema";

import { NEW_COHORT } from "@/config/cohort";
import keysToCamelCase from "@/utils/snakeCaseConverter";

const unitListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string }) => {
    const res = await sdk.unitListing(args);

    const unitsSnake = res.units;

    if (!unitsSnake || unitsSnake.length === 0) {
      throw new OakError({
        code: "curriculum-api/not-found",
      });
    }

    rawQuerySchema.parse(unitsSnake);

    const unitsCamel = keysToCamelCase(unitsSnake);

    const programmeFields = unitsCamel.reduce(
      (acc, val) => ({ ...acc, ...val.programmeFields }),
      {} as ProgrammeFieldsCamel,
    );

    // sibling tiers
    const tiers = programmeFields.tierSlug ? ["foundation", "higher"] : [];

    const reshapedUnits = getUnitsForProgramme(unitsCamel);

    const yearGroups = getAllYearGroups(units);

    const learningThemes = getAllLearningThemes(units);

    const subjectCategories = getAllCategories(parsedRawUnits);

    const hasNewContent = units
      .flatMap((unit) => unit.flatMap((u) => u.cohort ?? "2020-2023"))
      .includes(NEW_COHORT);

    const isLegacy = unitsCamel.reduce(
      (acc, val) => Boolean(acc) || Boolean(val.isLegacy),
      false,
    );

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
