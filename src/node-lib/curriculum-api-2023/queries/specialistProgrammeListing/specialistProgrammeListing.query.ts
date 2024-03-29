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

export const sortByDevelopmentStage = <
  T extends Array<{
    combined_programme_fields: {
      developmentstage_slug?: string | null;
      developmentstage_display_order?: number | null;
    };
  }>,
>(
  programmes: T,
) => {
  return programmes.sort((a, b) => {
    // The 'order' values are in reverse, for some reason, except for masterclass
    if (a.combined_programme_fields.developmentstage_slug === "masterclass") {
      return 1;
    } else if (
      b.combined_programme_fields.developmentstage_slug === "masterclass"
    ) {
      return -1;
    }
    if (
      !a.combined_programme_fields.developmentstage_display_order ||
      !b.combined_programme_fields.developmentstage_display_order
    ) {
      return 0;
    } else
      return (
        b.combined_programme_fields.developmentstage_display_order -
        a.combined_programme_fields.developmentstage_display_order
      );
  });
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

    const programmes = await transformProgrammes(
      sortByDevelopmentStage(parsedProgrammes),
    );

    return programmes;
  };

export default specialistProgrammeListingQuery;
