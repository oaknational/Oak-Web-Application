import {
  LessonContent,
  LessonBrowseData,
  lessonContentSchema,
  AdditionalFiles,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";

export const pupilPreviewLessonQuery =
  (sdk: Sdk) =>
  async (args: {
    lessonSlug: string;
    unitSlug?: string;
    programmeSlug?: string;
    isLegacy?: boolean;
  }): Promise<{
    content: LessonContent;
    browseData: LessonBrowseData;
    additionalFiles: AdditionalFiles["tpcDownloadablefiles"];
  }> => {
    const { lessonSlug, unitSlug, programmeSlug, isLegacy } = args;

    const overrides: Partial<LessonBrowseData> = { lessonSlug };
    if (unitSlug) {
      overrides.unitSlug = unitSlug;
    }
    if (programmeSlug) {
      overrides.programmeSlug = programmeSlug;
    }
    if (isLegacy) {
      overrides.isLegacy = isLegacy;
    }

    const browseData = lessonBrowseDataFixture(overrides);

    const res = await sdk.pupilPreviewLesson({
      lessonSlug,
    });

    const [contentSnake] = res.content;

    if (!contentSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (res.content.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::pupilLesson")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    lessonContentSchema.parse(contentSnake);

    // We've already parsed this data with Zod so we can safely cast it to the correct type
    const content = keysToCamelCase(contentSnake) as LessonContent;

    return {
      browseData,
      content,
      additionalFiles: null,
    };
  };
