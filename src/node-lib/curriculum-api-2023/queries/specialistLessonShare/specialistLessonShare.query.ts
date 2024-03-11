import { Sdk } from "../../sdk";

import { specialistLessonShareQueryResponseSchema } from "./specialistLessonShare.schema";

export const specialistLessonShareQuery =
  (sdk: Sdk) =>
  async (args: {
    lessonSlug: string;
    unitSlug: string;
    programmeSlug: string;
  }) => {
    const { specialistLessonShare } = await sdk.specialistLessonShare(args);

    const parsedSpecialistLessonShare =
      specialistLessonShareQueryResponseSchema.safeParse(
        specialistLessonShare[0],
      );

    if (!parsedSpecialistLessonShare || !parsedSpecialistLessonShare.success) {
      throw new Error("curriculum-api/not-found");
    }

    return specialistLessonShare;
  };
