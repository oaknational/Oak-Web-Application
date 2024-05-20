import { LearningThemes, threadsResponseSchema } from "./threads.schema";

import { ThreadsForUnitDocument } from "@/node-lib/curriculum-api-2023/generated/sdk";
import { getBatchedRequests } from "@/node-lib/curriculum-api-2023/sdk";

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
