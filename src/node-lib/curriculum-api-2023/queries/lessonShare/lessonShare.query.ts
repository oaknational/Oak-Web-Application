import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import { lessonShareSchema } from "./lessonShare.schema";

import errorReporter from "@/common-lib/error-reporter";
import { LEGACY_COHORT } from "@/config/cohort";

const lessonShareQuery =
  (sdk: Sdk) =>
  async (args: {
    programmeSlug: string;
    unitSlug: string;
    lessonSlug: string;
  }) => {
    const res = await sdk.lessonShare(args);
    const pages = res.share;

    if (!pages || pages.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (pages.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::lessonShare")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    const page = pages[0];

    return lessonShareSchema.parse({
      ...page,
      isLegacy: page?.lessonCohort === LEGACY_COHORT,
      isSpecialist: false,
    });
  };

export default lessonShareQuery;
