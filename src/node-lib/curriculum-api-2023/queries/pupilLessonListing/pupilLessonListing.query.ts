import {
  LessonListingBrowseData,
  lessonBrowseDataSchema,
} from "./pupilLessonListing.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const pupilLessonListingQuery =
  (sdk: Sdk) =>
  async (args: {
    unitSlug: string;
    programmeSlug: string;
  }): Promise<{
    browseData: LessonListingBrowseData;
  }> => {
    const { unitSlug, programmeSlug } = args;

    const res = await sdk.pupilLessonListing({
      programmeSlug,
      unitSlug,
    });

    const browseDataSnake = res.browseData;

    if (!browseDataSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (res.browseData.length > 1 && unitSlug && programmeSlug) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::pupilLessonListing")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }
    lessonBrowseDataSchema.parse(browseDataSnake);

    const browseData = keysToCamelCase(
      browseDataSnake,
    ) as LessonListingBrowseData;

    return {
      browseData,
    };
  };
