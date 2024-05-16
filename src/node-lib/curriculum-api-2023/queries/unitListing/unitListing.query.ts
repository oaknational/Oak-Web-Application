import { syntheticUnitvariantLessonsSchema } from "@oaknational/oak-curriculum-schema";

import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import { getTiersForProgramme } from "./getTiersForProgramme";
import { getUnitsForProgramme } from "./getUnitsForProgramme";

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

    return {
      programmeSlug: args.programmeSlug,
      keyStageSlug: programmeFields.keystage_slug,
      keyStageTitle: programmeFields.keystage_description,
      examBoardSlug: programmeFields.examboard_slug,
      examBoardTitle: programmeFields.examboard_description,
      subjectSlug: programmeFields.subject_slug,
      subjectTitle: programmeFields.subject_description,
      totalUnitCount: parsedProgramme.length,
      tierSlug: programmeFields.tier_slug,
      tiers: tiers, // TODO: core tier
      units: units,
    };
  };

export default unitListingQuery;
