import { groupBy, values } from "lodash";

import { UnitsCamel } from "../unitListing.schema";

import { UnitsForProgramme } from "./units.schema";

export const getUnitsForProgramme = (
  rawUnits: UnitsCamel,
): UnitsForProgramme => {
  const processedUnits = rawUnits.map((unit) => ({
    slug: unit.unitSlug,
    title: unit.programmeFields.optionality ?? unit.unitData.title,
    nullTitle: unit.unitData.title,
    programmeSlug: unit.programmeSlug,
    keyStageSlug: unit.programmeFields.keystageSlug,
    keyStageTitle: unit.programmeFields.keystageDescription,
    subjectSlug: unit.programmeFields.subjectSlug,
    subjectTitle: unit.programmeFields.subject,
    yearTitle: unit.programmeFields.yearDescription,
    year: unit.programmeFields.yearSlug,
    unitStudyOrder: unit.supplementaryData.unitOrder,
    yearOrder: unit.programmeFields.yearDisplayOrder,
    cohort: unit.unitData.Cohort,
    isOptionalityUnit: !!unit.programmeFields.optionality,
    lessonCount: unit.lessonCount,
    expiredLessonCount: unit.lessonExpiredCount,
    expired: unit.lessonCount === unit.lessonExpiredCount,
    subjectCategories: unit.unitData.subjectcategories,
    learningThemes: unit.threads,
  }));

  // group optionality units
  const groupedUnits = values(
    groupBy(processedUnits, (unit) => unit.nullTitle),
  );

  const sortedUnits = groupedUnits
    .map((units) => units.sort((a, b) => (a.title > b.title ? 1 : -1)))
    .sort((a, b) => {
      // Sort units first by year and then by unit order
      return (
        a[0]!.yearOrder - b[0]!.yearOrder ||
        a[0]!.unitStudyOrder - b[0]!.unitStudyOrder
      );
    });

  return sortedUnits;
};
