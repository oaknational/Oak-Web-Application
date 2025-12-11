import { generateLessonOverviewFromRaw } from "../specialistLessonOverview/specialistLessonOverview.query";

import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import errorReporter from "@/common-lib/error-reporter";

const specialistLessonOverviewCanonical =
  (sdk: Sdk) => async (args: { lessonSlug: string }) => {
    const { lessonSlug } = args;
    const specialistLessonOverview =
      await sdk.specialistLessonOverviewCanonical({
        lessonSlug,
      });

    return generateLessonOverviewFromRaw(
      specialistLessonOverview.lesson,
      1,
      (lessonOverview, error) => {
        errorReporter("curriculum-api-2023::specialistLessonOverview")(error, {
          severity: "warning",
          ...args,
          lessonOverview,
        });
      },
    );
  };

export default specialistLessonOverviewCanonical;
