import { pupilLessonOverviewSchema } from "./pupilLessonOverview.schema";

import errorReporter from "@/common-lib/error-reporter";
import { LEGACY_COHORT } from "@/config/cohort";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { getCaptionsFromFile } from "@/utils/handleTranscript";

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

    const isLegacyLicense =
      !lesson.lessonCohort || lesson.lessonCohort === LEGACY_COHORT;
    let transcriptSentences: string | string[] =
      lesson.transcriptSentences ?? [];

    if (lesson.videoTitle && !isLegacyLicense) {
      // For new content we need to fetch the captions file from gCloud and parse the result to generate
      // the transcript sentences.
      const fileName = `${lesson.videoTitle}.vtt`;

      transcriptSentences = (await getCaptionsFromFile(fileName)) ?? [];
    }

    return pupilLessonOverviewSchema.parse({
      ...lesson,
      transcriptSentences,
      isLegacyLicense,
    });
  };
