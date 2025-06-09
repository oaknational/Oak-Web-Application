import { ProgrammeFields } from "@oaknational/oak-curriculum-schema";

import { BetaLessonListSchema } from "./teacherPreviewLessonListing.schema";

import {
  lessonListingPageDataSchema,
  LessonListingPageData,
  partialSyntheticUnitvariantLessonsArraySchema,
  partialSyntheticUnitvariantLessonsSchema,
} from "@/node-lib/curriculum-api-2023/queries/lessonListing/lessonListing.schema";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import OakError from "@/errors/OakError";
import { Actions } from "@/node-lib/curriculum-api-2023/shared.schema";
import { TeacherPreviewLessonListingQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import { getCorrectYear } from "@/node-lib/curriculum-api-2023/helpers/getCorrectYear";
import { getIntersection } from "@/utils/getIntersection";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const getTransformedLessons = (
  lessons: TeacherPreviewLessonListingQuery["lessons"],
): BetaLessonListSchema => {
  return lessons
    .map((l) => {
      const lesson = partialSyntheticUnitvariantLessonsSchema.parse(l);
      const hasCopyrightMaterial =
        l.lesson_data.copyright_content?.find(
          (c: { copyright_info: string }) =>
            c.copyright_info === "This lesson contains copyright material.",
        ) !== undefined;

      const transformedLesson = {
        lessonSlug: lesson.lesson_slug,
        lessonTitle: lesson.lesson_data.title,
        description:
          lesson.lesson_data.description ||
          lesson.lesson_data.pupil_lesson_outcome,
        pupilLessonOutcome: lesson.lesson_data.pupil_lesson_outcome,
        expired: Boolean(lesson.lesson_data.deprecated_fields?.expired),
        quizCount:
          (lesson.lesson_data.quiz_id_starter ? 1 : 0) +
          (lesson.lesson_data.quiz_id_exit ? 1 : 0),
        videoCount: lesson.lesson_data.video_id ? 1 : 0,
        presentationCount: lesson.lesson_data.asset_id_slidedeck ? 1 : 0,
        worksheetCount: lesson.lesson_data.asset_id_worksheet ? 1 : 0,
        hasCopyrightMaterial,
        orderInUnit: lesson.order_in_unit,
        lessonCohort: lesson.lesson_data._cohort,
        actions: (keysToCamelCase(lesson.actions) || null) as Actions,
        lessonReleaseDate: "unreleased",
      };
      return transformedLesson;
    })
    .sort((a, b) => a.orderInUnit - b.orderInUnit);
};

type PackagedUnitData = {
  programmeFields: ProgrammeFields;
  unitSlug: string;
  unitvariantId: number;
  programmeSlug: string;
  unitTitle: string;
  programmeSlugByYear: string[];
};

export const getPackagedUnit = (
  packagedUnitData: PackagedUnitData,
  unitLessons: BetaLessonListSchema,
): LessonListingPageData => {
  const {
    programmeFields,
    unitSlug,
    unitvariantId,
    unitTitle,
    programmeSlug,
    programmeSlugByYear,
  } = packagedUnitData;

  const modifiedProgrammeFields = getCorrectYear({
    programmeSlugByYear,
    programmeFields,
  });

  const combinedActions = getIntersection<
    BetaLessonListSchema[number]["actions"]
  >(unitLessons.map((lesson) => lesson.actions)) as Actions;

  return {
    programmeSlug,
    keyStageSlug: modifiedProgrammeFields.keystage_slug,
    keyStageTitle: modifiedProgrammeFields.keystage_description,
    subjectSlug: modifiedProgrammeFields.subject_slug,
    subjectTitle: modifiedProgrammeFields.subject,
    unitSlug,
    unitvariantId,
    unitTitle,
    tierSlug: modifiedProgrammeFields.tier_slug,
    tierTitle: modifiedProgrammeFields.tier_description,
    examBoardSlug: modifiedProgrammeFields.examboard_slug,
    examBoardTitle: modifiedProgrammeFields.examboard,
    yearSlug: modifiedProgrammeFields.year_slug,
    yearTitle: modifiedProgrammeFields.year_description,
    year: modifiedProgrammeFields.year,
    lessons: unitLessons.map((lesson) => ({
      ...lesson,
      isUnpublished: true,
    })),
    pathwaySlug: modifiedProgrammeFields.pathway_slug,
    pathwayTitle: modifiedProgrammeFields.pathway,
    pathwayDisplayOrder: modifiedProgrammeFields.pathway_display_order,
    actions: combinedActions,
  };
};

const teacherPreviewLessonListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string; unitSlug: string }) => {
    const res = await sdk.teacherPreviewLessonListing(args);

    const modifiedLessons = applyGenericOverridesAndExceptions<
      TeacherPreviewLessonListingQuery["lessons"][number]
    >({
      journey: "teacher",
      queryName: "lessonListingQuery",
      browseData: res.lessons,
    });

    if (modifiedLessons.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const parsedModifiedLessons =
      partialSyntheticUnitvariantLessonsArraySchema.parse(modifiedLessons);

    const unitLessons = getTransformedLessons(parsedModifiedLessons);
    const packagedUnitData = modifiedLessons.reduce((acc, lesson) => {
      return {
        ...acc,
        programmeFields: lesson.programme_fields,
        unitSlug: lesson.unit_slug ?? "",
        unitvariantId: lesson.null_unitvariant_id ?? 0, // it should be unitvariant_id but we don't have it available on this mv
        programmeSlug: lesson.programme_slug ?? "",
        unitTitle:
          lesson.programme_fields.optionality ?? lesson.unit_data.title,
        programmeSlugByYear: lesson.programme_slug_by_year,
      };
    }, {} as PackagedUnitData);

    const packagedUnit = getPackagedUnit(packagedUnitData, unitLessons);
    return lessonListingPageDataSchema.parse(packagedUnit);
  };

export default teacherPreviewLessonListingQuery;
