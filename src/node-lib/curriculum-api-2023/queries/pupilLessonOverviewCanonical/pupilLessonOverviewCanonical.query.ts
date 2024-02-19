import { pupilLessonOverviewSchema } from "@/node-lib/curriculum-api-2023/queries/pupilLessonOverview/pupilLessonOverview.schema";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

export const pupilLessonOverviewCanonicalQuery =
  (sdk: Sdk) => async (args: { lessonSlug: string }) => {
    const res = await sdk.pupilLessonOverviewCanonical(args);
    const lessons = res.lesson;

    if (lessons.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    // currently we assume that all lessons returned by the mv are identical for the same lessonSlug
    // this may change in future
    return pupilLessonOverviewSchema.parse(lessons[0]);
  };
