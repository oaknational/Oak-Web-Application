import {
  LessonListingBrowseData,
  lessonBrowseDataSchema,
} from "./pupilLessonListing.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const pupilLessonListingQuery =
  (sdk: Sdk) =>
  async (args: {
    unitSlug: string;
    programmeSlug: string;
  }): Promise<LessonListingBrowseData> => {
    const { unitSlug, programmeSlug } = args;

    const res = await sdk.pupilLessonListing({
      programmeSlug,
      unitSlug,
    });

    const browseDataSnake = res.browseData;

    if (!browseDataSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    lessonBrowseDataSchema.parse(browseDataSnake);

    const browseData = keysToCamelCase(
      browseDataSnake,
    ) as LessonListingBrowseData;

    return [...browseData];
  };
