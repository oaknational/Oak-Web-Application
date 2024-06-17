import { syntheticUnitvariantLessonsSchema } from "@oaknational/oak-curriculum-schema";

import {
  InputMaybe,
  Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_6_0_0_Bool_Exp,
} from "../../generated/sdk";

import lessonDownloadsSchema, {
  downloadsAssetData,
} from "./lessonDownloads.schema";
import { constructDownloadsArray } from "./downloadUtils";
import constructCanonicalLessonDownloads from "./constructCanonicalLessonDownloads";
import constructLessonDownloads from "./constructLessonDownloads";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import lessonDownloadsCanonicalSchema from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloadsCanonical.schema";
import keysToCamelCase from "@/utils/snakeCaseConverter";

const lessonDownloadsQuery =
  (sdk: Sdk) =>
  async <T>(args: {
    programmeSlug?: string;
    unitSlug?: string;
    lessonSlug: string;
  }): Promise<T> => {
    const { lessonSlug, unitSlug, programmeSlug } = args;

    const browseDataWhere: InputMaybe<Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_6_0_0_Bool_Exp> =
      {};

    const canonicalLesson = !unitSlug && !programmeSlug;

    if (canonicalLesson) {
      browseDataWhere["lesson_slug"] = { _eq: lessonSlug };
    }

    if (unitSlug) {
      browseDataWhere["unit_slug"] = { _eq: unitSlug };
    }

    if (programmeSlug) {
      browseDataWhere["programme_slug"] = { _eq: programmeSlug };
    }

    const res = await sdk.lessonDownloads({ lessonSlug, browseDataWhere });

    if (
      !res.download_assets ||
      !res.browse_data ||
      res.download_assets.length === 0 ||
      res.browse_data.length === 0
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

    const { download_assets, browse_data } = res;

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

    console.log(downloadsData, "<<< DOWNLOPADS DATA");

    const downloads = constructDownloadsArray(downloadsData);

    // Copyright content pre-parsed
    const currentLesson = browse_data.find(
      (lesson) => lesson.lesson_slug === lessonSlug,
    );
    const copyright = currentLesson?.lesson_data.copyright_content
      ? keysToCamelCase(currentLesson?.lesson_data.copyright_content)
      : null;

    const parsedBrowseData = browse_data.map((bd) =>
      syntheticUnitvariantLessonsSchema.parse(bd),
    );

    if (canonicalLesson) {
      const canonicalLessonDownloads = constructCanonicalLessonDownloads(
        downloads,
        lessonSlug,
        parsedBrowseData,
        is_legacy,
        copyright,
      );
      return lessonDownloadsCanonicalSchema.parse(
        canonicalLessonDownloads,
      ) as T;
    } else {
      const lessonDownloads = constructLessonDownloads(
        downloads,
        lessonSlug,
        parsedBrowseData,
        copyright,
        expired,
      );

      return lessonDownloadsSchema.parse({
        ...lessonDownloads,
        isLegacy: false,
        isSpecialist: false,
      }) as T;
    }
  };

export type LessonDownloadsQuery = ReturnType<typeof lessonDownloadsQuery>;
export default lessonDownloadsQuery;
