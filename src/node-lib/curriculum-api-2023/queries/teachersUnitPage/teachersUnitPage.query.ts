import {
  unitPageDataSchema,
  modifiedLessonsResponseSchemaArray,
  unitSequenceResponseSchema,
  PackagedUnitData,
} from "./teachersUnitPage.schema";
import { getPackagedUnit, getTransformedLessons } from "./helpers";

import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import OakError from "@/errors/OakError";
import { TeachersUnitPageQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";

const teachersUnitPageQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string; unitSlug: string }) => {
    const { lessons, unitSequence } = await sdk.teachersUnitPage(args);

    const parsedUnitSequence = unitSequenceResponseSchema.parse(unitSequence);

    const modifiedLessons = applyGenericOverridesAndExceptions<
      TeachersUnitPageQuery["lessons"][number]
    >({
      journey: "teacher",
      queryName: "lessonListingQuery", // TODO: update query name, dependent on oak-curriculum-schema update
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
