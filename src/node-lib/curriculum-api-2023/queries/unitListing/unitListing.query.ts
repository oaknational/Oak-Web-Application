import { syntheticUnitvariantLessonsSchema } from "@oaknational/oak-curriculum-schema";

import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import { getTiersForProgramme } from "./tiers/getTiersForProgramme";
import { getUnitsForProgramme } from "./units/getUnitsForProgramme";
import { getAllLearningThemes } from "./threads/getAllLearningThemes";

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

    const firstProgramme = parsedProgramme[0];
    if (!firstProgramme) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const programmeFields = firstProgramme.programme_fields;

    const hasTiers = parsedProgramme.some(
      (p) => p.programme_fields.tier_slug !== null,
    );

    const isLegacy = firstProgramme.is_legacy;

    const tiers = hasTiers
      ? await getTiersForProgramme(
          sdk,
          programmeFields.subject_slug,
          programmeFields.keystage_slug,
          programmeFields.examboard_slug,
          isLegacy,
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
      tiers: tiers,
      units: units,
      learningThemes: learningThemes,
    };
  };

export default unitListingQuery;
