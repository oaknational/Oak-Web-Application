import { Sdk } from "../../sdk";

import { specialistUnitsAndLessonCountSchema } from "./specialistSubjectListing.schema";

import OakError from "@/errors/OakError";

const specialistUnitsAndLessonCountsQuery =
  (sdk: Sdk) => async (args: { subject: string }) => {
    const res = await sdk.specialistUnitsAndLessonCount({
      _contains: { subject_slug: args.subject },
    });

    const { unitCount, lessonCount } =
      specialistUnitsAndLessonCountSchema.parse(res);

    if (!unitCount || !lessonCount) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    return { unitCount, lessonCount };
  };

export default specialistUnitsAndLessonCountsQuery;
