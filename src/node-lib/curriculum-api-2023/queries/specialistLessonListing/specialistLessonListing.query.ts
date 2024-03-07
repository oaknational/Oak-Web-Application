import { Sdk } from "../../sdk";

const specialistLessonListingQuery =
  (sdk: Sdk) => async (args: { unitSlug: string; programmeSlug: string }) => {
    const { specialistLessonListing } = await sdk.specialistLessonListing({
      unitSlug: args.unitSlug,
      programmeSlug: args.programmeSlug,
    });

    if (!specialistLessonListing || specialistLessonListing.length === 0) {
      throw new Error("curriculum-api/not-found");
    }

    return specialistLessonListing;
  };

export default specialistLessonListingQuery;
