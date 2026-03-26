import { getCorrectYear } from "../../helpers/getCorrectYear";
import { LessonListSchema, LessonListItem, Actions } from "../../shared.schema";

import {
  PackagedUnitData,
  TeachersUnitPageData,
  UnitSequence,
} from "./teachersUnitPage.schema";

import OakError from "@/errors/OakError";
import { getIntersection } from "@/utils/getIntersection";


export const getNeighbourUnits = ({
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

  const sortedUniqueUnits = unitSequenceData
    .toSorted((a, b) => a.unitOrder - b.unitOrder)
    .filter((unit, i, a) => {
      const uv = a.find((u) => u.nullUnitvariantId === unit.nullUnitvariantId);
      return a.indexOf(uv!) === i;
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
      : undefined,
    prevUnit: prevUnit
      ? {
          slug: prevUnit.unitSlug,
          title: prevUnit.optionalityTitle ?? prevUnit.unitTitle,
        }
      : undefined,
  };
};

export const getPackagedUnit = (
  packagedUnitData: PackagedUnitData,
  unitLessons: LessonListSchema,
  containsGeorestrictedLessons: boolean,
  containsLoginRequiredLessons: boolean,
  unitSequenceData: UnitSequence,
): TeachersUnitPageData => {
  const {
    programmeFields,
    unitSlug,
    unitvariantId,
    unitTitle,
    programmeSlug,
    programmeSlugByYear,
    nullUnitvariantId,
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
  ) as Actions;

  // Set `isPePractical` to true if any lesson is practical
  combinedActions.isPePractical = publishedLessonActions.some(
    (actions) => actions?.isPePractical === true,
  );

  const { nextUnit, prevUnit } = getNeighbourUnits({
    unitSequenceData,
    nullUnitvariantId,
  });

  return {
    programmeSlug,
    keyStageSlug: modifiedProgrammeFields.keystage_slug,
    keyStageTitle: modifiedProgrammeFields.keystage_description,
    subjectSlug: modifiedProgrammeFields.subject_slug,
    subjectTitle: modifiedProgrammeFields.subject,
    parentSubject: modifiedProgrammeFields.subject_parent ?? null,
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
    lessons: unitLessons,
    pathwaySlug: modifiedProgrammeFields.pathway_slug,
    pathwayTitle: modifiedProgrammeFields.pathway,
    pathwayDisplayOrder: modifiedProgrammeFields.pathway_display_order,
    actions: combinedActions,
    containsGeorestrictedLessons,
    containsLoginRequiredLessons,
    nextUnit,
    prevUnit,
  };
};
