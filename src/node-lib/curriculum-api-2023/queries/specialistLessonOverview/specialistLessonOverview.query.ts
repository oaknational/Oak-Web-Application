import specialistLessonOverviewSchema, {
  SpecialistLessonOverviewData,
  specialistLessonOverviewRawSchema,
} from "./specialistLessonOverview.schema";

import keysToCamelCase from "@/utils/snakeCaseConverter";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

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

    const parsedLessonOverview = specialistLessonOverviewRawSchema.parse(
      specialistLessonOverview.lesson,
    );

    if (
      !parsedLessonOverview ||
      parsedLessonOverview.length === 0 ||
      !parsedLessonOverview[0]
    ) {
      throw new Error("curriculum-api/not-found");
    }

    if (parsedLessonOverview.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::specialistLessonOverview")(error, {
        severity: "warning",
        ...args,
        parsedLessonOverview,
      });
    }

    /**
     * 
     ! - FIXME: Tracking events avo
     !- Downloadable resources????
     */

    const lesson = parsedLessonOverview[0];

    const transformedLesson: SpecialistLessonOverviewData = {
      isLegacy: true,
      lessonSlug: lesson.lesson_slug,
      lessonTitle: lesson.lesson_title,
      programmeSlug: lesson.synthetic_programme_slug,
      unitTitle: lesson.unit_title,
      unitSlug: lesson.unit_slug,
      phaseSlug: lesson.combined_programme_fields.phase_slug,
      phaseTitle: lesson.combined_programme_fields.phase_description,
      developmentStageSlug:
        lesson.combined_programme_fields.developmentstage_slug,
      developmentStageTitle: lesson.combined_programme_fields.developmentstage,
      subjectSlug: lesson.combined_programme_fields.subject_slug,
      subjectTitle: lesson.combined_programme_fields.subject,
      expired: lesson.expired ? true : false,
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
      hasDownloadableResources: true,
    };

    return specialistLessonOverviewSchema.parse({
      ...transformedLesson,
    });
  };

export default specialistLessonOverview;
