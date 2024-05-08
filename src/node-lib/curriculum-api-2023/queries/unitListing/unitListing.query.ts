import errorReporter from "../../../../common-lib/error-reporter";
import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";
import { toSentenceCase, filterOutCoreTier } from "../../helpers";

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

    const isLegacy = programme.programmeSlug?.endsWith("-l") ?? false;

    return unitListingSchema.parse({
      ...programme,
      tiers:
        programme.tiers &&
        filterOutCoreTier(
          isLegacy,
          programme.subjectSlug,
          programme.keyStageSlug,
          programme.tiers,
        ),
      keyStageTitle:
        programme.keyStageTitle && toSentenceCase(programme.keyStageTitle),
    });
  };

export default unitListingQuery;
