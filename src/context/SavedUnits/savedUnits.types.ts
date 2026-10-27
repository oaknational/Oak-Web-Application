import z from "zod";

import { TrackingProgrammeData } from "@/node-lib/educator-api/helpers/saveUnits/utils";

type ProgrammeSaveState = {
  saved: ReadonlySet<string>;
  pending: ReadonlySet<string>;
};

export type SavedUnitsState = {
  programmes: Record<string, ProgrammeSaveState>;
  toggle: (
    programmeSlug: string,
    unitSlug: string,
    tracking: TrackingProgrammeData,
  ) => void;
  canSave: boolean;
};

export const unitsResponseSchema = z.array(z.string());
