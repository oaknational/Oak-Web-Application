import {
  SyntheticUnitvariantLessons,
  syntheticUnitvariantLessonsSchema,
} from "@oaknational/oak-curriculum-schema";

import { Sdk } from "../../sdk";
import OakError from "../../../../errors/OakError";
import { lessonListSchema } from "../../shared.schema";
import { toSentenceCase } from "../../helpers";
import { LessonListingQuery } from "../../generated/sdk";

import lessonListingSchema, {
  LessonListingPageData,
} from "./lessonListing.schema";

export const getTransformedLessons = (res: LessonListingQuery) => {
  return res.unit
    .map((l) => {
      const lesson = syntheticUnitvariantLessonsSchema.parse(l);
      const transformedLesson = {
        lessonSlug: lesson.lesson_slug,
        lessonTitle: lesson.lesson_data.title,
        description:
          lesson.lesson_data.description ||
          lesson.lesson_data.pupil_lesson_outcome,
        pupilLessonOutcome: lesson.lesson_data.pupil_lesson_outcome,
        expired: lesson.lesson_data.deprecated_fields?.expired || false,
        quizCount:
          (lesson.lesson_data.quiz_id_starter ? 1 : 0) +
          (lesson.lesson_data.quiz_id_exit ? 1 : 0),
        videoCount: lesson.lesson_data.video_id ? 1 : 0,
        presentationCount: lesson.lesson_data.asset_id_slidedeck ? 1 : 0,
        worksheetCount: lesson.lesson_data.asset_id_worksheet ? 1 : 0,
        hasCopyrightMaterial: false, // this is hardcoded to false in previous lesson listing mv (data tools)
        orderInUnit: lesson.supplementary_data.order_in_unit,
        lessonCohort: lesson.lesson_data._cohort,
      };
      return transformedLesson;
    })
    .sort((a, b) => a.orderInUnit - b.orderInUnit);
};

export const getTransformedUnit = (
  unit: SyntheticUnitvariantLessons,
  parsedLessons: LessonListingPageData["lessons"],
): LessonListingPageData => {
  return {
    programmeSlug: unit.programme_slug,
    keyStageSlug: unit.programme_fields.keystage_slug,
    keyStageTitle: toSentenceCase(unit.programme_fields.keystage_description),
    subjectSlug: unit.programme_fields.subject_slug,
    subjectTitle: unit.programme_fields.subject,
    unitSlug: unit.unit_slug,
    unitTitle: unit.unit_data.title,
    tierSlug: unit.programme_fields.tier_slug,
    tierTitle: unit.programme_fields.tier_description,
    examBoardSlug: unit.programme_fields.examboard_slug,
    examBoardTitle: unit.programme_fields.examboard,
    yearTitle: unit.programme_fields.year_description,
    lessons: parsedLessons,
  };
};

const lessonListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string; unitSlug: string }) => {
    const res = await sdk.lessonListing(args);

    const [unit] = res.unit;

    if (!unit) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    const unitLessons = getTransformedLessons(res);
    const parsedLessons = lessonListSchema.parse(unitLessons);
    const parsedUnit = syntheticUnitvariantLessonsSchema.parse(unit);
    const transformedUnit = getTransformedUnit(parsedUnit, parsedLessons);
    return lessonListingSchema.parse(transformedUnit);
  };

export default lessonListingQuery;
