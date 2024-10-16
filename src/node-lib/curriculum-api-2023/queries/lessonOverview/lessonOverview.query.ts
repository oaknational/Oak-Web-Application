import {
  LessonOverviewQuery,
  Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_10_0_0_Bool_Exp,
} from "../../generated/sdk";
import { lessonOverviewQuizData, LessonPathway } from "../../shared.schema";
import { constructPathwayLesson, toSentenceCase } from "../../helpers";

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

const transformedLessonOverviewData = (
  browseData: LessonBrowseDataByKs,
  content: LessonOverviewContent,
  pathways: LessonPathway[] | [],
): LessonOverviewPageData => {
  const starterQuiz = lessonOverviewQuizData.parse(content.starterQuiz);
  const exitQuiz = lessonOverviewQuizData.parse(content.exitQuiz);
  const unitTitle =
    browseData.programmeFields.optionality ?? browseData.unitData.title;
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
    pathways: pathways,
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

    const browseDataWhere: InputMaybe<Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_10_0_0_Bool_Exp> =
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
    if (res.browseData.length > 1 && !canonicalLesson) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::lessonOverview")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    const [browseDataSnake] = res.browseData;

    if (!browseDataSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

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
    lessonContentSchema.parse(contentSnake);

    // We've already parsed this data with Zod so we can safely cast it to the correct type
    const browseData = keysToCamelCase(browseDataSnake) as LessonBrowseDataByKs;
    const content = keysToCamelCase(contentSnake) as LessonOverviewContent;

    return lessonOverviewSchema.parse(
      transformedLessonOverviewData(browseData, content, pathways),
    );
  };

export default lessonOverviewQuery;
