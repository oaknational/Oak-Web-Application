import lessonDownloadsSchema, {
  downloadsAssetData,
  LessonAdditionalFilesListSchema,
} from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { constructDownloadsArray } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/downloadUtils";
import constructCanonicalLessonDownloads from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/constructCanonicalLessonDownloads";
import constructLessonDownloads from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/constructLessonDownloads";
import { rawSyntheticUVLessonSchema } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/rawSyntheticUVLesson.schema";
import { TeacherPreviewLessonDownloadQuery as SdkLessonDownloadsQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { constructLessonBrowseQuery } from "@/node-lib/curriculum-api-2023/helpers";
import lessonDownloadsCanonicalSchema from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloadsCanonical.schema";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";

const teachersPreviewLessonDownloadQuery =
  (sdk: Sdk) =>
  async <T>(args: {
    programmeSlug?: string;
    unitSlug?: string;
    lessonSlug: string;
  }): Promise<T> => {
    const { lessonSlug, unitSlug, programmeSlug } = args;
    const isCanonicalLesson = !unitSlug && !programmeSlug;

    const browseDataWhere = constructLessonBrowseQuery({
      programmeSlug,
      unitSlug,
      lessonSlug: isCanonicalLesson ? lessonSlug : undefined,
    });

    const res = await sdk.teacherPreviewLessonDownload({
      lessonSlug,
      browseDataWhere,
    });

    const modifiedBrowseData = applyGenericOverridesAndExceptions<
      SdkLessonDownloadsQuery["browse_data"][number]
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
      has_lesson_guide_object,
      starter_quiz,
      exit_quiz,
      is_legacy,
      expired,
      geo_restricted,
      login_required,
      downloadable_files,
    } = downloadsAssetData.parse(download_assets[0]);

    const additionalFiles: LessonAdditionalFilesListSchema = downloadable_files
      ? downloadable_files.map((file) => {
          return {
            exists: !!file.asset_id,
            type: "additional-files",
            label: file.media_object.display_name,
            ext: file.media_object.url.split(".").pop() ?? "",
            size: file.media_object.bytes,
            forbidden: false,
            assetId: file.asset_id,
          };
        })
      : [];

    const downloadsData = {
      hasSlideDeckAssetObject: has_slide_deck_asset_object,
      hasStarterQuiz: starter_quiz ? true : false,
      hasExitQuiz: exit_quiz ? true : false,
      hasWorksheetAssetObject: has_worksheet_asset_object,
      hasWorksheetAnswersAssetObject: has_worksheet_answers_asset_object,
      hasWorksheetGoogleDriveDownloadableVersion:
        has_worksheet_google_drive_downloadable_version,
      hasSupplementaryAssetObject: has_supplementary_asset_object,
      hasLessonGuideObject: has_lesson_guide_object,
      isLegacy: is_legacy,
    };

    const downloads = constructDownloadsArray(downloadsData);

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

    if (isCanonicalLesson) {
      const canonicalLessonDownloads = constructCanonicalLessonDownloads({
        downloads,
        additionalFiles,
        lessonSlug,
        browseData: parsedBrowseData,
        isLegacy: is_legacy,
        lessonCopyRight: copyright,
        restrictions: {
          geoRestricted: geo_restricted,
          loginRequired: login_required,
        },
      });
      return lessonDownloadsCanonicalSchema.parse(
        canonicalLessonDownloads,
      ) as T;
    } else {
      const lessonDownloads = constructLessonDownloads({
        downloads,
        additionalFiles,
        lessonSlug,
        parsedBrowseData,
        lessonCopyRight: copyright,
        expired,
      });

      return lessonDownloadsSchema.parse({
        ...lessonDownloads,
        isLegacy: false,
        isSpecialist: false,
        geoRestricted: geo_restricted,
        loginRequired: login_required,
      }) as T;
    }
  };

export type TeacherPreviewLessonDownloadsQuery = ReturnType<
  typeof teachersPreviewLessonDownloadQuery
>;
export default teachersPreviewLessonDownloadQuery;
