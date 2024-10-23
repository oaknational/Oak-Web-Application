import { constructLessonBrowseQuery } from "../../helpers";

import lessonDownloadsSchema, {
  downloadsAssetData,
} from "./lessonDownloads.schema";
import { constructDownloadsArray } from "./downloadUtils";
import constructCanonicalLessonDownloads from "./constructCanonicalLessonDownloads";
import constructLessonDownloads from "./constructLessonDownloads";
import { rawSyntheticUVLessonSchema } from "./rawSyntheticUVLesson.schema";

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

    const browseDataWhere = constructLessonBrowseQuery({
      programmeSlug,
      unitSlug,
      lessonSlug,
    });

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
      geo_restricted,
      login_required,
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

    // Copyright content pre-parsed
    const currentLesson = browse_data.find(
      (lesson) => lesson.lesson_slug === lessonSlug,
    );
    const copyright = currentLesson?.lesson_data.copyright_content
      ? keysToCamelCase(currentLesson?.lesson_data.copyright_content)
      : null;

    const parsedBrowseData = browse_data.map((bd) =>
      rawSyntheticUVLessonSchema.parse(bd),
    );

    const canonicalLesson = !unitSlug && !programmeSlug;
    if (canonicalLesson) {
      const canonicalLessonDownloads = constructCanonicalLessonDownloads(
        downloads,
        lessonSlug,
        parsedBrowseData,
        is_legacy,
        copyright,
        { geoRestricted: geo_restricted, loginRequired: login_required },
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
        geoRestricted: geo_restricted,
        loginRequired: login_required,
      }) as T;
    }
  };

export type LessonDownloadsQuery = ReturnType<typeof lessonDownloadsQuery>;
export default lessonDownloadsQuery;
