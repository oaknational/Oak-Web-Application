import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";
import { lessonPathwaySchema } from "../../shared.schema";
import { constructDownloadsArray } from "../lessonDownloads/downloadUtils";
import { downloadsAssetData } from "../lessonDownloads/lessonDownloads.schema";

import lessonDownloadsCanonicalSchema, {
  LessonDownloadsCanonical,
} from "./lessonDownloadsCanonical.schema";

const lessonDownloadsCanonicalQuery =
  (sdk: Sdk) => async (args: { lessonSlug: string }) => {
    const res = await sdk.lessonDownloadsCanonical(args);
    const { download_assets, lesson_pathways } = res;

    if (!download_assets.length || !lesson_pathways.length) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

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

    const baseDownloads = {
      downloads: downloads,
      isLegacy: is_legacy,
      lessonSlug: args.lessonSlug,
      lessonTitle: lesson_pathways[0]?.lesson_data.title,
      expired: null,
      isSpecialist: false,
      updatedAt: lesson_pathways[0]?.lesson_data.updated_at,
      copyrightContent: lesson_pathways[0]?.lesson_data.copyright_content,
    };

    /**
     * When a lesson appears in multiple pathways, the query returns multiple
     * results. We need to merge these results into a single object, with the
     * pathways array containing all the pathways that the lesson appears in.
     */

    const lessonDownloadsWithPathways = lesson_pathways.reduce(
      (acc, lesson) => {
        const pathwayLesson = {
          programmeSlug: lesson.programme_slug,
          unitSlug: lesson.unit_data.slug,
          unitTitle: lesson.unit_data.title,
          keyStageSlug: lesson.programme_fields.keystage_slug,
          keyStageTitle: lesson.programme_fields.keystage_description,
          subjectSlug: lesson.programme_fields.subject_slug,
          subjectTitle: lesson.programme_fields.subject,
          lessonCohort: lesson.lesson_data._cohort,
          examBoardSlug: lesson.programme_fields.examboard_slug,
          examBoardTitle: lesson.programme_fields.examboard,
          lessonSlug: lesson.lesson_slug,
          lessonTitle: lesson.lesson_data.title,
          tierSlug: lesson.programme_fields.tier_slug,
          tierTitle: lesson.programme_fields.tier_description,
        };

        const pathway = lessonPathwaySchema.parse(pathwayLesson);
        return {
          ...acc,
          pathways: [...acc.pathways, pathway],
        };
      },
      {
        ...baseDownloads,
        pathways: [],
        isLegacy: false,
        isSpecialist: false,
      } as LessonDownloadsCanonical,
    );

    return lessonDownloadsCanonicalSchema.parse(lessonDownloadsWithPathways);
  };

export default lessonDownloadsCanonicalQuery;
