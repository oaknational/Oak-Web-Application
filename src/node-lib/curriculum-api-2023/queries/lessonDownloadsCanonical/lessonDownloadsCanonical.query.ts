import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";
import { pathwaySchema } from "../lessonOverviewCanonical/lessonOverviewCanonical.schema";

import lessonDownloadsCanonicalSchema, {
  LessonDownloadsCanonical,
} from "./lessonDownloadsCanonical.schema";

const lessonDownloadsCanonicalQuery =
  (sdk: Sdk) => async (args: { lessonSlug: string }) => {
    const res = await sdk.lessonDownloadsCanonical(args);

    if (!res.lessonDownloadsCanonical.length) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const lessonDownloadsWithPathways = res.lessonDownloadsCanonical.reduce(
      (acc, lesson) => {
        const pathway = pathwaySchema.parse(lesson);
        return {
          ...acc,
          pathways: [...acc.pathways, pathway],
        };
      },
      {
        ...res.lessonDownloadsCanonical[0],
        pathways: [],
      } as LessonDownloadsCanonical,
    );

    return lessonDownloadsCanonicalSchema.parse(lessonDownloadsWithPathways);
  };

export default lessonDownloadsCanonicalQuery;
