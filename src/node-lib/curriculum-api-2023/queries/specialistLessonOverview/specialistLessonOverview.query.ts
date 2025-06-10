import { LessonOverviewDownloads } from "../lessonOverview/lessonOverview.schema";

import specialistLessonOverviewSchema, {
  SpecialistLessonDataRaw,
  specialistLessonOverviewRawSchema,
} from "./specialistLessonOverview.schema";

import keysToCamelCase from "@/utils/snakeCaseConverter";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { LessonOverviewAll } from "@/components/TeacherComponents/types/lesson.types";
import {
  LessonUnitDataByKs,
  lessonUnitDataByKsSchema,
} from "@/node-lib/curriculum-api-2023/shared.schema";

export const constructDownloadsArray = (
  lesson: SpecialistLessonDataRaw[number],
): LessonOverviewDownloads => {
  const presentation = {
    exists: lesson.presentation_url ? true : false,
    type: "presentation" as const,
  };
  const introQuizQuestions = {
    exists:
      lesson.starter_quiz && lesson.starter_quiz_asset_object ? true : false,
    type: "intro-quiz-questions" as const,
  };
  const introQuizAnswers = {
    exists:
      lesson.starter_quiz && lesson.starter_quiz_asset_object ? true : false,
    type: "intro-quiz-answers" as const,
  };
  const exitQuizQuestions = {
    exists: lesson.exit_quiz && lesson.exit_quiz_asset_object ? true : false,
    type: "exit-quiz-questions" as const,
  };
  const exitQuizAnswers = {
    exists: lesson.exit_quiz && lesson.exit_quiz_asset_object ? true : false,
    type: "exit-quiz-answers" as const,
  };
  const worksheetPdf = {
    exists:
      typeof lesson.worksheet_asset_object?.google_drive_downloadable_version
        ?.url === "string",
    type: "worksheet-pdf" as const,
  };
  const worksheetPptx = {
    exists:
      typeof lesson.worksheet_asset_object?.google_drive_downloadable_version
        ?.url === "string",
    type: "worksheet-pptx" as const,
  };

  return [
    presentation,
    introQuizQuestions,
    introQuizAnswers,
    exitQuizQuestions,
    exitQuizAnswers,
    worksheetPdf,
    worksheetPptx,
  ];
};

export const generateLessonOverviewFromRaw = (
  rawLesson: unknown,
  rawUnitData: unknown,
  errorCallback: (
    lessonOverview: SpecialistLessonDataRaw,
    error: OakError,
  ) => void,
) => {
  const parsedLessonOverview =
    specialistLessonOverviewRawSchema.parse(rawLesson);

  if (
    !parsedLessonOverview ||
    parsedLessonOverview.length === 0 ||
    !parsedLessonOverview[0] ||
    !Array.isArray(rawUnitData)
  ) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  if (parsedLessonOverview.length > 1) {
    const error = new OakError({
      code: "curriculum-api/uniqueness-assumption-violated",
    });
    errorCallback(parsedLessonOverview, error);
  }

  const [unitDataSnake] = rawUnitData;
  if (!unitDataSnake) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }
  lessonUnitDataByKsSchema.parse(unitDataSnake);
  const unitData = keysToCamelCase(unitDataSnake) as LessonUnitDataByKs;

  const lesson = parsedLessonOverview[0];

  const transformedLesson: LessonOverviewAll = {
    isLegacy: true,
    isSpecialist: true,
    isCanonical: false,
    lessonSlug: lesson.lesson_slug,
    lessonTitle: lesson.lesson_title,
    programmeSlug: lesson.synthetic_programme_slug,
    unitTitle: lesson.unit_title,
    unitSlug: lesson.unit_slug,
    phaseSlug: lesson.combined_programme_fields.phase_slug ?? "",
    phaseTitle: lesson.combined_programme_fields.phase_description ?? "",
    developmentStageSlug:
      lesson.combined_programme_fields.developmentstage_slug ?? "",
    developmentStageTitle:
      lesson.combined_programme_fields.developmentstage ?? "",
    subjectSlug: lesson.combined_programme_fields.subject_slug,
    subjectTitle: lesson.combined_programme_fields.subject,
    expired: lesson.expired,
    pupilLessonOutcome: lesson.pupil_lesson_outcome,
    videoTitle: lesson.video_title,
    worksheetUrl: lesson.worksheet_url,
    presentationUrl: lesson.presentation_url,
    videoMuxPlaybackId: lesson.video_mux_playback_id,
    videoWithSignLanguageMuxPlaybackId:
      lesson.video_with_sign_language_mux_playback_id,
    hasCopyrightMaterial: lesson.contains_copyright_content,
    supervisionLevel: lesson.supervision_level,
    starterQuiz: lesson.starter_quiz,
    exitQuiz: lesson.exit_quiz,
    transcriptSentences: lesson.transcript_sentences,
    threads: lesson.threads,
    contentGuidance: keysToCamelCase(lesson.content_guidance),
    teacherTips: keysToCamelCase(lesson.teacher_tips),
    misconceptionsAndCommonMistakes: keysToCamelCase(
      lesson.misconceptions_and_common_mistakes,
    ),
    lessonEquipmentAndResources: keysToCamelCase(
      lesson.equipment_and_resources,
    ),
    keyLearningPoints: keysToCamelCase(lesson.key_learning_points),
    copyrightContent: lesson.contains_copyright_content
      ? [{ copyrightInfo: "This lesson contains copyright material" }]
      : [],
    downloads: constructDownloadsArray(lesson),
    updatedAt: "2022",
    pathways: [],
    lessonGuideUrl: null,
    hasMediaClips: false,
    lessonMediaClips: null,
    additionalFiles: null,
    lessonOutline: null,
    lessonReleaseDate: lesson.lesson_release_date,
    orderInUnit: lesson.order_in_unit ?? 1,
    unitTotalLessonCount: unitData.lessonCount ?? 1,
  };

  return specialistLessonOverviewSchema.parse({
    ...transformedLesson,
  });
};

const specialistLessonOverview =
  (sdk: Sdk) =>
  async (args: {
    unitSlug: string;
    programmeSlug: string;
    lessonSlug: string;
  }) => {
    const { programmeSlug, unitSlug, lessonSlug } = args;
    const specialistLessonOverview = await sdk.specialistLessonOverview({
      unitSlug,
      programmeSlug,
      lessonSlug,
    });

    return generateLessonOverviewFromRaw(
      specialistLessonOverview.lesson,
      specialistLessonOverview.unitData,
      (lessonOverview, error) => {
        errorReporter("curriculum-api-2023::specialistLessonOverview")(error, {
          severity: "warning",
          ...args,
          lessonOverview,
        });
      },
    );
  };

export default specialistLessonOverview;
