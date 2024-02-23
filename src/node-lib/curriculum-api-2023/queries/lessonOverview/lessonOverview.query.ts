import lessonOverviewSchema from "./lessonOverview.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const lessonOverviewQuery =
  (sdk: Sdk) =>
  async (args: {
    lessonSlug: string;
    unitSlug: string;
    programmeSlug: string;
  }) => {
    const res = await sdk.lessonOverview(args);
    const [lesson] = res.lesson;

    if (!lesson) {
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
    // let transformedTranscript = null;
    // if (
    //   lesson.transcriptSentences &&
    //   !Array.isArray(lesson.transcriptSentences)
    // ) {
    //   const splitTranscript = lesson.transcriptSentences.split(/\r?\n/);
    //   const formattedTranscript = formatSentences(splitTranscript);

    //   transformedTranscript = formattedTranscript;
    // }

    return lessonOverviewSchema.parse({
      ...lesson,
      isLegacy: false,
      hasCopyrightMaterial: false,
      expired: false,
    });
  };

export default lessonOverviewQuery;
