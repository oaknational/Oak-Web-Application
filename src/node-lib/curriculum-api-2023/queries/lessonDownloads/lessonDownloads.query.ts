import {
  SyntheticUnitvariantLessons,
  syntheticUnitvariantLessonsSchema,
} from "@oaknational/oak-curriculum-schema";

import errorReporter from "../../../../common-lib/error-reporter";
import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import getNextLessonsInUnit from "./getNextLessonsInUnit";
import lessonDownloadsSchema, {
  LessonDownloadsListSchema,
  LessonDownloadsPageData,
  lessonDownloadsQueryRaw,
  downloadsAssetData,
} from "./lessonDownloads.schema";

export const getDownloadsArray = (content: {
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

const constructLessonListingObjectArray = (
  unitLessons: SyntheticUnitvariantLessons[],
) => {
  const unitLessonsArray = unitLessons.map((lesson) => {
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
  return unitLessonsArray;
};

const lessonDownloadsQuery =
  (sdk: Sdk) =>
  async (args: {
    programmeSlug: string;
    unitSlug: string;
    lessonSlug: string;
  }) => {
    const res = await sdk.lessonDownloads(args);

    if (
      !res.download_assets ||
      !res.unit_lessons ||
      res.download_assets.length === 0 ||
      res.unit_lessons.length === 0
    ) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const { download_assets, unit_lessons } =
      lessonDownloadsQueryRaw.parse(res);

    const {
      has_slide_deck_asset_object,
      has_worksheet_asset_object,
      has_supplementary_asset_object,
      has_worksheet_answers_asset_object,
      has_worksheet_google_drive_downloadable_version,
      starter_quiz,
      exit_quiz,
      is_legacy,
    } = downloadsAssetData.parse(download_assets[0]);

    const { programme_slug } = syntheticUnitvariantLessonsSchema.parse(
      unit_lessons[0],
    );

    const { updated_at } = syntheticUnitvariantLessonsSchema.parse(
      unit_lessons[0],
    ).lesson_data;

    const { subject, subject_slug, keystage_slug, keystage_description } =
      syntheticUnitvariantLessonsSchema.parse(unit_lessons[0]).programme_fields;

    const { title, slug } = syntheticUnitvariantLessonsSchema.parse(
      unit_lessons[0],
    ).unit_data;

    const downloadsData = {
      hasSlideDeckAssetObject: has_slide_deck_asset_object,
      hasStarterQuiz: starter_quiz ? true : false,
      hasExitQuiz: exit_quiz ? true : false,
      hasWorksheetAssetObject: has_worksheet_asset_object,
      hasWorksheetAnswersAssetObject: has_worksheet_answers_asset_object,
      hasWorksheetGoogleDriveDownloadableVersion:
        has_worksheet_google_drive_downloadable_version,
      hasSupplementaryAssetObject: has_supplementary_asset_object,
      isLegacy: is_legacy,
    };

    const downloads = getDownloadsArray(downloadsData);

    const pageData = {
      downloads,
      programmeSlug: programme_slug,
      keyStageSlug: keystage_slug,
      keyStageTitle: keystage_description,
      lessonSlug: args.lessonSlug,
      lessonTitle: title,
      subjectSlug: subject_slug,
      subjectTitle: subject,
      unitSlug: slug,
      unitTitle: title,
      lessonCohort: null,
      expired: null,
      updatedAt: updated_at,
    };

    if (res.download_assets.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::lessonDownloads")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    const unitLessonsArray = constructLessonListingObjectArray(
      res.unit_lessons as SyntheticUnitvariantLessons[],
    );

    const nextLessons = getNextLessonsInUnit(unitLessonsArray, args.lessonSlug);

    return lessonDownloadsSchema.parse({
      ...pageData,
      nextLessons,
      isLegacy: false,
      isSpecialist: false,
    });
  };

export default lessonDownloadsQuery;
