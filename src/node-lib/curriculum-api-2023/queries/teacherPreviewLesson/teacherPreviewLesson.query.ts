import {
  lessonContentSchema as lessonContentSchemaFull,
  QuizQuestion,
} from "@oaknational/oak-curriculum-schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import {
  getContentGuidance,
  getCopyrightContent,
  getDownloadsArray,
} from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.query";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { toSentenceCase } from "@/node-lib/curriculum-api-2023/helpers";

const teacherPreviewLessonQuery =
  (sdk: Sdk) => async (args: { lessonSlug: string }) => {
    const { lessonSlug } = args;
    // pass in the lessonSlug to the sdk.teacherPreviewLesson method
    const res = await sdk.teachersPreviewLesson({
      lessonSlug,
    });
    const browseFixtureData = lessonBrowseDataFixture({ lessonSlug });

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

    lessonContentSchemaFull.parse(content);

    // Incomplete data for new lessons?
    const lessonContentData = keysToCamelCase({
      ...content,
      exit_quiz: content.exit_quiz
        ? content.exit_quiz.filter((q: QuizQuestion) => q.question_stem)
        : null,
      starter_quiz: content.starter_quiz
        ? content.starter_quiz.filter((q: QuizQuestion) => q.question_stem)
        : null,
    });

    // Needs to be parsed with Zod - unit title
    return {
      programmeSlug: browseFixtureData.programmeSlug,
      unitSlug: browseFixtureData.unitSlug,
      unitTitle: "Unit title",
      lessonId: lessonContentData.lessonId,
      keyStageSlug: browseFixtureData.programmeFields.keystageSlug,
      keyStageTitle: toSentenceCase(
        browseFixtureData.programmeFields.keystageDescription,
      ),
      subjectSlug: browseFixtureData.programmeFields.subjectSlug,
      subjectTitle: browseFixtureData.programmeFields.subject,
      yearTitle: browseFixtureData.programmeFields.yearDescription,
      examBoardTitle: browseFixtureData.programmeFields.examboard,
      downloads: getDownloadsArray({
        hasExitQuiz:
          lessonContentData.exitQuiz &&
          Boolean(lessonContentData.exitQuiz.length > 1),
        hasStarterQuiz:
          lessonContentData.starterQuiz &&
          Boolean(lessonContentData.starterQuiz.length > 1),
        hasSupplementaryAssetObject: Boolean(
          lessonContentData.hasSupplementaryAssetObject,
        ),
        hasWorksheetAnswersAssetObject: Boolean(
          lessonContentData.hasWorksheetAnswersAssetObject,
        ),
        hasWorksheetAssetObject: Boolean(
          lessonContentData.hasWorksheetAssetObject,
        ),
        hasWorksheetGoogleDriveDownloadableVersion: Boolean(
          lessonContentData.hasWorksheetGoogleDriveDownloadableVersion,
        ),
        hasSlideDeckAssetObject: Boolean(
          lessonContentData.hasSlideDeckAssetObject,
        ),
        isLegacy: browseFixtureData.isLegacy,
      }),

      updatedAt: browseFixtureData.lessonData.updatedAt,
      isLegacy: lessonContentData.isLegacy || false,
      lessonSlug: lessonSlug,
      //lesson title is nullable on lessonContentSchema
      lessonTitle: lessonContentData.lessonTitle ?? "",
      tierTitle: browseFixtureData.programmeFields.tierDescription,
      tierSlug: browseFixtureData.programmeFields.tierSlug,
      contentGuidance: getContentGuidance(lessonContentData.contentGuidance),
      misconceptionsAndCommonMistakes:
        lessonContentData.misconceptionsAndCommonMistakes,
      teacherTips: lessonContentData.teacherTips,
      lessonEquipmentAndResources:
        browseFixtureData.lessonData.equipmentAndResources,
      additionalMaterialUrl: lessonContentData.supplementaryAssetObjectUrl,
      keyLearningPoints: lessonContentData.keyLearningPoints,
      pupilLessonOutcome: lessonContentData.pupilLessonOutcome,
      lessonKeywords: lessonContentData.lessonKeywords,
      copyrightContent: getCopyrightContent(
        browseFixtureData.lessonData.copyrightContent,
      ),
      supervisionLevel: lessonContentData.supervisionLevel ?? null,
      worksheetUrl: lessonContentData.worksheetAssetObjectUrl ?? null,
      presentationUrl: lessonContentData.slideDeckAssetObjectUrl ?? null,
      videoMuxPlaybackId: lessonContentData.videoMuxPlaybackId ?? null,
      videoWithSignLanguageMuxPlaybackId:
        lessonContentData.videoWithSignLanguageMuxPlaybackId ?? null,
      transcriptSentences: lessonContentData.transcriptSentences ?? null,
      isWorksheetLandscape: Boolean(
        browseFixtureData.lessonData.deprecatedFields?.worksheetIsLandscape,
      ),
      expired:
        Boolean(browseFixtureData.lessonData.deprecatedFields?.expired) ||
        false,
      starterQuiz: lessonContentData.starterQuiz,
      exitQuiz: lessonContentData.exitQuiz,
      videoTitle: lessonContentData.videoTitle,
      lessonCohort: browseFixtureData.lessonData.Cohort,
      pathways: [],
    };
  };

export default teacherPreviewLessonQuery;
