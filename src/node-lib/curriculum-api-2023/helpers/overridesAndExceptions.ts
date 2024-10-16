import { z } from "zod";
import {
  programmeFieldsSchema,
  actionsSchema,
  queriesSchema,
  journeysSchema,
} from "@oaknational/oak-curriculum-schema";

type ProgrammeFieldsSnake = z.infer<typeof programmeFieldsSchema>;

export type JourneyNames = z.infer<typeof journeysSchema>;
export type QueryNames = z.infer<typeof queriesSchema>;

export type ExclusionAndOptOuts = JourneyNames | QueryNames;

export type Actions = z.infer<typeof actionsSchema>;

interface SkeletonBrowseData {
  actions?: Actions | null;
  programme_fields?: ProgrammeFieldsSnake;
}

export function applyGenericOverridesAndExceptions<
  T extends SkeletonBrowseData,
>({
  journey,
  queryName,
  browseData,
}: {
  journey: JourneyNames;
  queryName: QueryNames;
  browseData: T | T[];
}): T[] {
  const browseDataArray = Array.isArray(browseData) ? browseData : [browseData];

  const filteredBrowseData = browseDataArray.filter(
    (b) =>
      !b.actions?.exclusions?.includes(journey) &&
      !b.actions?.exclusions?.includes(queryName),
  );

  const modifiedBrowseData = filteredBrowseData.map((f) => {
    if (
      f?.actions?.programme_field_overrides &&
      !f?.actions?.opt_out?.includes(journey) &&
      !f?.actions?.opt_out?.includes(queryName)
    ) {
      return {
        ...f,
        programme_fields: {
          ...f.programme_fields,
          ...f.actions.programme_field_overrides,
        },
      };
    } else if (
      f?.actions?.opt_out?.includes(journey) ||
      f?.actions?.opt_out?.includes(queryName)
    ) {
      return {
        ...f,
        actions: {},
      };
    }
    return f;
  });

  return modifiedBrowseData;
}
