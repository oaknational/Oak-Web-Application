import { StaticLesson } from "@oaknational/oak-curriculum-schema";
import z from "zod";

import {
  unitPageDataSchema,
  modifiedLessonsResponseSchema,
  modifiedLessonsResponseSchemaArray,
  unitSequenceResponseSchema,
  PackagedUnitData,
} from "./teachersUnitPage.schema";
import { getPackagedUnit } from "./helpers";

import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import OakError from "@/errors/OakError";
import {
  LessonListSchema,
  Actions,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { TeachersUnitPageQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const getTransformedLessons = (
  lessons: z.infer<typeof modifiedLessonsResponseSchemaArray>,
): LessonListSchema => {
  return (lessons[0]?.static_lesson_list ?? [])
    .toSorted((a: StaticLesson, b: StaticLesson) => a.order - b.order)
    .map((staticLesson: StaticLesson) => {
      const publishedLesson = lessons.find(
        (lesson) => lesson.lesson_slug === staticLesson.slug,
      );

      if (publishedLesson) {
        const lesson = modifiedLessonsResponseSchema.parse(publishedLesson);

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
          orderInUnit: lesson.order_in_unit,
          actions: (keysToCamelCase(lesson.actions) || null) as Actions,
          isUnpublished: false,
          lessonReleaseDate: lesson.lesson_data.lesson_release_date,
          geoRestricted: lesson.features?.agf__geo_restricted ?? false,
          loginRequired: lesson.features?.agf__login_required ?? false,
        };
        return transformedLesson;
      } else {
        return {
          lessonSlug: staticLesson.slug,
          lessonTitle: staticLesson.title,
          orderInUnit: staticLesson.order,
          isUnpublished: true,
          lessonReleaseDate: null,
          expired: false,
        };
      }
    });
};

const teachersUnitPageQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string; unitSlug: string }) => {
    const { lessons, unitSequence } = await sdk.teachersUnitPage(args);

    const parsedUnitSequence = unitSequenceResponseSchema.parse(unitSequence);

    const modifiedLessons = applyGenericOverridesAndExceptions<
      TeachersUnitPageQuery["lessons"][number]
    >({
      journey: "teacher",
      queryName: "lessonListingQuery", // TODO: update query name?
      browseData: lessons,
    });

    if (modifiedLessons.length === 0 || parsedUnitSequence.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const containsGeorestrictedLessons = modifiedLessons.some(
      (lesson) => lesson.features?.agf__geo_restricted === true,
    );
    const containsLoginRequiredLessons = modifiedLessons.some(
      (lesson) => lesson.features?.agf__login_required === true,
    );

    const parsedModifiedLessons =
      modifiedLessonsResponseSchemaArray.parse(modifiedLessons);

    const unitLessons = getTransformedLessons(parsedModifiedLessons);

    const packagedUnitData = parsedModifiedLessons.reduce((acc, lesson) => {
      return {
        ...acc,
        programmeFields: lesson.programme_fields,
        unitSlug: lesson.unit_slug,
        unitvariantId: lesson.unitvariant_id ?? 0,
        programmeSlug: lesson.programme_slug,
        unitTitle:
          lesson.programme_fields.optionality ?? lesson.unit_data.title,
        programmeSlugByYear: lesson.programme_slug_by_year,
        nullUnitvariantId: lesson.null_unitvariant_id,
      };
    }, {} as PackagedUnitData);

    const packagedUnit = getPackagedUnit(
      packagedUnitData,
      unitLessons,
      containsGeorestrictedLessons,
      containsLoginRequiredLessons,
      parsedUnitSequence,
    );
    return unitPageDataSchema.parse(packagedUnit);
  };

export default teachersUnitPageQuery;
