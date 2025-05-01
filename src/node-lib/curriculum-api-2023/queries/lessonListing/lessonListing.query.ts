import {
  ProgrammeFields,
  StaticLesson,
} from "@oaknational/oak-curriculum-schema";

import {
  lessonListingPageDataSchema,
  LessonListingPageData,
  partialSyntheticUnitvariantLessonsArraySchema,
  partialSyntheticUnitvariantLessonsSchema,
} from "./lessonListing.schema";

import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import OakError from "@/errors/OakError";
import {
  LessonListSchema,
  Actions,
  LessonListItem,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { LessonListingQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import { getCorrectYear } from "@/node-lib/curriculum-api-2023/helpers/getCorrectYear";
import { getIntersection } from "@/utils/getIntersection";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const getTransformedLessons = (
  lessons: LessonListingQuery["lessons"],
): LessonListSchema => {
  return lessons[0]?.static_lesson_list
    ?.sort((a: StaticLesson, b: StaticLesson) => a.order - b.order)
    .map((staticLesson: StaticLesson) => {
      const publishedLesson = lessons.find(
        (lesson) => lesson.lesson_slug === staticLesson.slug,
      );

      if (publishedLesson) {
        const lesson =
          partialSyntheticUnitvariantLessonsSchema.parse(publishedLesson);
        const hasCopyrightMaterial =
          publishedLesson.lesson_data.copyright_content?.find(
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
          isUnpublished: false,
          lessonReleaseDate: lesson.lesson_data.lesson_release_date,
        };
        return transformedLesson;
      } else {
        return {
          lessonSlug: staticLesson.slug,
          lessonTitle: staticLesson.title,
          orderInUnit: staticLesson.order,
          isUnpublished: true,
        };
      }
    });
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
  unitLessons: LessonListSchema,
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

  const combinedActions = getIntersection<LessonListItem["actions"]>(
    unitLessons
      .filter((lesson) => !lesson.isUnpublished)
      .map((lesson) => lesson.actions),
  ) as Actions;

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
    lessons: unitLessons,
    pathwaySlug: modifiedProgrammeFields.pathway_slug,
    pathwayTitle: modifiedProgrammeFields.pathway,
    pathwayDisplayOrder: modifiedProgrammeFields.pathway_display_order,
    actions: combinedActions,
  };
};

const lessonListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string; unitSlug: string }) => {
    const res = await sdk.lessonListing(args);

    const modifiedLessons = applyGenericOverridesAndExceptions<
      LessonListingQuery["lessons"][number]
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
        unitvariantId: lesson.unitvariant_id ?? 0,
        programmeSlug: lesson.programme_slug ?? "",
        unitTitle:
          lesson.programme_fields.optionality ?? lesson.unit_data.title,
        programmeSlugByYear: lesson.programme_slug_by_year,
      };
    }, {} as PackagedUnitData);

    const packagedUnit = getPackagedUnit(packagedUnitData, unitLessons);
    return lessonListingPageDataSchema.parse(packagedUnit);
  };

export default lessonListingQuery;
