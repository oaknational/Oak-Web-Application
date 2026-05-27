import { z } from "zod";

import { Sdk } from "../../sdk";

import {
  SpecialistLessonShareData,
  specialistLessonShareQueryResponseSchema,
} from "./specialistLessonShare.schema";

export const constructShareableResources = (
  lesson: z.infer<typeof specialistLessonShareQueryResponseSchema>,
) => {
  const introQuiz = {
    exists: lesson.starter_quiz !== null,
    type: "starter-quiz" as const,
    label: "Starter Quiz",
    metadata: "", // TODO: get quiz questions
  };
  const exitQuiz = {
    exists: lesson.exit_quiz !== null,
    type: "exit-quiz" as const,
    label: "Exit Quiz",
    metadata: "", // TODO: get quiz questions
  };
  const video = {
    exists: lesson.video_mux_playback_id !== null,
    type: "video" as const,
    label: "Video",
    metadata: "mp4", // TODO: get video duration
  };

  return [video, introQuiz, exitQuiz];
};

export const specialistLessonShareQuery =
  (sdk: Sdk) =>
  async (args: {
    lessonSlug: string;
    unitSlug: string;
    programmeSlug: string;
  }): Promise<SpecialistLessonShareData> => {
    const { specialistLessonShare } = await sdk.specialistLessonShare(args);

    const parsedSpecialistLessonShare =
      specialistLessonShareQueryResponseSchema.safeParse(
        specialistLessonShare[0],
      );

    if (!parsedSpecialistLessonShare || !parsedSpecialistLessonShare.success) {
      throw new Error("curriculum-api/not-found");
    }

    const lesson = parsedSpecialistLessonShare.data;

    const shareableResources = constructShareableResources(lesson);

    return {
      programmeSlug: lesson.synthetic_programme_slug,
      lessonSlug: args.lessonSlug,
      lessonTitle: lesson.lesson_title,
      unitSlug: args.unitSlug,
      unitTitle: lesson.unit_title,
      subjectSlug: lesson.combined_programme_fields.subject_slug,
      subjectTitle: lesson.combined_programme_fields.subject,
      developmentStageTitle:
        lesson.combined_programme_fields.developmentstage ?? "",
      expired: lesson.expired,
      isLegacy: true,
      isSpecialist: true,
      shareableResources,
      lessonReleaseDate: lesson.lesson_release_date ?? "unpublished",
    };
  };
