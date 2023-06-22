import errorReporter from "../../../../common-lib/error-reporter";
import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import lessonListingSchema from "./lessonListing.schema";

const lessonListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string; unitSlug: string }) => {
    const res = await sdk.lessonListing(args);

    const [unit] = res.unit;

    if (!unit) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (res.unit.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::lessonListing")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    return lessonListingSchema.parse(unit);
  };

export default lessonListingQuery;
