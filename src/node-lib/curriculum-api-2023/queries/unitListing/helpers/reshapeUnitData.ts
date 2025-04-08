import { groupBy, values } from "lodash";

import { UnitsCamel, GroupedUnitsSchema } from "../unitListing.schema";

export const reshapeUnitData = (rawUnits: UnitsCamel): GroupedUnitsSchema => {
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
    subjectCategories:
      unit.unitData.subjectcategories?.map((category) => ({
        label: String(category),
      })) || null,
    learningThemes:
      unit.threads?.map((thread) => ({
        themeTitle: thread.threadTitle,
        themeSlug: thread.threadSlug,
      })) || null,
    actions: unit.actions,
    groupUnitsAs: unit.actions?.groupUnitsAs ?? null,
  }));

  /*
   *
   * The following code is to remove duplicate units from legacy data.
   * It should be removed once the legacy data is no longer in use.
   *
   */

  // sort the units by year so that we preferentially display units where they first appear
  processedUnits.sort((a, b) => (a.yearOrder > b.yearOrder ? 1 : -1));

  const filteredUnits = processedUnits.filter(
    (unit, i) => processedUnits.findIndex((u) => u.slug === unit.slug) === i, // check there isn't an earlier instance of the unit
  );

  // group optionality units
  const groupedUnits = values(
    groupBy(
      filteredUnits,
      (unit) =>
        unit.isOptionalityUnit
          ? unit.slug.replace(/-\d+?$/, "") // strip the numbers from the end of the slug
          : unit.slug + unit.year, // legacy units occasionally have the same title so we need to check they are optionality before grouping them (slugs are always unique)
    ),
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
