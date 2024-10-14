import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";
import { toSentenceCase } from "../../helpers";
import {
  InputMaybe,
  Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_10_0_0_Bool_Exp,
} from "../../generated/sdk";
import { rawSyntheticUVLessonSchema } from "../lessonDownloads/rawSyntheticUVLesson.schema";
import { LessonPathway, lessonPathwaySchema } from "../../shared.schema";

import {
  RawLessonShareSchema,
  canonicalLessonShareSchema,
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
    label: "Starter quiz",
    metadata: lesson.starter_quiz
      ? `${starterQuizLength} question${starterQuizLength === 1 ? "" : "s"}`
      : "",
  };
  const exitQuiz = {
    exists: lesson.exit_quiz !== null,
    type: "exit-quiz-questions" as const,
    label: "Exit quiz",
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
  async <T>(args: {
    programmeSlug?: string;
    unitSlug?: string;
    lessonSlug: string;
  }): Promise<T> => {
    const { lessonSlug, unitSlug, programmeSlug } = args;
    const browseDataWhere: InputMaybe<Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_10_0_0_Bool_Exp> =
      {};

    const canonicalLesson = !unitSlug && !programmeSlug;

    if (canonicalLesson) {
      browseDataWhere["lesson_slug"] = { _eq: lessonSlug };
    }

    if (unitSlug) {
      browseDataWhere["unit_slug"] = { _eq: unitSlug };
    }

    if (programmeSlug) {
      browseDataWhere["programme_slug"] = { _eq: programmeSlug };
    }

    const res = await sdk.lessonShare({ lessonSlug, browseDataWhere });

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
    const shareableResources = constructShareableResources(parsedRawLesson);

    if (canonicalLesson) {
      const parsedBrowseData = rawBrowseData.map((bd) =>
        rawSyntheticUVLessonSchema.parse(bd),
      );
      const pathways = parsedBrowseData.reduce((acc, lesson) => {
        const unitTitle =
          lesson.programme_fields.optionality ?? lesson.unit_data.title;
        const pathwayLesson = {
          programmeSlug: lesson.programme_slug,
          unitSlug: lesson.unit_data.slug,
          unitTitle,
          keyStageSlug: lesson.programme_fields.keystage_slug,
          keyStageTitle: toSentenceCase(
            lesson.programme_fields.keystage_description,
          ),
          subjectSlug: lesson.programme_fields.subject_slug,
          subjectTitle: lesson.programme_fields.subject,
          lessonCohort: lesson.lesson_data._cohort,
          examBoardSlug: lesson.programme_fields.examboard_slug,
          examBoardTitle: lesson.programme_fields.examboard,
          lessonSlug: lesson.lesson_slug,
          lessonTitle: lesson.lesson_data.title,
          tierSlug: lesson.programme_fields.tier_slug,
          tierTitle: lesson.programme_fields.tier_description,
        };

        const pathway = lessonPathwaySchema.parse(pathwayLesson);
        acc.push(pathway);
        return acc;
      }, [] as LessonPathway[]);

      const lesson = canonicalLessonShareSchema.parse({
        shareableResources,
        isLegacy: parsedRawBrowseData.is_legacy,
        expired: parsedRawLesson.expired,
        pathways,
        isSpecialist: false,
        lessonSlug,
        lessonTitle: parsedRawLesson.lesson_title,
      });
      return lesson as T;
    } else {
      const lesson = lessonShareSchema.parse({
        isSpecialist: false,
        programmeSlug: programmeSlug,
        keyStageSlug: parsedRawBrowseData.programme_fields.keystage_slug,
        keyStageTitle: toSentenceCase(
          parsedRawBrowseData.programme_fields.keystage_description,
        ),
        lessonSlug: lessonSlug,
        lessonTitle: parsedRawLesson.lesson_title,
        unitSlug: args.unitSlug,
        unitTitle:
          parsedRawBrowseData.programme_fields.optionality ??
          parsedRawBrowseData.unit_title,
        subjectSlug: parsedRawBrowseData.programme_fields.subject_slug,
        subjectTitle: parsedRawBrowseData.programme_fields.subject,
        examBoardSlug: parsedRawBrowseData.programme_fields.examboard_slug,
        examBoardTitle:
          parsedRawBrowseData.programme_fields.examboard_description,
        tierSlug: parsedRawBrowseData.programme_fields.tier_slug,
        tierTitle: parsedRawBrowseData.programme_fields.tier_description,
        shareableResources,
        isLegacy: parsedRawBrowseData.is_legacy,
        expired: parsedRawLesson.expired,
      });

      return lesson as T;
    }
  };

export default lessonShareQuery;
