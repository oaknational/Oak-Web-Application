import {
  LessonOverviewQuery,
  Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_6_0_0_Bool_Exp,
} from "../../generated/sdk";
import {
  LessonBrowseData,
  lessonBrowseDataSchema,
} from "../pupilLesson/pupilLesson.schema";
import {
  lessonOverviewQuizData,
  LessonPathway,
  lessonPathwaySchema,
} from "../../shared.schema";
import { toSentenceCase } from "../../helpers";

import lessonOverviewSchema, {
  lessonContentSchema,
  LessonOverviewContent,
  LessonOverviewDownloads,
  LessonOverviewPageData,
} from "./lessonOverview.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { InputMaybe } from "@/node-lib/sanity-graphql/generated/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import { formatSentences, getCaptionsFromFile } from "@/utils/handleTranscript";

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
    | LessonBrowseData["lessonData"]["copyrightContent"]
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
    const lesson = lessonBrowseDataSchema.parse(l);
    const pathway = {
      programmeSlug: lesson.programme_slug,
      unitSlug: lesson.unit_slug,
      unitTitle: lesson.unit_data.title,
      keyStageSlug: lesson.programme_fields.keystage_slug,
      keyStageTitle: lesson.programme_fields.keystage_description,
      subjectSlug: lesson.programme_fields.subject_slug,
      subjectTitle: lesson.programme_fields.subject,
      lessonCohort: lesson.lesson_data._cohort,
      examBoardSlug: lesson.programme_fields.examboard_slug,
      examBoardTitle: lesson.programme_fields.examboard,
      tierSlug: lesson.programme_fields.tier_slug,
      tierTitle: lesson.programme_fields.tier_description,
    };
    return lessonPathwaySchema.parse(pathway);
  });
  return pathways;
};

const transformedLessonOverviewData = (
  browseData: LessonBrowseData,
  content: LessonOverviewContent,
  pathways: LessonPathway[] | [],
): LessonOverviewPageData => {
  const starterQuiz = lessonOverviewQuizData.parse(content.starterQuiz);
  const exitQuiz = lessonOverviewQuizData.parse(content.exitQuiz);
  return {
    programmeSlug: browseData.programmeSlug,
    unitSlug: browseData.unitSlug,
    unitTitle: browseData.unitData.title,
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

    const browseDataWhere: InputMaybe<Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_6_0_0_Bool_Exp> =
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

    if (res.browseData.length > 1 && unitSlug && programmeSlug) {
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

    lessonBrowseDataSchema.parse(browseDataSnake);
    lessonContentSchema.parse(contentSnake);

    // We've already parsed this data with Zod so we can safely cast it to the correct type
    const browseData = keysToCamelCase(browseDataSnake) as LessonBrowseData;
    const content = keysToCamelCase(contentSnake) as LessonOverviewContent;

    const transformedLesson = lessonOverviewSchema.parse(
      transformedLessonOverviewData(browseData, content, pathways),
    );

    const { videoTitle, transcriptSentences } = transformedLesson;
    if (videoTitle && !transcriptSentences) {
      // For new content we need to fetch the captions file from gCloud and parse the result to generate
      // the transcript sentences.
      const fileName = `${videoTitle}.vtt`;
      const transcript = await getCaptionsFromFile(fileName);
      if (transcript) {
        transformedLesson.transcriptSentences = transcript;
      }
    } else if (transcriptSentences && !Array.isArray(transcriptSentences)) {
      const splitTranscript = transcriptSentences.split(/\r?\n/);
      const formattedTranscript = formatSentences(splitTranscript);

      transformedLesson.transcriptSentences = formattedTranscript;
    }

    return transformedLesson;
  };

export default lessonOverviewQuery;
