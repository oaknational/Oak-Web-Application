import {
  SyntheticUnitvariantLessons,
  syntheticUnitvariantLessonsSchema,
} from "@oaknational/oak-curriculum-schema";

import lessonDownloadsSchema, {
  downloadsAssetData,
} from "./lessonDownloads.schema";
import {
  constructDownloadsArray,
  constructLessonListingObjectArray,
  getNextLessonsInUnit,
} from "./downloadUtils";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

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

    const { download_assets, unit_lessons } = res;

    const {
      has_slide_deck_asset_object,
      has_worksheet_asset_object,
      has_supplementary_asset_object,
      has_worksheet_answers_asset_object,
      has_worksheet_google_drive_downloadable_version,
      starter_quiz,
      exit_quiz,
      is_legacy,
      expired,
    } = downloadsAssetData.parse(download_assets[0]);

    const currentLesson = unit_lessons.find(
      (lesson) => lesson.lesson_slug === args.lessonSlug,
    );

    const copyright = keysToCamelCase(
      currentLesson?.lesson_data.copyright_content,
    );

    const parsedCurrentLesson =
      syntheticUnitvariantLessonsSchema.parse(currentLesson);

    // parsing currentLesson returns empty copyright object?

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
      copyrightContent: currentLesson?.lesson_data.copyright_content,
    };

    const downloads = constructDownloadsArray(downloadsData);

    const unitLessonsArray = constructLessonListingObjectArray(
      res.unit_lessons as SyntheticUnitvariantLessons[],
    );
    const nextLessons = getNextLessonsInUnit(unitLessonsArray, args.lessonSlug);

    const pageData = {
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

    return lessonDownloadsSchema.parse({
      ...pageData,
      nextLessons,
      isLegacy: false,
      isSpecialist: false,
    });
  };

export default lessonDownloadsQuery;
