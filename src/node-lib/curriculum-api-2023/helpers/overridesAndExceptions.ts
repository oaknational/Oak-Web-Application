import { z } from "zod";
import { programmeFieldsSchema } from "@oaknational/oak-curriculum-schema";

type ProgrammeFieldsSnake = z.infer<typeof programmeFieldsSchema>;

export type JourneyNames = "pupil" | "teacher" | "curriculum";
export type QueryNames =
  | "pupilProgrammeListingQuery"
  | "pupilSubjectListingQuery"
  | "pupilUnitListingQuery"
  | "pupilLessonListingQuery";

export type ExclusionAndOptOuts = JourneyNames | QueryNames;

interface Actions {
  exclusions?: ExclusionAndOptOuts[];
  opt_out?: ExclusionAndOptOuts[];
  programme_field_overrides?: Partial<ProgrammeFieldsSnake>;
}

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
    }
    return f;
  });

  return modifiedBrowseData;
}
