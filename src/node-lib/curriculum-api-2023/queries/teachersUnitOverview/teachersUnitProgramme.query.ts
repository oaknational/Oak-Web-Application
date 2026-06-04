import { Sdk } from "../../sdk";

import { unitsInOtherProgrammesResponseSchema } from "./teachersUnitOverview.schema";

import OakError from "@/errors/OakError";

const teachersUnitProgrammeQuery =
  (sdk: Sdk) => async (args: { unitSlug: string }) => {
    const { unitInProgrammes } = await sdk.teachersUnitProgrammes(args);

    const programmes =
      unitsInOtherProgrammesResponseSchema.safeParse(unitInProgrammes);

    if (!programmes.success || programmes.data.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    return programmes.data;
  };

export default teachersUnitProgrammeQuery;
