import { pupilLessonSchema } from "./pupilLesson.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import {
  InputMaybe,
  Published_Mv_Synthetic_Unitvariant_Lessons_By_Year_6_0_0_Bool_Exp,
} from "@/node-lib/curriculum-api-2023/generated/sdk";

export const pupilLessonQuery =
  (sdk: Sdk) =>
  async (args: {
    lessonSlug: string;
    unitSlug?: string;
    programmeSlug?: string;
    isLegacy?: boolean;
  }) => {
    const { lessonSlug, unitSlug, programmeSlug, isLegacy } = args;

    const query: InputMaybe<Published_Mv_Synthetic_Unitvariant_Lessons_By_Year_6_0_0_Bool_Exp> =
      { lesson_slug: { _eq: lessonSlug } };

    if (unitSlug) {
      query["unit_slug"] = { _eq: unitSlug };
    }

    if (programmeSlug) {
      query["programme_slug"] = { _eq: programmeSlug };
    }

    if (isLegacy !== undefined) {
      query["is_legacy"] = { _eq: isLegacy };
    }

    const res = await sdk.pupilLesson({
      where: query,
    });

    const [browseData] = res.browseData;

    if (!browseData) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (browseData.unit_data.deprecated_fields.is_sensitive) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (res.browseData.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::pupilLesson")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    return pupilLessonSchema.parse(browseData);
  };
