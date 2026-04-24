import { ActionsCamel, StaticLesson } from "@oaknational/oak-curriculum-schema";
import z from "zod";
import { keysToCamelCase } from "zod-to-camel-case";

import { getCorrectYear } from "../../helpers/getCorrectYear";
import { LessonListSchema, LessonListItem } from "../../shared.schema";

import {
  modifiedLessonsResponseSchema,
  modifiedLessonsResponseSchemaArray,
  PackagedUnitData,
  ProgrammeToggles,
  TeachersUnitOverviewData,
  Threads,
  UnitSequence,
  UnitsInOtherProgrammes,
} from "./teachersUnitOverview.schema";

import OakError from "@/errors/OakError";
import { sortChildSubjects, sortTiers } from "@/utils/curriculum/sorting";
import { getIntersection } from "@/utils/getIntersection";

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
          actions: (keysToCamelCase(lesson.actions) || null) as ActionsCamel,
          isUnpublished: false as const,
          lessonReleaseDate: lesson.lesson_data.lesson_release_date ?? null,
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

export const getAdjacentUnits = ({
  unitSequenceData,
  nullUnitvariantId,
}: {
  unitSequenceData: UnitSequence;
  nullUnitvariantId: number;
}) => {
  const currentUnit = unitSequenceData.find(
    (u) => u.nullUnitvariantId === nullUnitvariantId,
  );

  if (!currentUnit) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  const isCurrentUnitSwimming = currentUnit.isSwimming === true;
  const shouldGroupBySubjectCategory =
    currentUnit.actions?.subject_category_actions?.group_by_subjectcategory;

  const sortedUniqueUnits = unitSequenceData
    .toSorted((a, b) => {
      // Sort units first by year and then by unit order
      // because unitOrder is unique only within year
      return a.yearOrder - b.yearOrder || a.unitOrder - b.unitOrder;
    })
    .filter((unit, i, a) => {
      const uv = a.find((u) => u.nullUnitvariantId === unit.nullUnitvariantId);
      return a.indexOf(uv!) === i;
    })
    .filter((unit) => {
      if (shouldGroupBySubjectCategory) {
        // Filter to units in the same subject category when we should group them
        const hasMatchingCategory = currentUnit.subjectCategories?.some(
          (category) => unit.subjectCategories?.includes(category),
        );
        return hasMatchingCategory;
      }
      return true;
    })
    .filter((unit) => {
      // Swimming units are grouped across all years.
      if (isCurrentUnitSwimming) {
        return unit.isSwimming === true;
      }

      // Exclude swimming units from non-swimming navigation.
      return unit.isSwimming !== true;
    });

  const currentUnitIndex = sortedUniqueUnits.indexOf(currentUnit);
  const nextUnit = sortedUniqueUnits[currentUnitIndex + 1];
  const prevUnit = sortedUniqueUnits[currentUnitIndex - 1];

  return {
    nextUnit: nextUnit
      ? {
          slug: nextUnit.unitSlug,
          title: nextUnit.optionalityTitle ?? nextUnit.unitTitle,
        }
      : null,
    prevUnit: prevUnit
      ? {
          slug: prevUnit.unitSlug,
          title: prevUnit.optionalityTitle ?? prevUnit.unitTitle,
        }
      : null,
  };
};

export const getUnitCounts = ({
  unitSequenceData,
  nullUnitvariantId,
}: {
  unitSequenceData: UnitSequence;
  nullUnitvariantId: number;
}) => {
  const currentUnit = unitSequenceData.find(
    (u) => u.nullUnitvariantId === nullUnitvariantId,
  );
  if (!currentUnit) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  const isCurrentUnitSwimming = currentUnit.isSwimming === true;
  const shouldGroupBySubjectCategory =
    currentUnit.actions?.subject_category_actions?.group_by_subjectcategory;

  const unitsForYear = unitSequenceData
    .reduce((acc: UnitSequence, unit) => {
      // Only count optionality units once
      if (!acc.some((u) => u.nullUnitvariantId === unit.nullUnitvariantId)) {
        acc.push(unit);
      }
      return acc;
    }, [])
    .filter((u) => {
      // Keep only units that intersect with the current unit on at least
      // one subject category.
      // !IMPORTANT: This will break if currentUnit belongs to multiple subject categories
      if (shouldGroupBySubjectCategory) {
        return u.subjectCategories?.some((category) =>
          currentUnit.subjectCategories?.includes(category),
        );
      }
      return true;
    })
    .filter((u) => {
      // Swimming units are grouped across all years; all other units are grouped by year.
      if (isCurrentUnitSwimming) {
        return u.isSwimming === true;
      }

      // Exclude swimming units from all years.
      return u.year === currentUnit.year && u.isSwimming !== true;
    })
    .sort((a, b) => a.unitOrder - b.unitOrder);

  return {
    unitCount: unitsForYear.length,
    unitIndex:
      unitsForYear.findIndex((u) => u.nullUnitvariantId === nullUnitvariantId) +
      1,
  };
};

