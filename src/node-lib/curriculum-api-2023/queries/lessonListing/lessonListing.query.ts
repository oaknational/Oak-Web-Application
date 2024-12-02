import {
  ProgrammeFields,
  yearSlugs,
  yearDescriptions,
} from "@oaknational/oak-curriculum-schema";

import { Sdk } from "../../sdk";
import OakError from "../../../../errors/OakError";
import { LessonListSchema } from "../../shared.schema";
import { LessonListingQuery } from "../../generated/sdk";
import { applyGenericOverridesAndExceptions } from "../../helpers/overridesAndExceptions";

import lessonListingSchema, {
  LessonListingPageData,
  partialSyntheticUnitvariantLessonsArraySchema,
  partialSyntheticUnitvariantLessonsSchema,
} from "./lessonListing.schema";

export const getTransformedLessons = (
  lessons: LessonListingQuery["lessons"],
): LessonListSchema => {
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
      };
      return transformedLesson;
    })
    .sort((a, b) => a.orderInUnit - b.orderInUnit);
};

type PackagedUnitData = {
  programmeFields: ProgrammeFields;
  unitSlug: string;
  programmeSlug: string;
  unitTitle: string;
  programmeSlugByYear: string[];
};

export const getPackagedUnit = (
  packagedUnitData: PackagedUnitData,
  unitLessons: LessonListSchema,
): LessonListingPageData => {
  const {
    programmeFields,
    unitSlug,
    unitTitle,
    programmeSlug,
    programmeSlugByYear,
  } = packagedUnitData;

  programmeSlugByYear.sort((a, b) => a.localeCompare(b));
  const yearSlug = programmeSlugByYear[0]
    ?.split(`${programmeFields.phase_slug}-`)[1]
    ?.replace("-l", "");

  const parsedYearSlug = yearSlugs.safeParse(yearSlug);
  if (
    parsedYearSlug.success &&
    parsedYearSlug.data !== programmeFields.year_slug
  ) {
    programmeFields.year_slug = parsedYearSlug.data;
    const parsedYearDescription = yearDescriptions.safeParse(
      parsedYearSlug.data.replace("year-", "Year "),
    ).data;
    if (parsedYearDescription) {
      programmeFields.year_description = parsedYearDescription;
    }
  }

  return {
    programmeSlug,
    keyStageSlug: programmeFields.keystage_slug,
    keyStageTitle: programmeFields.keystage_description,
    subjectSlug: programmeFields.subject_slug,
    subjectTitle: programmeFields.subject,
    unitSlug,
    unitTitle,
    tierSlug: programmeFields.tier_slug,
    tierTitle: programmeFields.tier_description,
    examBoardSlug: programmeFields.examboard_slug,
    examBoardTitle: programmeFields.examboard,
    yearSlug: programmeFields.year_slug,
    yearTitle: programmeFields.year_description,
    lessons: unitLessons,
    pathwaySlug: programmeFields.pathway_slug,
    pathwayTitle: programmeFields.pathway,
    pathwayDisplayOrder: programmeFields.pathway_display_order,
  };
};

const lessonListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string; unitSlug: string }) => {
    const res = await sdk.lessonListing(args);

    const modifiedLessons = applyGenericOverridesAndExceptions<
      LessonListingQuery["lessons"][number]
    >({
      journey: "pupil",
      queryName: "pupilLessonListingQuery",
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
        programmeSlug: lesson.programme_slug ?? "",
        unitTitle:
          lesson.programme_fields.optionality ?? lesson.unit_data.title,
        programmeSlugByYear: lesson.programme_slug_by_year,
      };
    }, {} as PackagedUnitData);
    const transformedUnit = getPackagedUnit(packagedUnitData, unitLessons);
    return lessonListingSchema.parse(transformedUnit);
  };

export default lessonListingQuery;
