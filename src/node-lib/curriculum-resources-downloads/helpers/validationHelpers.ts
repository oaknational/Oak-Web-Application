/**
 * @fileoverview
 * Validation helper for download endpoints.
 * Validates resource selection against available options.
 */

import { z } from "zod";

import type {
  ResourceSelectionOptionsType,
  ResourceSelectionOption,
} from "../types/resource.types";

export function validateSelection({
  selection,
  availableSelectionOptions,
}: {
  selection: ResourceSelectionOptionsType;
  availableSelectionOptions: ResourceSelectionOption[];
}): void {
  const invalidSelection = selection.filter(
    (item) => !availableSelectionOptions.includes(item),
  );

  if (invalidSelection.length > 0) {
    throw new z.ZodError([
      {
        code: z.ZodIssueCode.custom,
        message: `Invalid selection, the following resources don't exist for this lesson: ${invalidSelection.join(
          ", ",
        )}${
          invalidSelection.includes("additional-files")
            ? ". Make sure that the lesson has additional files and that requested additional files belong to this lesson."
            : ""
        }`,
        path: ["selection"],
      },
    ]);
  }
}
