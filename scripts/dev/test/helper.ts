import { relative } from "path";

import { z } from "zod";

export const resultsSchema = z.object({
  testResults: z.array(
    z.object({
      name: z.string(),
      status: z.string(),
      startTime: z.number().nullable(),
      endTime: z.number().nullable(),
      assertionResults: z.array(
        z.object({
          duration: z.number().nullable(),
          fullName: z.string(),
          status: z.string(),
          title: z.string(),
        }),
      ),
    }),
  ),
});

export function extractCommands(
  testJson: z.infer<typeof resultsSchema>,
  { min = 0 }: { min: number },
) {
  const origResults = testJson.testResults
    .flatMap((result) => {
      if (result.status === "passed") {
        const testName = relative(import.meta.dirname ?? "", result.name);
        const duration =
          result.endTime && result.startTime
            ? result.endTime - result.startTime
            : 0;

        return {
          name: testName,
          duration,
          status: result.status,
          assertions: result.assertionResults
            .map((assertionResult) => {
              return {
                name: assertionResult.fullName,
                status: assertionResult.status,
                duration: assertionResult.duration ?? 0,
              };
            })
            .toSorted((a, b) => b.duration - a.duration),
        };
      } else {
        return [];
      }
    })
    .toSorted((a, b) => b.duration - a.duration);

  const results = origResults.map((result) => {
    return {
      ...result,
      assertions: result.assertions.filter((assertion) => {
        return assertion.duration > min;
      }),
    };
  });
  return results;
}
