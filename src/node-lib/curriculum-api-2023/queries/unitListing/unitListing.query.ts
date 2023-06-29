import errorReporter from "../../../../common-lib/error-reporter";
import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import unitListingSchema from "./unitListing.schema";

const unitListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string }) => {
    const res = await sdk.unitListing(args);

    const [programme] = res.programme;

    if (!programme) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (res.programme.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::lessonListing")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    return unitListingSchema.parse(programme);
  };

export default unitListingQuery;
