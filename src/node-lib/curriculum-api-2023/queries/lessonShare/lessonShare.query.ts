import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";
import { toSentenceCase } from "../../helpers";

import {
  RawLessonShareSchema,
  lessonShareSchema,
  rawLessonShareSchema,
  rawShareBrowseData,
} from "./lessonShare.schema";

import errorReporter from "@/common-lib/error-reporter";

export const constructShareableResources = (lesson: RawLessonShareSchema) => {
  const starterQuizLength = lesson.starter_quiz?.length ?? 0;
  const exitQuizLength = lesson.exit_quiz?.length ?? 0;

  const introQuiz = {
    exists: lesson.starter_quiz !== null,
    type: "intro-quiz-questions" as const,
    label: "Starter Quiz",
    metadata: lesson.starter_quiz
      ? `${starterQuizLength} question${starterQuizLength === 1 ? "" : "s"}`
      : "",
  };
  const exitQuiz = {
    exists: lesson.exit_quiz !== null,
    type: "exit-quiz-questions" as const,
    label: "Exit Quiz",
    metadata: lesson.exit_quiz
      ? `${exitQuizLength} question${exitQuizLength === 1 ? "" : "s"}`
      : "",
  };
  const video = {
    exists: lesson.video_mux_playback_id !== null,
    type: "video" as const,
    label: "Video",
    metadata: lesson.video_duration,
  };
  const worksheet = {
    exists: lesson.worksheet_asset_object_url !== null,
    type: "worksheet-pdf" as const,
    label: "Worksheet",
    metadata: "pdf",
  };

  return [video, introQuiz, exitQuiz, worksheet];
};

const lessonShareQuery =
  (sdk: Sdk) =>
  async (args: {
    programmeSlug: string;
    unitSlug: string;
    lessonSlug: string;
  }) => {
    const res = await sdk.lessonShare(args);
    const rawLesson = res.share;
    const rawBrowseData = res.browse;

    if (!rawLesson || rawLesson.length === 0 || !rawBrowseData) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (rawLesson.length > 1 || rawBrowseData.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::lessonShare")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    const parsedRawLesson = rawLessonShareSchema.parse(rawLesson[0]);
    const parsedRawBrowseData = rawShareBrowseData.parse(rawBrowseData[0]);

    const lesson = lessonShareSchema.parse({
      isSpecialist: false,
      programmeSlug: args.programmeSlug,
      keyStageSlug: parsedRawBrowseData.programme_fields.keystage_slug,
      keyStageTitle: toSentenceCase(
        parsedRawBrowseData.programme_fields.keystage_description,
      ),
      lessonSlug: args.lessonSlug,
      lessonTitle: parsedRawLesson.lesson_title,
      unitSlug: args.unitSlug,
      unitTitle: parsedRawBrowseData.unit_title,
      subjectSlug: parsedRawBrowseData.programme_fields.subject_slug,
      subjectTitle: parsedRawBrowseData.programme_fields.subject,
      examBoardSlug: parsedRawBrowseData.programme_fields.examboard_slug,
      examBoardTitle:
        parsedRawBrowseData.programme_fields.examboard_description,
      tierSlug: parsedRawBrowseData.programme_fields.tier_slug,
      tierTitle: parsedRawBrowseData.programme_fields.tier_description,
      shareableResources: constructShareableResources(parsedRawLesson),
      isLegacy: parsedRawBrowseData.is_legacy,
      expired: parsedRawLesson.expired,
    });

    return lesson;
  };

export default lessonShareQuery;