export const getPackagedUnit = ({
  packagedUnitData,
  unitLessons,
  containsGeorestrictedLessons,
  containsLoginRequiredLessons,
  unitSequenceData,
  unitsInOtherProgrammes,
  threads,
}: {
  packagedUnitData: PackagedUnitData;
  unitLessons: LessonListSchema;
  containsGeorestrictedLessons: boolean;
  containsLoginRequiredLessons: boolean;
  unitSequenceData: UnitSequence;
  unitsInOtherProgrammes: UnitsInOtherProgrammes;
  threads: Threads;
}): TeachersUnitOverviewData => {
  const {
    programmeFields,
    unitSlug,
    unitvariantId,
    unitTitle,
    unitDescription,
    programmeSlug,
    programmeSlugByYear,
    nullUnitvariantId,
    whyThisWhyNow,
    priorKnowledgeRequirements,
    subjectCategories,
  } = packagedUnitData;

  const modifiedProgrammeFields = getCorrectYear({
    programmeSlugByYear,
    programmeFields,
  });

  const publishedLessonActions = unitLessons
    .filter((lesson) => !lesson.isUnpublished)
    .map((lesson) => lesson.actions);

  const combinedActions = getIntersection<LessonListItem["actions"]>(
    publishedLessonActions,
  ) as ActionsCamel;

  // Set `isPePractical` to true if any lesson is practical
  combinedActions.isPePractical = publishedLessonActions.some(
    (actions) => actions?.isPePractical === true,
  );

  const { nextUnit, prevUnit } = getAdjacentUnits({
    unitSequenceData,
    nullUnitvariantId,
  });

  const { tierOptionToggles, subjectOptionToggles } = getProgrammeToggles(
    programmeSlug,
    unitsInOtherProgrammes,
  );
  const { unitCount, unitIndex } = getUnitCounts({
    unitSequenceData,
    nullUnitvariantId,
  });

  const threadItems = threads
    .flatMap((thread) => thread.threads?.map((t) => t.thread_title))
    .filter((thread) => thread !== undefined);

  return {
    programmeSlug,
    keyStageSlug: modifiedProgrammeFields.keystage_slug,
    keyStageTitle: modifiedProgrammeFields.keystage_description,
    subjectSlug: modifiedProgrammeFields.subject_slug,
    subjectTitle: modifiedProgrammeFields.subject,
    parentSubject: modifiedProgrammeFields.subject_parent ?? null,
    subjectCategories,
    unitSlug,
    unitvariantId,
    unitTitle,
    unitDescription,
    unitIndex,
    unitCount,
    tierSlug: modifiedProgrammeFields.tier_slug,
    tierTitle: modifiedProgrammeFields.tier_description,
    examBoardSlug: modifiedProgrammeFields.examboard_slug,
    examBoardTitle: modifiedProgrammeFields.examboard,
    yearSlug: modifiedProgrammeFields.year_slug,
    yearTitle: modifiedProgrammeFields.year_description,
    year: modifiedProgrammeFields.year,
    lessons: unitLessons,
    pathwaySlug: modifiedProgrammeFields.pathway_slug,
    pathwayTitle: modifiedProgrammeFields.pathway,
    pathwayDisplayOrder: modifiedProgrammeFields.pathway_display_order,
    phaseSlug: modifiedProgrammeFields.phase_slug,
    phaseTitle: modifiedProgrammeFields.phase_description,
    actions: combinedActions,
    whyThisWhyNow,
    priorKnowledgeRequirements,
    containsGeorestrictedLessons,
    containsLoginRequiredLessons,
    nextUnit,
    prevUnit,
    tierOptionToggles,
    subjectOptionToggles,
    threads: threadItems,
  };
};

export const getProgrammeToggles = (
  programmeSlug: string,
  allProgrammes: UnitsInOtherProgrammes,
) => {
  const currentProgramme = allProgrammes.find(
    (programme) => programme.programme_slug === programmeSlug,
  );
  if (!currentProgramme) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  let tierOptionToggles: ProgrammeToggles = [];
  if (currentProgramme.programme_fields.tier_description) {
    // Reduce to programmes that only differ on tier
    tierOptionToggles = allProgrammes
      .filter(
        (programme) =>
          programme.programme_fields.subject_slug ===
            currentProgramme.programme_fields.subject_slug &&
          programme.programme_fields.examboard_slug ===
            currentProgramme.programme_fields.examboard_slug,
      )
      .filter(hasTierFields)
      .toSorted((a, b) => sortTiers(a.programme_fields, b.programme_fields))
      .map((programme) => ({
        title: programme.programme_fields.tier_description,
        programmeSlug: programme.programme_slug,
        isSelected: programme.programme_slug === programmeSlug,
      })) as ProgrammeToggles;
  }

  let subjectOptionToggles: ProgrammeToggles = allProgrammes
    .filter(
      (programme) =>
        programme.programme_fields.examboard_slug ===
          currentProgramme.programme_fields.examboard_slug &&
        programme.programme_fields.tier_slug ===
          currentProgramme.programme_fields.tier_slug,
    )
    .toSorted((a, b) =>
      sortChildSubjects(a.programme_fields, b.programme_fields),
    )
    .map((programme) => ({
      title: programme.programme_fields.subject,
      programmeSlug: programme.programme_slug,
      isSelected: programme.programme_slug === programmeSlug,
      subjectSlug: programme.programme_fields.subject_slug,
    }));

  if (subjectOptionToggles.length === 1) {
    // clear the array, we don't need to return the current subject as a single toggle
    subjectOptionToggles = [];
  }

  return {
    tierOptionToggles,
    subjectOptionToggles,
  };
};

function hasTierFields<T extends UnitsInOtherProgrammes[number]>(
  programme: T,
): programme is T & {
  programme_fields: T["programme_fields"] & {
    tier_slug: string;
    tier_description: string;
  };
} {
  return (
    programme.programme_fields.tier_description !== null &&
    programme.programme_fields.tier_slug !== null
  );
}
