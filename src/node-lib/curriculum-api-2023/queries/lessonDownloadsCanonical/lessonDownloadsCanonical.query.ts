import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";
import { lessonPathwaySchema } from "../../shared.schema";

import lessonDownloadsCanonicalSchema, {
  LessonDownloadsCanonical,
} from "./lessonDownloadsCanonical.schema";

const lessonDownloadsCanonicalQuery =
  (sdk: Sdk) => async (args: { lessonSlug: string }) => {
    const res = await sdk.lessonDownloadsCanonical(args);

    const results = res.lessonDownloadsCanonical;

    if (!results.length) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    /**
     * When a lesson appears in multiple pathways, the query returns multiple
     * results. We need to merge these results into a single object, with the
     * pathways array containing all the pathways that the lesson appears in.
     */
    const lessonDownloadsWithPathways = results.reduce(
      (acc, lesson) => {
        const pathway = lessonPathwaySchema.parse(lesson);
        return {
          ...acc,
          pathways: [...acc.pathways, pathway],
        };
      },
      {
        ...res.lessonDownloadsCanonical[0],
        pathways: [],
        isLegacy: false,
      } as LessonDownloadsCanonical,
    );

    return lessonDownloadsCanonicalSchema.parse(lessonDownloadsWithPathways);
  };

export default lessonDownloadsCanonicalQuery;
