import { Sdk } from "../../sdk";

import {
  LessonAssetsSchema,
  type LessonAssetsResult,
} from "./lessonAssets.schema";

//TODO: camelCase queries
const lessonAssetsQuery =
  (sdk: Sdk) =>
  async (args: { lessonSlug: string }): Promise<LessonAssetsResult> => {
    const { lessonSlug } = args;
    const res = await sdk.lessonAssets({ lessonSlug });
    const [lesson] = res.lessons;

    if (!lesson) {
      return null;
    }

    // Validate with safeParse and log errors
    const result = LessonAssetsSchema.safeParse(lesson);

    if (!result.success) {
      console.error(
        "Failed to parse lesson assets:",
        JSON.stringify(result.error.errors, null, 2),
      );
      throw new Error("Failed to parse lesson assets from curriculum API");
    }

    // Extract geo/login flags from features
    return {
      lesson: result.data,
      isGeoRestricted: result.data.features?.agf__geo_restricted ?? false,
      isLoginRequired: result.data.features?.agf__login_required ?? false,
    };
  };

export default lessonAssetsQuery;
