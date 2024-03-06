import { SpecialistProgrammeListingCountsDocument } from "../../generated/sdk";
import { Sdk, getBatchedRequests } from "../../sdk";

import {
  SpecialistProgrammeQueryResponseSchema,
  specialistProgrammeListingCountSchema,
  specialistProgrammeQueryResponseSchema,
} from "./specialistProgrammeListing.schema";

export const transformProgrammes = async (
  rawprogrammes: SpecialistProgrammeQueryResponseSchema,
) => {
  const subjectSlug = rawprogrammes[0]?.combined_programme_fields.subject_slug;
  const subjectTitle = rawprogrammes[0]?.combined_programme_fields.subject;

  if (!subjectSlug || !subjectTitle) {
    throw new Error("curriculum-api/not-found");
  }
  const programmesWithoutCounts = rawprogrammes.map((programme) => {
    return {
      programmeSlug: programme.synthetic_programme_slug,
      developmentStageSlug:
        programme.combined_programme_fields.developmentstage_slug,
      developmentStageTitle:
        programme.combined_programme_fields.developmentstage,
    };
  });

  const batchRequests = programmesWithoutCounts.map((programme) => {
    return {
      document: SpecialistProgrammeListingCountsDocument,
      variables: { programmeSlug: programme.programmeSlug },
    };
  });

  const counts = await getBatchedRequests(batchRequests);

  const programmesWithCounts = programmesWithoutCounts.map((programme, i) => {
    const count = counts[i]?.data;
    if (count) {
      const { unitCount, lessonCount } =
        specialistProgrammeListingCountSchema.parse(count);

      return {
        ...programme,
        unitCount: unitCount.aggregate.count,
        lessonCount: lessonCount.aggregate.count,
      };
    } else {
      throw new Error("curriculum-api/not-found");
    }
  });

  return {
    subjectSlug,
    subjectTitle,
    programmes: programmesWithCounts,
  };
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
