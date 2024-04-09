import { pupilLessonSchema } from "./pupilLesson.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

export const pupilLessonQuery =
  (sdk: Sdk) =>
  async (args: {
    lessonSlug: string;
    unitSlug?: string;
    programmeSlug?: string;
    isLegacy?: boolean;
  }) => {
    const { lessonSlug, unitSlug, programmeSlug, isLegacy = false } = args;

    const res = await sdk.pupilLesson({
      lessonSlug,
      unitSlug,
      programmeSlug,
      isLegacy,
    });
    const [browseData] = res.browseData;

    if (!browseData) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    // TODO: this needs adding to the mv
    // if (browseData.isSensitive) {
    //   throw new OakError({ code: "curriculum-api/not-found" });
    // }

    if (res.browseData.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::pupilLesson")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    return pupilLessonSchema.parse(browseData);
  };
