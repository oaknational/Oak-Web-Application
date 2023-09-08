import lessonOverviewCanonicalSchema, {
  LessonOverviewCanonical,
  pathwaySchema,
} from "./lessonOverviewCanonical.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const lessonOverviewCanonicalQuery =
  (sdk: Sdk) => async (args: { lessonSlug: string }) => {
    const res = await sdk.lessonOverviewCanonical(args);
    const lessons = res.lesson;
    if (lessons.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const lessonWithPathways = lessons.reduce(
      (acc, lesson) => {
        const pathway = pathwaySchema.parse(lesson);
        return {
          ...acc,
          pathways: [...acc.pathways, pathway],
        };
      },
      {
        ...lessons[0],
        pathways: [],
      } as LessonOverviewCanonical,
    );

    return lessonOverviewCanonicalSchema.parse(lessonWithPathways);
  };

export default lessonOverviewCanonicalQuery;
