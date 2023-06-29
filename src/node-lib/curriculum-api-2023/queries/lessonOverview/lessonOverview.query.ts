import errorReporter from "../../../../common-lib/error-reporter";
import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import lessonOverviewSchema from "./lessonOverview.schema";

const lessonOverviewQuery =
  (sdk: Sdk) => async (args: { lessonSlug: string }) => {
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

    return lessonOverviewSchema.parse({
      ...lesson,
      coreContent: [],
      contentGuidance: null,
      equipmentRequired: null,
      presentationUrl: null,
      supervisionLevel: null,
      worksheetUrl: null,
      isWorksheetLandscape: false,
      hasCopyrightMaterial: false,
      videoMuxPlaybackId: null,
      videoWithSignLanguageMuxPlaybackId: null,
      transcriptSentences: null,
      hasDownloadableResources: null,
      introQuiz: [],
      exitQuiz: [],
      introQuizInfo: null,
      exitQuizInfo: null,
      expired: false,
    });
  };

export default lessonOverviewQuery;
