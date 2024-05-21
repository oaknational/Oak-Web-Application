import { UnitData, lessonCounts } from "./units.schema";

import { LessonCountsForUnitDocument } from "@/node-lib/curriculum-api-2023/generated/sdk";
import { getBatchedRequests } from "@/node-lib/curriculum-api-2023/sdk";
import OakError from "@/errors/OakError";

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
        throw new OakError({
          code: "curriculum-api/not-found",
          originalError: `Lesson counts for unit not found, UnitSlug: ${unitSlug}, UnitId: ${unitId}`,
        });
      }

      if (acc[unitId] && acc[unitId]?.[unitSlug]) {
        throw new OakError({
          code: "curriculum-api/uniqueness-assumption-violated",
          originalError: `Duplicate lesson count data for unit ${unitSlug}`,
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
