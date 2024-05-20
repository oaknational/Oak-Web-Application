import { SyntheticUnitvariantLessons } from "@oaknational/oak-curriculum-schema";

import {
  LessonCountsForUnitDocument,
  ThreadsForUnitDocument,
} from "../../generated/sdk";
import { getBatchedRequests } from "../../sdk";

import {
  LearningThemes,
  UnitData,
  UnitsForProgramme,
  lessonCounts,
  threadsResponseSchema,
  unitSchema,
} from "./unitListing.schema";

import OakError from "@/errors/OakError";

export const getThreadsForUnit = async (unitIds: Array<string>) => {
  const batchThreadRequests = unitIds.map((unitId) => {
    return {
      document: ThreadsForUnitDocument,
      variables: { unitId },
    };
  });

  const threadsResponse = await getBatchedRequests(batchThreadRequests);
  const parsedThreads = threadsResponseSchema.parse(
    threadsResponse.map((tr) => tr.data),
  );

  return parsedThreads
    .map((t) => t.threads)
    .flat()
    .reduce(
      (acc, res) => {
        const threads = res.threads
          ? res.threads.map((t) => ({
              themeSlug: t.theme_slug,
              themeTitle: t.theme_title,
            }))
          : [];
        if (acc[res.unit_id]) {
          acc[res.unit_id]!.push(...threads);
        } else {
          acc[res.unit_id] = threads;
        }
        return acc;
      },
      {} as Record<string, LearningThemes>,
    );
};

export const getLessonCountsForUnit = async (units: Partial<UnitData>[][]) => {
  const batchCountsRequests = units.flat().map((u) => {
    return {
      document: LessonCountsForUnitDocument,
      variables: {
        programmeSlug: u.programmeSlug,
        unitSlug: u.slug,
      },
    };
  });

  const countsResponse = await getBatchedRequests(batchCountsRequests);
  const parsedCounts = countsResponse.map((c) => lessonCounts.parse(c.data));

  return parsedCounts.reduce(
    (acc, counts) => {
      const lessonCount = counts.lessonCount.aggregate.count;
      const expiredLessonCount = counts.expiredLessonCount.aggregate.count;

      const unitSlug =
        counts.lessonCount.nodes.find((n) => n.unit_slug)?.unit_slug ??
        counts.expiredLessonCount.nodes.find((n) => n.unit_slug)?.unit_slug;
      const unitId =
        counts.lessonCount.nodes.find((n) => n.unit_data)?.unit_data ??
        counts.expiredLessonCount.nodes.find((n) => n.unit_data)?.unit_data;

      if (!unitSlug || !unitId) {
        throw new OakError({ code: "curriculum-api/not-found" });
      }

      if (acc[unitId] && acc[unitId]?.[unitSlug]) {
        throw new OakError({
          code: "curriculum-api/uniqueness-assumption-violated",
        });
      }
      if (acc[unitId]) {
        acc[unitId] = {
          ...acc[unitId],
          [unitSlug]: { lessonCount, expiredLessonCount },
        };
      } else {
        acc[unitId] = { [unitSlug]: { lessonCount, expiredLessonCount } };
      }
      return acc;
    },
    {} as Record<
      string,
      {
        [unitSlug: string]: { lessonCount: number; expiredLessonCount: number };
      }
    >,
  );
};

export const getUnitsForProgramme = async (
  programmeData: SyntheticUnitvariantLessons[],
): Promise<UnitsForProgramme> => {
  const partialUniqueUnits = programmeData.reduce(
    (acc, programme) => {
      const unitId = programme.unit_data.unit_id;
      const optionalityTitle = programme.programme_fields.optionality;

      const unit = {
        slug: programme.unit_slug,
        title: optionalityTitle ?? programme.unit_data.title,
        nullTitle: programme.unit_data.title,
        programmeSlug: programme.programme_slug,
        keyStageSlug: programme.programme_fields.keystage_slug,
        keyStageTitle: programme.programme_fields.keystage_description,
        subjectSlug: programme.programme_fields.subject_slug,
        subjectTitle: programme.programme_fields.subject_description,
        yearTitle: programme.programme_fields.year_description,
        unitStudyOrder: programme.supplementary_data.unit_order,
        yearOrder: programme.programme_fields.year_display_order,
        cohort: programme.unit_data._cohort,
        themeSlug: null,
        themeTitle: null,
        quizCount: null,
        isOptionalityUnit: !!optionalityTitle,
      };
      if (acc[unitId]) {
        acc[unitId]!.push(unit);
      } else {
        acc[unitId] = [unit];
      }
      return acc;
    },
    {} as Record<
      string,
      Array<Partial<UnitData> & { isOptionalityUnit: boolean }>
    >,
  );

  const threads = await getThreadsForUnit(Object.keys(partialUniqueUnits));

  const lessonCounts = await getLessonCountsForUnit(
    Object.values(partialUniqueUnits),
  );

  Object.keys(partialUniqueUnits).forEach((unitId) => {
    const unit = partialUniqueUnits[unitId];
    const threadsForUnit = threads[unitId];
    const counts = lessonCounts[unitId];

    if (unit && unit.length > 0) {
      const populatedUnits = unit
        // remove null unit variants when there is optionality present
        .filter((u) => (unit.length > 1 ? u.isOptionalityUnit : true))
        .map((u) => {
          if (threadsForUnit) {
            u.learningThemes = threadsForUnit;
          }
          if (counts && u.slug && counts[u.slug]) {
            const lessonCount = counts[u.slug]?.lessonCount;
            const expiredLessonCount = counts[u.slug]?.expiredLessonCount;

            u.lessonCount = lessonCount;
            u.expiredLessonCount = expiredLessonCount;
            u.expired = expiredLessonCount === lessonCount;
          } else {
            throw new OakError({ code: "curriculum-api/not-found" });
          }
          return u;
        });

      partialUniqueUnits[unitId] = populatedUnits;
    }
  });
  const parsedUnits = unitSchema.parse(Object.values(partialUniqueUnits));
  const sortedUnits = parsedUnits
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
