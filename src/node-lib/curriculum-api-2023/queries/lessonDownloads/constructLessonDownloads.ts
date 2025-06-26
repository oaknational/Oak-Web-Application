import {
  LessonDownloadsListSchema,
  LessonAdditionalFilesListSchema,
} from "./lessonDownloads.schema";
import {
  RawSyntheticUVLesson,
  rawSyntheticUVLessonSchema,
} from "./rawSyntheticUVLesson.schema";

import { toSentenceCase } from "@/node-lib/curriculum-api-2023/helpers";
import keysToCamelCase from "@/utils/snakeCaseConverter";

const constructLessonDownloads = ({
  downloads,
  additionalFiles,
  lessonSlug,
  parsedBrowseData,
  lessonCopyRight,
  expired,
}: {
  downloads: LessonDownloadsListSchema;
  additionalFiles?: LessonAdditionalFilesListSchema;
  lessonSlug: string;
  parsedBrowseData: RawSyntheticUVLesson[];
  lessonCopyRight: { copyrightInfo: string }[] | null;
  expired?: boolean | null;
}) => {
  const currentLesson = parsedBrowseData.find(
    (lesson) => lesson.lesson_slug === lessonSlug,
  );

  const parsedCurrentLesson = rawSyntheticUVLessonSchema.parse(currentLesson);
  const unitTitle =
    parsedCurrentLesson.programme_fields.optionality ??
    parsedCurrentLesson.unit_data.title;
  const downloadsPageData = {
    downloads,
    additionalFiles,
    programmeSlug: parsedCurrentLesson.programme_slug,
    keyStageSlug: parsedCurrentLesson.programme_fields.keystage_slug,
    keyStageTitle: toSentenceCase(
      parsedCurrentLesson.programme_fields.keystage_description,
    ),
    pathwayTitle: parsedCurrentLesson.programme_fields.pathway_description,
    lessonSlug: parsedCurrentLesson.lesson_slug,
    lessonTitle: parsedCurrentLesson.lesson_data.title,
    subjectSlug: parsedCurrentLesson.programme_fields.subject_slug,
    subjectTitle: parsedCurrentLesson.programme_fields.subject,
    unitSlug: parsedCurrentLesson.unit_slug,
    unitTitle,
    lessonCohort: parsedCurrentLesson.lesson_data._cohort,
    expired: expired ? expired : null,
    updatedAt: parsedCurrentLesson.lesson_data.updated_at,
    copyrightContent: lessonCopyRight,
    examBoardTitle: parsedCurrentLesson.programme_fields.examboard_description,
    tierTitle: parsedCurrentLesson.programme_fields.tier_description,
    actions: keysToCamelCase(parsedCurrentLesson.actions),
  };

  const unitLessonsArray = parsedBrowseData.map((lesson) => {
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
      hasLegacyCopyrightMaterial: lesson.lesson_data.copyright_content
        ? true
        : false,
      orderInUnit: lesson.order_in_unit,
      lessonCohort: lesson.lesson_data._cohort,
    };
  });

  const lessonsInOrder = unitLessonsArray.sort((a, b) =>
    (a.orderInUnit ?? 0) > (b.orderInUnit ?? 0) ? 1 : -1,
  );
  const lessonPositionIndex = lessonsInOrder.findIndex(
    (lesson) => lesson.lessonSlug === lessonSlug,
  );
  const nextLessons = lessonsInOrder.splice(lessonPositionIndex + 1, 3);

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

export default constructLessonDownloads;
