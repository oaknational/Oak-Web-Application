import { pupilLessonOverviewSchema } from "./pupilLessonOverview.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

export const pupilLessonOverviewQuery =
  (sdk: Sdk) =>
  async (args: {
    lessonSlug: string;
    unitSlug: string;
    programmeSlug: string;
  }) => {
    const res = await sdk.pupilLessonOverview(args);
    const [lesson] = res.lesson;

    if (!lesson) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (lesson.isSensitive === true) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (res.lesson.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::lessonOverview")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    return pupilLessonOverviewSchema.parse(lesson);
  };
