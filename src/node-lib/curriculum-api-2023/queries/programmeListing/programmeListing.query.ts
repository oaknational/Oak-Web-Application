import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import { programmeListingSchema } from "./programmeListing.schema";

const programmeListingQuery =
  (sdk: Sdk) => async (args: { keyStageSlug: string; subjectSlug: string }) => {
    const res = await sdk.programmeListing(args);

    const [programmes] = res.programmes;

    if (!programmes) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    return programmeListingSchema.parse(programmes);
  };

export default programmeListingQuery;
