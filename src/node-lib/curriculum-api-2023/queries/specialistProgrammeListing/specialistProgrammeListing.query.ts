import { Sdk } from "../../sdk";

import {
  SpecialistProgrammeListingPageData,
  SpecialistProgrammeQueryResponseSchema,
  specialistProgrammeQueryResponseSchema,
} from "./specialistProgrammeListing.schema";

export const transformProgrammes = (
  rawprogrammes: SpecialistProgrammeQueryResponseSchema,
) => {
  return rawprogrammes.reduce((acc, programme) => {
    if (!acc.subjectSlug) {
      acc.subjectSlug = programme.combined_programme_fields.subject_slug;
    }
    if (!acc.subjectTitle) {
      acc.subjectTitle = programme.combined_programme_fields.subject;
    }
    const newProgramme = {
      programmeSlug: programme.synthetic_programme_slug,
      developmentStageSlug:
        programme.combined_programme_fields.developmentstage_slug,
      developmentStageTitle:
        programme.combined_programme_fields.developmentstage,
    };
    if (acc.programmes) {
      acc.programmes.push(newProgramme);
    } else {
      acc.programmes = [newProgramme];
    }

    return acc;
  }, {} as SpecialistProgrammeListingPageData);
};

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

    const programmes = transformProgrammes(parsedProgrammes);

    return programmes;
  };

export default specialistProgrammeListingQuery;
