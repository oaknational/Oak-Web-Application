import { syntheticUnitvariantLessonsSchema } from "@oaknational/oak-curriculum-schema";

import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import { getTiersForProgramme } from "./getTiersForProgramme";
import { getUnitsForProgramme } from "./getUnitsForProgramme";
import { LearningThemes, UnitData } from "./unitListing.schema";

const getAllLearningThemes = (units: Array<Array<UnitData>>) => {
  return units.flat().reduce((acc, unit) => {
    unit.learningThemes?.forEach((theme) => {
      if (!acc.find((t) => t.themeSlug === theme.themeSlug)) {
        acc.push(theme);
      }
    });
    return acc;
  }, [] as LearningThemes);
};

const unitListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string }) => {
    const res = await sdk.unitListing(args);

    const programme = res.programme;

    if (!programme || programme.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const parsedProgramme = programme.map((p) =>
      syntheticUnitvariantLessonsSchema.parse(p),
    );

    const programmeFields = parsedProgramme[0]?.programme_fields;
    if (!programmeFields) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const hasTiers = parsedProgramme.some(
      (p) => p.programme_fields.tier_slug !== null,
    );

    const tiers = hasTiers
      ? await getTiersForProgramme(
          sdk,
          programmeFields.subject_slug,
          programmeFields.keystage_slug,
          programmeFields.examboard_slug,
        )
      : [];
    const units = await getUnitsForProgramme(parsedProgramme);
    const learningThemes = getAllLearningThemes(units);

    return {
      programmeSlug: args.programmeSlug,
      keyStageSlug: programmeFields.keystage_slug,
      keyStageTitle: programmeFields.keystage_description,
      examBoardSlug: programmeFields.examboard_slug,
      examBoardTitle: programmeFields.examboard,
      subjectSlug: programmeFields.subject_slug,
      subjectTitle: programmeFields.subject,
      totalUnitCount: parsedProgramme.length,
      tierSlug: programmeFields.tier_slug,
      tiers: tiers, // TODO: core tier
      units: units,
      learningThemes: learningThemes,
    };
  };

export default unitListingQuery;
