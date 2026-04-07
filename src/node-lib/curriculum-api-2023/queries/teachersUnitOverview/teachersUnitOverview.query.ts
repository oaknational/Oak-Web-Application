import {
  unitOverviewDataSchema,
  modifiedLessonsResponseSchemaArray,
  unitSequenceResponseSchema,
  PackagedUnitData,
  unitsInOtherProgrammesResponseSchema,
  subjectCategoriesSchema,
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
  subjectCategorySlug?: string;
};

const teachersUnitOverviewQuery =
  (sdk: Sdk) => async (args: TeachersUnitOverviewQueryArgs) => {
    const {
      lessons,
      unitSequence,
      unitsInOtherProgrammes,
      matchingSubjectCategories,
      threads,
    } = await sdk.teachersUnitOverview(args);

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
    const parsedMatchingSubjectCategories = subjectCategoriesSchema.parse(
      matchingSubjectCategories?.[0]?.subjectCategories,
    );

    // We receive the subject category slug, but need to map it to the subject category title
    // to be able to intersect with the subject categories on the unit sequence 😮‍💨
    const currentSubjectCategoryTitle = parsedMatchingSubjectCategories?.find(
      (category) => category.slug === args.subjectCategorySlug,
    )?.title;

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
      };
    }, {} as PackagedUnitData);

    const packagedUnit = getPackagedUnit(
      packagedUnitData,
      unitLessons,
      containsGeorestrictedLessons,
      containsLoginRequiredLessons,
      parsedUnitSequence,
      parsedUnitsInOtherProgrammes,
      parsedThreads,
      currentSubjectCategoryTitle,
    );

    return unitOverviewDataSchema.parse(packagedUnit);
  };

export default teachersUnitOverviewQuery;
