import {
  SyntheticUnitvariantLessons,
  syntheticUnitvariantLessonsSchema,
} from "@oaknational/oak-curriculum-schema";

import {
  LessonDownloadsListSchema,
  LessonDownloadsPageData,
} from "./lessonDownloads.schema";

import keysToCamelCase from "@/utils/snakeCaseConverter";

export const constructLessonDownloads = (
  downloads: LessonDownloadsListSchema,
  lessonSlug: string,
  browse_data: SyntheticUnitvariantLessons[],
  expired?: boolean | null,
) => {
  const currentLesson = browse_data.find(
    (lesson) => lesson.lesson_slug === lessonSlug,
  );

  const copyright = keysToCamelCase(
    currentLesson?.lesson_data.copyright_content,
  );

  const parsedCurrentLesson =
    syntheticUnitvariantLessonsSchema.parse(currentLesson);

  const downloadsPageData = {
    downloads,
    programmeSlug: parsedCurrentLesson.programme_slug,
    keyStageSlug: parsedCurrentLesson.programme_fields.keystage_slug,
    keyStageTitle: parsedCurrentLesson.programme_fields.keystage_description,
    lessonSlug: parsedCurrentLesson.lesson_slug,
    lessonTitle: parsedCurrentLesson.lesson_data.title,
    subjectSlug: parsedCurrentLesson.programme_fields.subject_slug,
    subjectTitle: parsedCurrentLesson.programme_fields.subject,
    unitSlug: parsedCurrentLesson.unit_data.slug,
    unitTitle: parsedCurrentLesson.unit_data.title,
    lessonCohort: parsedCurrentLesson.lesson_data._cohort,
    expired: expired ? expired : null,
    updatedAt: parsedCurrentLesson.lesson_data.updated_at,
    copyrightContent: copyright,
  };

  const unitLessonsArray = browse_data.map((lesson) => {
    return {
      lessonSlug: lesson.lesson_slug,
      lessonTitle: lesson.lesson_data.title,
      description: lesson.lesson_data.description,
      pupilLessonOutcome: lesson.lesson_data.pupil_lesson_outcome,
      expired: lesson.lesson_data.deprecated_fields ? true : false,
      quizCount:
        (lesson.lesson_data.quiz_id_starter ? 1 : 0) +
        (lesson.lesson_data.quiz_id_exit ? 1 : 0),
      videoCount: lesson.lesson_data.video_id ? 1 : 0,
      presentationCount: lesson.lesson_data.asset_id_slidedeck ? 1 : 0,
      worksheetCount: lesson.lesson_data.asset_id_worksheet ? 1 : 0,
      hasCopyrightMaterial: lesson.lesson_data.copyright_content ? true : false,
      orderInUnit: lesson.supplementary_data.order_in_unit,
      lessonCohort: lesson.lesson_data._cohort,
    };
  });

  const lessonInUnit = unitLessonsArray.find(
    (lesson) => lesson.lessonSlug === lessonSlug,
  );
  const lessonPosition = lessonInUnit?.orderInUnit;
  const nextLessons =
    lessonPosition &&
    unitLessonsArray
      .filter((lesson) =>
        lesson.orderInUnit ? lesson.orderInUnit > lessonPosition : [],
      )
      .splice(0, 3);

  return {
    ...downloadsPageData,
    nextLessons: nextLessons
      ? nextLessons.map(({ lessonSlug, lessonTitle }) => ({
          lessonSlug,
          lessonTitle,
        }))
      : [],
  };
};

export const constructDownloadsArray = (content: {
  hasSlideDeckAssetObject: boolean;
  hasStarterQuiz: boolean;
  hasExitQuiz: boolean;
  hasWorksheetAssetObject: boolean;
  hasWorksheetAnswersAssetObject: boolean;
  hasWorksheetGoogleDriveDownloadableVersion: boolean;
  hasSupplementaryAssetObject: boolean;
  isLegacy: boolean;
}): LessonDownloadsPageData["downloads"] => {
  const downloads: LessonDownloadsListSchema = [
    {
      exists: content.hasSlideDeckAssetObject,
      type: "presentation",
      ext: "pptx",
      label: "Slide deck",
      forbidden: null,
    },
    {
      exists: content.hasStarterQuiz,
      type: "intro-quiz-questions",
      label: "Starter quiz questions",
      ext: "pdf",
    },
    {
      exists: content.hasStarterQuiz,
      type: "intro-quiz-answers",
      label: "Starter quiz answers",
      ext: "pdf",
    },
    {
      exists: content.hasExitQuiz,
      type: "exit-quiz-questions",
      label: "Exit quiz questions",
      ext: "pdf",
    },
    {
      exists: content.hasExitQuiz,
      type: "exit-quiz-answers",
      label: "Exit quiz answers",
      ext: "pdf",
    },
    {
      exists:
        (!content.isLegacy &&
          (content.hasWorksheetAssetObject ||
            content.hasWorksheetAnswersAssetObject)) ||
        (content.isLegacy &&
          content.hasWorksheetGoogleDriveDownloadableVersion),
      type: "worksheet-pdf",
      label: "Worksheet",
      ext: "pdf",
    },
    {
      exists:
        (!content.isLegacy &&
          (content.hasWorksheetAssetObject ||
            content.hasWorksheetAnswersAssetObject)) ||
        (content.isLegacy &&
          content.hasWorksheetGoogleDriveDownloadableVersion),
      type: "worksheet-pptx",
      label: "Worksheet",
      ext: "pptx",
    },
    {
      exists: content.hasSupplementaryAssetObject,
      type: "supplementary-pdf",
      label: "Additional material",
      ext: "pdf",
    },
    {
      exists: content.hasSupplementaryAssetObject,
      type: "supplementary-docx",
      label: "Additional material",
      ext: "docx",
    },
  ];

  return downloads;
};
