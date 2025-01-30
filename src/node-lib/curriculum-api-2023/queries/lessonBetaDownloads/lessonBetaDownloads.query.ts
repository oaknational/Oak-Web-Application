import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import OakError from "@/errors/OakError";
import { LessonBetaDownloadsQuery as SdkLessonBetaDownloadsQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import lessonDownloadsSchema, {
  downloadsAssetData,
} from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import {
  constructAdditionalFilesDownloads,
  constructDownloadsArray,
} from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/downloadUtils";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import { rawSyntheticUVLessonSchema } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/rawSyntheticUVLesson.schema";
import constructLessonDownloads from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/constructLessonDownloads";

const lessonBetaDownloadsQuery =
  (sdk: Sdk) =>
  async <T>(args: {
    programmeSlug?: string;
    unitSlug?: string;
    lessonSlug: string;
  }): Promise<T> => {
    const { lessonSlug } = args;

    const res = await sdk.lessonBetaDownloads({ lessonSlug });

    const modifiedBrowseData = applyGenericOverridesAndExceptions<
      SdkLessonBetaDownloadsQuery["browse_data"][number]
    >({
      journey: "teacher",
      queryName: "lessonDownloadsQuery",
      browseData: res.browse_data,
    });

    if (
      !res.download_assets ||
      !modifiedBrowseData ||
      modifiedBrowseData.length === 0 ||
      res.download_assets.length === 0
    ) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const { download_assets } = res;
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
      has_additional_files,
      additional_files,
      has_lesson_guide_object,
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
      hasAdditionalFiles: has_additional_files,
      isLegacy: is_legacy,
      hasLessonGuide: has_lesson_guide_object ?? false,
    };

    const additionalFileDownloads =
      additional_files?.[0] && has_additional_files
        ? constructAdditionalFilesDownloads(additional_files[0])
        : null;

    const downloads = constructDownloadsArray(downloadsData);
    const constructDownloads = [...downloads];
    // Copyright content pre-parsed
    const currentLesson = modifiedBrowseData.find(
      (lesson) => lesson.lesson_slug === lessonSlug,
    );
    const copyright = currentLesson?.lesson_data.copyright_content
      ? keysToCamelCase(currentLesson?.lesson_data.copyright_content)
      : null;

    const parsedBrowseData = modifiedBrowseData.map((bd) =>
      rawSyntheticUVLessonSchema.parse(bd),
    );

    const lessonDownloads = constructLessonDownloads(
      constructDownloads,
      lessonSlug,
      parsedBrowseData,
      copyright,
      additionalFileDownloads,
      expired,
    );

    return lessonDownloadsSchema.parse({
      ...lessonDownloads,
      isLegacy: false,
      isSpecialist: false,
      geoRestricted: geo_restricted,
      loginRequired: login_required,
    }) as T;
  };

export type LessonBetaDownloadsQuery = ReturnType<
  typeof lessonBetaDownloadsQuery
>;
export default lessonBetaDownloadsQuery;
