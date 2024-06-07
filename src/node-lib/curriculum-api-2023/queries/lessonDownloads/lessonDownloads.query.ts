import {
  SyntheticUnitvariantLessons,
  syntheticUnitvariantLessonsSchema,
} from "@oaknational/oak-curriculum-schema";

import errorReporter from "../../../../common-lib/error-reporter";
import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import lessonDownloadsSchema, {
  downloadsAssetData,
} from "./lessonDownloads.schema";
import {
  constructDownloadsArray,
  constructLessonListingObjectArray,
  getNextLessonsInUnit,
} from "./downloadUtils";

// ADD TEST FOR CORRECT RESOURCES

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

    const parsedUnitLessons = syntheticUnitvariantLessonsSchema.parse(
      unit_lessons[0],
    );

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

    const downloads = constructDownloadsArray(downloadsData);

    const unitLessonsArray = constructLessonListingObjectArray(
      res.unit_lessons as SyntheticUnitvariantLessons[],
    );
    const nextLessons = getNextLessonsInUnit(unitLessonsArray, args.lessonSlug);

    const pageData = {
      downloads,
      programmeSlug: parsedUnitLessons.programme_slug,
      keyStageSlug: parsedUnitLessons.programme_fields.keystage_slug,
      keyStageTitle: parsedUnitLessons.programme_fields.keystage_description,
      lessonSlug: parsedUnitLessons.lesson_slug,
      lessonTitle: parsedUnitLessons.lesson_data.title,
      subjectSlug: parsedUnitLessons.programme_fields.subject_slug,
      subjectTitle: parsedUnitLessons.programme_fields.subject,
      unitSlug: parsedUnitLessons.unit_data.slug,
      unitTitle: parsedUnitLessons.unit_data.title,
      lessonCohort: parsedUnitLessons.lesson_data._cohort,
      expired: expired ? expired : null,
      updatedAt: parsedUnitLessons.lesson_data.updated_at,
    };

    return lessonDownloadsSchema.parse({
      ...pageData,
      nextLessons,
      isLegacy: false,
      isSpecialist: false,
    });
  };

export default lessonDownloadsQuery;
