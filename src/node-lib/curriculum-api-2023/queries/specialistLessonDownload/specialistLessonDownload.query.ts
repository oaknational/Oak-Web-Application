import { Sdk } from "../../sdk";

import { specialistLessonDownloadQueryResponseSchema } from "./specialistLessonDownload.schema";

export const specialistLessonDownloadQuery =
  (sdk: Sdk) =>
  async (args: {
    lessonSlug: string;
    unitSlug: string;
    programmeSlug: string;
  }) => {
    const { programmeSlug, unitSlug, lessonSlug } = args;
    const { specialistLessonDownloads } = await sdk.specialistLessonDownloads({
      lessonSlug: lessonSlug,
      unitSlug: unitSlug,
      programmeSlug: programmeSlug,
    });

    const parsedSpecialistLessonDownloads =
      specialistLessonDownloadQueryResponseSchema.parse(
        specialistLessonDownloads,
      );

    if (
      !parsedSpecialistLessonDownloads ||
      parsedSpecialistLessonDownloads.length === 0
    ) {
      throw new Error("curriculum-api/not-found");
    }

    return parsedSpecialistLessonDownloads;
  };
