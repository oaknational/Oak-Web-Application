import {
  lessonContentSchema as lessonContentSchemaFull,
  QuizQuestion,
} from "@oaknational/oak-curriculum-schema";
import { keysToCamelCase } from "zod-to-camel-case";

import { applyGenericOverridesAndExceptions } from "../../helpers/overridesAndExceptions";
import { TeachersPreviewLessonQuery } from "../../generated/sdk";
import { toSentenceCase } from "../../helpers";
import { mediaClipsRecordCamelSchema } from "../lessonMediaClips/lessonMediaClips.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import lessonOverviewSchema, {
  LessonBrowseDataByKs,
  LessonOverviewContent,
  LessonOverviewPageData,
} from "@/node-lib/curriculum-api-2023/queries/canonicalLessonOverview/canonicalLessonOverview.schema";
import {
  lessonOverviewQuizData,
  LessonPathway,
  LessonUnitDataByKs,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { buildLessonOverviewDownloads } from "@/common-lib/lessonDownloads";
import { formatBytes } from "@/utils/formatBytes";

export const getDownloadsArray = buildLessonOverviewDownloads;

export function getContentGuidance(
  content: LessonOverviewContent["contentGuidance"],
): LessonOverviewPageData["contentGuidance"] {
  if (content === null) {
    return null;
  }
  return content.map((item) => ({
    contentGuidanceLabel: item.contentguidanceLabel ?? "",
    contentGuidanceDescription: item.contentguidanceDescription ?? "",
    contentGuidanceArea: item.contentguidanceArea ?? "",
  }));
}

export function getCopyrightContent(
  content:
    | LessonBrowseDataByKs["lessonData"]["copyrightContent"]
    | { copyrightInfo: string }[]
    | null,
): LessonOverviewPageData["legacyCopyrightContent"] {
  if (content === null) {
    return null;
  }

  return content.map((item) => {
    if ("copyrightInfo" in item) {
      return {
        copyrightInfo: item.copyrightInfo ?? "",
      };
    }
    return {
      copyrightInfo: "",
    };
  });
}

export const getAdditionalFiles = (
  additionalFiles: LessonOverviewContent["downloadableFiles"],
): string[] | null => {
  if (!additionalFiles) {
    return [];
  }

  return additionalFiles.map((af) => {
    const name = af.mediaObject.displayName;
    const type = af.mediaObject.url.split(".").pop() ?? "";
    const size = af.mediaObject.bytes;
    const sizeString = formatBytes(size);
    return `${name} ${sizeString} (${type.toUpperCase()})`;
  });
};

export const transformedLessonOverviewData = (
  browseData: LessonBrowseDataByKs,
  content: LessonOverviewContent,
  pathways: LessonPathway[] | [],
  unitData: LessonUnitDataByKs,
  excludedFromTeachingMaterials: boolean,
  shouldHideCreateWithAi: boolean,
): LessonOverviewPageData => {
  const reportError = errorReporter("transformedLessonOverviewData");
  const starterQuiz = lessonOverviewQuizData.parse(content.starterQuiz);
  const exitQuiz = lessonOverviewQuizData.parse(content.exitQuiz);
  const unitTitle =
    browseData.programmeFields.optionality ?? browseData.unitData.title;

  // OWA referes to downloadable_files field in db as additional_files
  // these are additional files that can be downloads for some lessons
  const additionalFiles = content?.downloadableFiles;
  const hasAdditionalFiles = additionalFiles
    ? additionalFiles.length > 0
    : false;

  let mediaClips = null;
  try {
    mediaClips = browseData.lessonData.mediaClips
      ? mediaClipsRecordCamelSchema.parse(browseData.lessonData.mediaClips)
      : null;
  } catch (error) {
    browseData.lessonData.mediaClips = null;
    reportError(error);
  }

  return {
    programmeSlug: browseData.programmeSlug,
    unitSlug: browseData.unitSlug,
    unitTitle,
    keyStageSlug: browseData.programmeFields.keystageSlug,
    keyStageTitle: toSentenceCase(
      browseData.programmeFields.keystageDescription,
    ),
    subjectSlug: browseData.programmeFields.subjectSlug,
    subjectTitle: browseData.programmeFields.subject,
    subjectParent: browseData.programmeFields.subjectParent || null,
    yearTitle: browseData.programmeFields.yearDescription,
    year: browseData.programmeFields.year,
    examBoardTitle: browseData.programmeFields.examboard,
    examBoardSlug: browseData.programmeFields.examboardSlug,
    downloads: getDownloadsArray({
      hasExitQuiz: content.exitQuiz && Boolean(content.exitQuiz.length > 1),
      hasStarterQuiz:
        content.starterQuiz && Boolean(content.starterQuiz.length > 1),
      hasSupplementaryAssetObject: Boolean(content.hasSupplementaryAssetObject),
      hasWorksheetAnswersAssetObject: Boolean(
        content.hasWorksheetAnswersAssetObject,
      ),
      hasWorksheetAssetObject: Boolean(content.hasWorksheetAssetObject),
      hasWorksheetGoogleDriveDownloadableVersion: Boolean(
        content.hasWorksheetGoogleDriveDownloadableVersion,
      ),
      hasSlideDeckAssetObject: Boolean(content.hasSlideDeckAssetObject),
      hasLessonGuideObject: Boolean(content.hasLessonGuideObject),
      isLegacy: browseData.isLegacy,
    }),
    updatedAt: browseData.lessonData.updatedAt,
    isLegacy: content.isLegacy || false,
    lessonSlug: browseData.lessonSlug,
    lessonTitle: browseData.lessonData.title,
    tierTitle: browseData.programmeFields.tierDescription,
    tierSlug: browseData.programmeFields.tierSlug,
    contentGuidance: getContentGuidance(content.contentGuidance),
    misconceptionsAndCommonMistakes: content.misconceptionsAndCommonMistakes,
    teacherTips: content.teacherTips,
    lessonEquipmentAndResources: browseData.lessonData.equipmentAndResources,
    additionalMaterialUrl: content.supplementaryAssetObjectUrl,
    keyLearningPoints: content.keyLearningPoints ?? null,
    pupilLessonOutcome: content.pupilLessonOutcome,
    lessonKeywords: content.lessonKeywords,
    legacyCopyrightContent: getCopyrightContent(
      browseData.lessonData.copyrightContent,
    ),
    supervisionLevel: content.supervisionLevel,
    worksheetUrl: content.worksheetAssetObjectUrl,
    presentationUrl: content.slideDeckAssetObjectUrl,
    videoMuxPlaybackId: content.videoMuxPlaybackId,
    videoWithSignLanguageMuxPlaybackId:
      content.videoWithSignLanguageMuxPlaybackId,
    transcriptSentences: content.transcriptSentences,
    isWorksheetLandscape: Boolean(
      browseData.lessonData.deprecatedFields?.worksheetIsLandscape,
    ),
    expired: Boolean(browseData.lessonData.deprecatedFields?.expired) || false,
    starterQuiz: starterQuiz,
    exitQuiz: exitQuiz,
    videoTitle: content.videoTitle,
    lessonCohort: browseData.lessonData._cohort,
    lessonGuideUrl: content.lessonGuideAssetObjectUrl ?? null,
    phonicsOutcome: content.phonicsOutcome,
    pathways: pathways,
    actions: browseData.actions,
    hasMediaClips: mediaClips
      ? Object.keys(mediaClips).length > 0 &&
        Object.values(mediaClips).some((key) => key.length > 0)
      : false,
    lessonOutline: browseData.lessonData.lessonOutline ?? null,
    lessonMediaClips: mediaClips,
    additionalFiles:
      hasAdditionalFiles && additionalFiles
        ? getAdditionalFiles(additionalFiles)
        : null,
    pathwayTitle: browseData.programmeFields.pathwayDescription ?? null,
    lessonReleaseDate: content.lessonReleaseDate ?? null,
    orderInUnit: browseData.orderInUnit ?? 1,
    unitTotalLessonCount:
      unitData?.supplementaryData?.staticLessonList?.length ??
      unitData?.lessonCount ??
      1,
    geoRestricted: browseData.features?.agfGeoRestricted ?? false,
    loginRequired: browseData.features?.agfLoginRequired ?? false,
    excludedFromTeachingMaterials,
    shouldHideCreateWithAi,
    subjectCategories: browseData.unitData.subjectcategories || null,
  };
};

const teacherPreviewLessonQuery =
  (sdk: Sdk) =>
  async (args: { lessonSlug: string }): Promise<LessonOverviewPageData> => {
    const { lessonSlug } = args;

    const res = await sdk.teachersPreviewLesson({
      lessonSlug,
    });

    if (res.content.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::teacherPreviewLesson")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    const [content] = res.content;

    if (!content) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    const parsedLessonContent = lessonContentSchemaFull.parse({
      ...content,
    });

    const [unitDataSnake] = res.unitData;

    // Commented out below to allow preview of new lessons without unit data
    // if (!unitDataSnake) {
    //   throw new OakError({ code: "curriculum-api/not-found" });
    // }
    // lessonUnitDataByKsSchema.parse(unitDataSnake);

    const unitData = keysToCamelCase(unitDataSnake) as LessonUnitDataByKs;

    // Incomplete data will break the preview for new lessons
    const lessonContentData = keysToCamelCase({
      ...parsedLessonContent,
      exit_quiz: content.exit_quiz
        ? content.exit_quiz.filter((q: QuizQuestion) => q.question_stem)
        : null,
      starter_quiz: content.starter_quiz
        ? content.starter_quiz.filter((q: QuizQuestion) => q.question_stem)
        : null,
      additional_files: content?.downloadable_files,
    });

    const modifiedBrowseData = applyGenericOverridesAndExceptions<
      TeachersPreviewLessonQuery["browseData"][number]
    >({
      journey: "teacher",
      queryName: "teacherPreviewLessonQuery",
      browseData: res?.browseData,
    });

    if (modifiedBrowseData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const modBrowseData = keysToCamelCase(modifiedBrowseData[0]);

    const teacherPreviewData = transformedLessonOverviewData(
      modBrowseData as LessonBrowseDataByKs,
      lessonContentData as LessonOverviewContent,
      [],
      unitData,
      true,
      true,
    );

    const parsedLessonPreviewData = lessonOverviewSchema.parse({
      ...teacherPreviewData,
      lessonTitle: lessonContentData.lessonTitle,
      hasMediaClips: true,
    });

    return parsedLessonPreviewData;
  };

export default teacherPreviewLessonQuery;
