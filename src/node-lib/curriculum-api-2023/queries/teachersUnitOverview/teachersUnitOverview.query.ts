import {
  unitOverviewDataSchema,
  modifiedLessonsResponseSchemaArray,
  unitSequenceResponseSchema,
  PackagedUnitData,
  unitsInOtherProgrammesResponseSchema,
  threadsResponseSchema,
} from "./teachersUnitOverview.schema";
import { getPackagedUnit, getTransformedLessons } from "./helpers";

import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import OakError from "@/errors/OakError";
import { TeachersUnitOverviewQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";

type TeachersUnitOverviewQueryArgs = {
  programmeSlug: string;
  unitSlug: string;
};

const teachersUnitOverviewQuery =
  (sdk: Sdk) => async (args: TeachersUnitOverviewQueryArgs) => {
    const { lessons, unitSequence, unitsInOtherProgrammes, threads } =
      await sdk.teachersUnitOverview(args);

    const parsedUnitSequence = unitSequenceResponseSchema.parse(unitSequence);
    const parsedUnitsInOtherProgrammes =
      unitsInOtherProgrammesResponseSchema.parse(unitsInOtherProgrammes);
    const parsedThreads = threadsResponseSchema.parse(threads);

    const modifiedLessons = applyGenericOverridesAndExceptions<
      TeachersUnitOverviewQuery["lessons"][number]
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
        unitDescription: lesson.unit_data.description,
        programmeSlugByYear: lesson.programme_slug_by_year,
        nullUnitvariantId: lesson.null_unitvariant_id,
        whyThisWhyNow: lesson.unit_data.why_this_why_now,
        priorKnowledgeRequirements:
          lesson.unit_data.prior_knowledge_requirements,
        subjectCategories:
          lesson.unit_data.subjectcategories?.filter(
            (sc) => typeof sc === "string",
          ) ?? null,
      };
    }, {} as PackagedUnitData);

    const packagedUnit = getPackagedUnit({
      packagedUnitData,
      unitLessons,
      containsGeorestrictedLessons,
      containsLoginRequiredLessons,
      unitSequenceData: parsedUnitSequence,
      unitsInOtherProgrammes: parsedUnitsInOtherProgrammes,
      threads: parsedThreads,
    });

    return unitOverviewDataSchema.parse(packagedUnit);
  };

export default teachersUnitOverviewQuery;
