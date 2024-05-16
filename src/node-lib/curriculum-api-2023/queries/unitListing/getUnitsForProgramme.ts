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
  console.log("threadsResponse", threadsResponse);
  const parsedThreads = threadsResponseSchema.parse(threadsResponse);

  return parsedThreads.reduce(
    (acc, res) => {
      const threads = res.threads.map((t) => ({
        themeSlug: t.theme_slug,
        themeTitle: t.theme_title,
      }));
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
  const parsedCounts = countsResponse.map((c) => lessonCounts.parse(c));

  return parsedCounts.reduce(
    (acc, counts) => {
      const lessonCount = counts.lessonCount.aggregate.count;
      const expiredLessonCount = counts.expiredLessonCount.aggregate.count;
      const unitId = counts.lessonCount.nodes[0]?.unit_id;
      if (!unitId) {
        throw new OakError({ code: "curriculum-api/not-found" });
      }
      if (acc[unitId]) {
        throw new OakError({
          code: "curriculum-api/uniqueness-assumption-violated",
        });
      }
      acc[unitId] = { lessonCount, expiredLessonCount };
      return acc;
    },
    {} as Record<string, { lessonCount: number; expiredLessonCount: number }>,
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
        cohort: programme.unit_data._cohort,
        themeSlug: null,
        themeTitle: null,
        quizCount: null,
      };
      if (acc[unitId]) {
        acc[unitId]!.push(unit);
      } else {
        acc[unitId] = [unit];
      }
      return acc;
    },
    {} as Record<string, Array<Partial<UnitData>>>,
  );

  const threads = await getThreadsForUnit(Object.keys(partialUniqueUnits));
  const lessonCounts = await getLessonCountsForUnit(
    Object.values(partialUniqueUnits),
  );

  Object.keys(partialUniqueUnits).forEach((unitId) => {
    const unit = partialUniqueUnits[unitId];
    const threadsForUnit = threads[unitId];
    console.log("threadsForUnit", threadsForUnit);
    const counts = lessonCounts[unitId];
    if (unit && unit.length > 0) {
      const populatedUnits = unit.map((u) => {
        if (threadsForUnit) {
          u.learningThemes = threadsForUnit;
        }
        if (counts) {
          u.lessonCount = counts.lessonCount;
          u.expiredLessonCount = counts.expiredLessonCount;
          u.expired = u.expiredLessonCount === u.lessonCount;
        } else {
          throw new OakError({ code: "curriculum-api/not-found" });
        }
        return u;
      });
      partialUniqueUnits[unitId] = populatedUnits;
    }
  });

  return unitSchema.parse(Object.values(partialUniqueUnits));
};
