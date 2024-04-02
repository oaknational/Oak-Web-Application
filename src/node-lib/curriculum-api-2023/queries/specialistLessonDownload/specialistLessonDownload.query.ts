import { z } from "zod";

import { Sdk } from "../../sdk";
import { lessonDownloadsListSchema } from "../../shared.schema";
import { SpecialistLessonDataRaw } from "../specialistLessonOverview/specialistLessonOverview.schema";

import {
  SpecialistLessonDownloadRaw,
  SpecialistLessonDownloads,
  specialistLessonDownloadQueryResponseSchema,
} from "./specialistLessonDownload.schema";

export const constructDownloadsArray = (
  lesson: SpecialistLessonDownloadRaw,
): z.infer<typeof lessonDownloadsListSchema> => {
  const presentation = {
    exists: lesson.presentation_url ? true : false,
    type: "presentation" as const,
    label: "Slide deck",
    ext: "pptx",
    forbidden: lesson.contains_copyright_content,
  };
  const introQuizQuestions = {
    exists:
      lesson.starter_quiz && lesson.starter_quiz_asset_object ? true : false,
    type: "intro-quiz-questions" as const,
    label: "Starter quiz questions",
    ext: "pdf",
    forbidden: false,
  };
  const introQuizAnswers = {
    exists:
      lesson.starter_quiz && lesson.starter_quiz_asset_object ? true : false,
    type: "intro-quiz-answers" as const,
    label: "Starter quiz answers",
    ext: "pdf",
    forbidden: false,
  };
  const exitQuizQuestions = {
    exists: lesson.exit_quiz && lesson.exit_quiz_asset_object ? true : false,
    type: "exit-quiz-questions" as const,
    label: "Exit quiz questions",
    ext: "pdf",
    forbidden: false,
  };
  const exitQuizAnswers = {
    exists: lesson.exit_quiz && lesson.exit_quiz_asset_object ? true : false,
    type: "exit-quiz-answers" as const,
    label: "Exit quiz answers",
    ext: "pdf",
    forbidden: false,
  };
  const worksheetPdf = {
    exists:
      typeof lesson.worksheet_asset_object
        ?.google_drive_downloadable_version === "string",
    type: "worksheet-pdf" as const,
    label: "Worksheet",
    ext: "pdf",
    forbidden: false,
  };
  const worksheetPptx = {
    exists:
      typeof lesson.worksheet_asset_object
        ?.google_drive_downloadable_version === "string",
    type: "worksheet-pptx" as const,
    label: "Worksheet",
    ext: "pptx",
    forbidden: false,
  };

  return [
    presentation,
    introQuizQuestions,
    introQuizAnswers,
    exitQuizQuestions,
    exitQuizAnswers,
    worksheetPdf,
    worksheetPptx,
  ];
};

export const constructHasDownloadableResources = (
  lesson: SpecialistLessonDownloadRaw | SpecialistLessonDataRaw[number],
) => {
  return (
    (!!lesson.presentation_url &&
      lesson.contains_copyright_content === false) ||
    (!!lesson.starter_quiz && !!lesson.starter_quiz_asset_object) ||
    (!!lesson.exit_quiz && !!lesson.exit_quiz_asset_object) ||
    !!lesson.worksheet_url
  );
};

export const specialistLessonDownloadQuery =
  (sdk: Sdk) =>
  async (args: {
    lessonSlug: string;
    unitSlug: string;
    programmeSlug: string;
  }): Promise<SpecialistLessonDownloads> => {
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
      parsedSpecialistLessonDownloads.length === 0 ||
      !parsedSpecialistLessonDownloads[0]
    ) {
      throw new Error("curriculum-api/not-found");
    }

    const lesson = parsedSpecialistLessonDownloads[0];
    const downloads = constructDownloadsArray(lesson);
    const hasDownloadableResources = constructHasDownloadableResources(lesson);

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
        downloads: downloads,
        nextLessons: [], // TODO: specialist MV needs to be update to support this functionality
        hasDownloadableResources: hasDownloadableResources,
        expired: lesson.expired ?? false,
      },
    };
  };
