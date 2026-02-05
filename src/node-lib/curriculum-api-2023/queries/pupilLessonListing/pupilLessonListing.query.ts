import {
  LessonListingBackLinkData,
  LessonListingBrowseData,
  PupilLessonListingQueryData,
  lessonBrowseDataSchema,
} from "./pupilLessonListing.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import { PupilLessonListingQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const pupilLessonListingQuery =
  (sdk: Sdk) =>
  async (args: {
    unitSlug: string;
    programmeSlug: string;
  }): Promise<PupilLessonListingQueryData> => {
    const { unitSlug, programmeSlug } = args;

    const matches = /^([a-z-]+?)-(primary|secondary)-year-\d{1,2}/.exec(
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

    const lessonSlugs = res.browseData.map(
      (lesson) => lesson.lesson_slug || "",
    );
    const contentRes = await sdk.pupilLessonListingLessonContent({
      lessonSlugs: lessonSlugs,
    });

    const lessonContentBySlug = contentRes.data.map((content) => {
      return {
        exit_quiz_count: content.exit_quiz?.length || 0,
        lesson_slug: content.lesson_slug,
      };
    });

    const contentByLessonSlug = Object.fromEntries(
      lessonContentBySlug.map((item) => [item.lesson_slug, item]),
    );

    const joinedBrowseDataWithContent = res.browseData.map((item) => ({
      ...item,
      ...(contentByLessonSlug[item?.lesson_slug || ""]
        ? contentByLessonSlug[item?.lesson_slug || ""]
        : {}),
    }));

    const modifiedBrowseData = applyGenericOverridesAndExceptions<
      PupilLessonListingQuery["browseData"][number]
    >({
      journey: "pupil",
      queryName: "pupilLessonListingQuery",
      browseData: joinedBrowseDataWithContent,
    });

    if (modifiedBrowseData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    lessonBrowseDataSchema.parse(modifiedBrowseData);

    const browseData = keysToCamelCase(
      modifiedBrowseData,
    ) as LessonListingBrowseData;

    const backLinkData = keysToCamelCase(
      res.backLinkData,
    ) as LessonListingBackLinkData;

    return { browseData: [...browseData], backLinkData };
  };
