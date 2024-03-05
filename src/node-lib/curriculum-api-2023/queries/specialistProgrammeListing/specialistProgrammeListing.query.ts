import { Sdk } from "../../sdk";

import { specialistProgrammeQueryResponseSchema } from "./specialistProgrammeListing.schema";

const specialistProgrammeListingQuery =
  (sdk: Sdk) => async (args: { subjectSlug: string }) => {
    const { specialistProgrammeListing } = await sdk.specialistProgrammeListing(
      {
        _contains: { subject_slug: args.subjectSlug },
      },
    );
    const parsedProgrammes = specialistProgrammeQueryResponseSchema.parse(
      specialistProgrammeListing,
    );

    if (!parsedProgrammes || parsedProgrammes.length === 0) {
      throw new Error("curriculum-api/not-found");
    }

    const programmes = parsedProgrammes.map((programme) => {
      return {
        programmeSlug: programme.synthetic_programme_slug,
        developmentStageSlug:
          programme.combined_programme_fields.developmentstage_slug,
        developmentStageTitle:
          programme.combined_programme_fields.developmentstage,
      };
    });

    return programmes;
  };

export default specialistProgrammeListingQuery;
