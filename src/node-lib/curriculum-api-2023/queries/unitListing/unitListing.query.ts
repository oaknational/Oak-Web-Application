import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import { reshapeUnitData } from "./helpers/reshapeUnitData";
import { getAllLearningThemes } from "./helpers/getAllLearningThemes";
import {
  applySlugsToUnitCategories,
  getAllCategories,
} from "./helpers/getAllCategories";
import { getAllYearGroups } from "./helpers/getAllYearGroups";
import {
  ProgrammeFieldsCamel,
  rawQuerySchema,
  UnitListingData,
} from "./unitListing.schema";

import { NEW_COHORT } from "@/config/cohort";
import keysToCamelCase from "@/utils/snakeCaseConverter";

const getTierData = (programmeSlug: string): UnitListingData["tiers"] => [
  {
    tierSlug: "foundation",
    tierTitle: "Foundation",
    tierOrder: 1,
    tierProgrammeSlug: programmeSlug.replace("-higher", "-foundation"),
  },
  {
    tierSlug: "higher",
    tierTitle: "Higher",
    tierOrder: 2,
    tierProgrammeSlug: programmeSlug.replace("-foundation", "-higher"),
  },
];

const unitListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string }) => {
    const res = await sdk.unitListing(args);

    const unitsSnake = res.units;

    if (!unitsSnake || unitsSnake.length === 0) {
      return null;
    }

    let parsedUnits;
    try {
      parsedUnits = rawQuerySchema.parse(unitsSnake);
    } catch (e) {
      console.log(e);
      throw new OakError({
        code: "curriculum-api/internal-error",
        meta: { error: e },
      });
    }

    const unitsCamel = keysToCamelCase(parsedUnits);

    const programmeFields = unitsCamel.reduce(
      (acc, val) => ({ ...acc, ...val.programmeFields }),
      {} as ProgrammeFieldsCamel,
    );

    const reshapedUnits = reshapeUnitData(unitsCamel);

    const yearGroups = getAllYearGroups(reshapedUnits);
    const learningThemes = getAllLearningThemes(reshapedUnits);
    const subjectCategories = getAllCategories(reshapedUnits);
    const unitsWithSubjectCategories = applySlugsToUnitCategories(
      subjectCategories,
      reshapedUnits,
    );
    const tiers = programmeFields.tierSlug
      ? getTierData(args.programmeSlug)
      : [];

    const hasNewContent = reshapedUnits
      .flatMap((unit) => unit.flatMap((u) => u.cohort ?? "2020-2023"))
      .includes(NEW_COHORT);

    return {
      programmeSlug: args.programmeSlug,
      keyStageSlug: programmeFields.keystageSlug,
      keyStageTitle: programmeFields.keystageDescription,
      examBoardSlug: programmeFields.examboardSlug,
      examBoardTitle: programmeFields.examboard,
      subjectSlug: programmeFields.subjectSlug,
      subjectTitle: programmeFields.subject,
      subjectParent: programmeFields.subjectParent || null,
      tierSlug: programmeFields.tierSlug,
      tiers: tiers,
      units: unitsWithSubjectCategories,
      phase: programmeFields.phaseSlug,
      learningThemes: learningThemes,
      hasNewContent,
      subjectCategories,
      yearGroups,
    };
  };

export default unitListingQuery;
