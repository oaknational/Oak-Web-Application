import {
  LessonListingBackLinkData,
  LessonListingBrowseData,
  PupilLessonListingQueryData,
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
  }): Promise<PupilLessonListingQueryData> => {
    const { unitSlug, programmeSlug } = args;

    const matches = /^([a-z-]*?)-(primary|secondary)-year-\d{1,2}/.exec(
      programmeSlug,
    );

    if (!matches?.[0]) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const baseSlug = matches[0];

    const res = await sdk.pupilLessonListing({
      programmeSlug,
      baseSlug,
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

    const backLinkData = keysToCamelCase(
      res.backLinkData,
    ) as LessonListingBackLinkData;

    return { browseData: [...browseData], backLinkData };
  };
