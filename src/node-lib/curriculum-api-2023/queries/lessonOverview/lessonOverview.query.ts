import {
  LessonOverviewQuery,
  Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_13_0_0_Bool_Exp,
} from "../../generated/sdk";
import { lessonOverviewQuizData, LessonPathway } from "../../shared.schema";
import { constructPathwayLesson, toSentenceCase } from "../../helpers";
import { applyGenericOverridesAndExceptions } from "../../helpers/overridesAndExceptions";
import { getCorrectYear } from "../../helpers/getCorrectYear";

import lessonOverviewSchema, {
  lessonContentSchema,
  LessonOverviewContent,
  LessonOverviewDownloads,
  LessonOverviewPageData,
  LessonBrowseDataByKs,
  lessonBrowseDataByKsSchema,
} from "./lessonOverview.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { InputMaybe } from "@/node-lib/sanity-graphql/generated/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

export const getDownloadsArray = (content: {
  hasSlideDeckAssetObject: boolean;
  hasStarterQuiz: boolean;
  hasExitQuiz: boolean;
  hasWorksheetAssetObject: boolean;
  hasWorksheetAnswersAssetObject: boolean;
  hasWorksheetGoogleDriveDownloadableVersion: boolean;
  hasSupplementaryAssetObject: boolean;
  isLegacy: boolean;
}): LessonOverviewPageData["downloads"] => {
  const downloads: LessonOverviewDownloads = [
    {
      exists: content.hasSlideDeckAssetObject,
      type: "presentation",
    },
    {
      exists: content.hasStarterQuiz,
      type: "intro-quiz-questions",
    },
    {
      exists: content.hasStarterQuiz,
      type: "intro-quiz-answers",
    },
    {
      exists: content.hasExitQuiz,
      type: "exit-quiz-questions",
    },
    {
      exists: content.hasExitQuiz,
      type: "exit-quiz-questions",
    },
    {
      exists:
        (!content.isLegacy &&
          (content.hasWorksheetAssetObject ||
            content.hasWorksheetAnswersAssetObject)) ||
        (content.isLegacy &&
          content.hasWorksheetGoogleDriveDownloadableVersion),
      type: "worksheet-pdf",
    },
    {
      exists:
        (!content.isLegacy &&
          (content.hasWorksheetAssetObject ||
            content.hasWorksheetAnswersAssetObject)) ||
        (content.isLegacy &&
          content.hasWorksheetGoogleDriveDownloadableVersion),
      type: "worksheet-pptx",
    },
    {
      exists: content.hasSupplementaryAssetObject,
      type: "supplementary-pdf",
    },
    {
      exists: content.hasSupplementaryAssetObject,
      type: "supplementary-docx",
    },
  ];

  return downloads;
};

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
): LessonOverviewPageData["copyrightContent"] {
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

const getPathways = (res: LessonOverviewQuery): LessonPathway[] => {
  const pathways = res.browseData.map((l) => {
    const lesson = lessonBrowseDataByKsSchema.parse(l);
    return constructPathwayLesson(lesson);
  });
  return pathways;
};

const bytesToMegabytes = (bytes: number): string => {
  const bytesInOneMegabyte = 1024 * 1024;
  const megabytes = bytes / bytesInOneMegabyte;
  return megabytes.toFixed(1);
};

const getAdditionalFiles = (
  content: LessonOverviewContent["additionalFiles"],
): string[] | null => {
  if (!content || !content[0]) {
    return null;
  }
  return content[0]?.files.map((af) => {
    const name = af.title;
    const type = af.fileObject.format;
    const size = af.fileObject.bytes;
    return `${name} ${bytesToMegabytes(size)} MB (${type.toUpperCase()})`;
  });
};

export const transformedLessonOverviewData = (
  browseData: LessonBrowseDataByKs,
  content: LessonOverviewContent,
  pathways: LessonPathway[] | [],
): LessonOverviewPageData => {
  const starterQuiz = lessonOverviewQuizData.parse(content.starterQuiz);
  const exitQuiz = lessonOverviewQuizData.parse(content.exitQuiz);
  const unitTitle =
    browseData.programmeFields.optionality ?? browseData.unitData.title;
  const hasAddFile = content.additionalFiles;
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
    yearTitle: browseData.programmeFields.yearDescription,
    examBoardTitle: browseData.programmeFields.examboard,
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
    keyLearningPoints: content.keyLearningPoints,
    pupilLessonOutcome: content.pupilLessonOutcome,
    lessonKeywords: content.lessonKeywords,
    copyrightContent: getCopyrightContent(
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
    lessonCohort: browseData.lessonData.Cohort,
    lessonGuideUrl: content.lessonGuideAssetObjectUrl ?? null,
    phonicsOutcome: content.phonicsOutcome,
    pathways: pathways,
    actions: browseData.actions,
    hasMediaClips: false,
    lessonMediaClips: lessonMediaClipsFixtures().mediaClips,
    additionalFiles: hasAddFile
      ? getAdditionalFiles(content.additionalFiles)
      : null,
    disablePupilShare: browseData?.actions?.disablePupilShare ?? false,
  };
};

const lessonOverviewQuery =
  (sdk: Sdk) =>
  async (args: {
    lessonSlug: string;
    unitSlug?: string;
    programmeSlug?: string;
    isLegacy?: boolean;
  }): Promise<LessonOverviewPageData> => {
    const { lessonSlug, unitSlug, programmeSlug, isLegacy } = args;

    const browseDataWhere: InputMaybe<Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_13_0_0_Bool_Exp> =
      { lesson_slug: { _eq: lessonSlug } };

    const canonicalLesson = !unitSlug && !programmeSlug;

    if (unitSlug) {
      browseDataWhere["unit_slug"] = { _eq: unitSlug };
    }

    if (programmeSlug) {
      browseDataWhere["programme_slug"] = { _eq: programmeSlug };
    }

    if (isLegacy !== undefined) {
      browseDataWhere["is_legacy"] = { _eq: isLegacy };
    }

    const res = await sdk.lessonOverview({
      browseDataWhere,
      lessonSlug,
    });

    const modifiedBrowseData = applyGenericOverridesAndExceptions<
      LessonOverviewQuery["browseData"][number]
    >({
      journey: "teacher",
      queryName: "lessonOverviewQuery",
      browseData: res.browseData,
    });

    if (modifiedBrowseData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const modifiedProgrammeFields = getCorrectYear({
      programmeSlugByYear: modifiedBrowseData[0]?.programme_slug_by_year,
      programmeFields: modifiedBrowseData[0]?.programme_fields,
    });

    const browseDataSnake = {
      ...modifiedBrowseData[0],
      programme_fields: modifiedProgrammeFields,
    };
    const [contentSnake] = res.content;

    if (!contentSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (res.content.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023:lessonOverview")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }
    const pathways = canonicalLesson ? getPathways(res) : [];

    lessonBrowseDataByKsSchema.parse(browseDataSnake);
    lessonContentSchema.parse({ ...contentSnake, additional_files: null });

    /**
     * ! - We've already parsed this data with Zod so we can safely cast it to the correct type
     *  */

    const browseData = keysToCamelCase(browseDataSnake) as LessonBrowseDataByKs;
    const content = keysToCamelCase({
      ...contentSnake,
    }) as LessonOverviewContent;
    return lessonOverviewSchema.parse(
      transformedLessonOverviewData(browseData, content, pathways),
    );
  };

export default lessonOverviewQuery;
