import { Sdk } from "../../sdk";

import {
  SpecialistLessonMedia,
  specialistLessonMediaQueryResponseSchema,
} from "./specialistLessonMedia.schema";

export const specialistLessonMediaQuery =
  (sdk: Sdk) =>
  async (args: {
    lessonSlug: string;
    unitSlug: string;
    programmeSlug: string;
  }): Promise<SpecialistLessonMedia> => {
    const { programmeSlug, unitSlug, lessonSlug } = args;
    const { specialistLessonMedia, restrictions } =
      await sdk.specialistLessonMedia({
        lessonSlug: lessonSlug,
        unitSlug: unitSlug,
        programmeSlug: programmeSlug,
      });

    const parsedSpecialistLessonMedia =
      specialistLessonMediaQueryResponseSchema.parse(specialistLessonMedia);

    if (
      !parsedSpecialistLessonMedia ||
      parsedSpecialistLessonMedia.length === 0 ||
      !parsedSpecialistLessonMedia[0]
    ) {
      throw new Error("curriculum-api/not-found");
    }

    const lesson = parsedSpecialistLessonMedia[0];

    return {
      lesson: {
        isSpecialist: true,
        subjectTitle: lesson.combined_programme_fields.subject,
        subjectSlug: lesson.combined_programme_fields.subject_slug,
        unitTitle: lesson.unit_title,
        developmentStageTitle:
          lesson.combined_programme_fields.developmentstage ?? "",
        unitSlug: unitSlug,
        programmeSlug: programmeSlug,
        isLegacy: false,
        lessonTitle: lesson.lesson_title,
        lessonSlug: lessonSlug,
        expired: lesson.expired ?? false,
        updatedAt: "2022",
        geoRestricted: restrictions.at(0)?.geo_restricted ?? null,
        loginRequired: restrictions.at(0)?.login_required ?? null,
      },
    };
  };
