import {
  LessonContent,
  LessonBrowseData,
  lessonContentSchema,
  lessonBrowseDataSchema,
} from "./pupilLesson.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import {
  Actions,
  applyGenericOverridesAndExceptions,
} from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import {
  PupilLessonQuery,
  InputMaybe,
  Published_Mv_Synthetic_Unitvariant_Lessons_By_Year_12_0_0_Bool_Exp,
} from "@/node-lib/curriculum-api-2023/generated/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import { getIntersection } from "@/utils/getIntersection";

export const pupilLessonQuery =
  (sdk: Sdk) =>
  async (args: {
    lessonSlug: string;
    unitSlug?: string;
    programmeSlug?: string;
    isLegacy?: boolean;
  }): Promise<{
    content: LessonContent;
    browseData: LessonBrowseData;
  }> => {
    const { lessonSlug, unitSlug, programmeSlug, isLegacy } = args;

    const browseDataWhere: InputMaybe<Published_Mv_Synthetic_Unitvariant_Lessons_By_Year_12_0_0_Bool_Exp> =
      { lesson_slug: { _eq: lessonSlug } };

    if (unitSlug) {
      browseDataWhere["unit_slug"] = { _eq: unitSlug };
    }

    if (programmeSlug) {
      browseDataWhere["programme_slug"] = { _eq: programmeSlug };
    }

    if (isLegacy !== undefined) {
      browseDataWhere["is_legacy"] = { _eq: isLegacy };
    }

    const res = await sdk.pupilLesson({
      browseDataWhere,
      lessonSlug,
    });

    if (res.browseData.length > 1 && unitSlug && programmeSlug) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::pupilLesson")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    if (res.content.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::pupilLesson")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    if (res.browseData.length > 1 && !unitSlug && !programmeSlug) {
      // calculate the intersection of the actions
      const actionsIntersection = getIntersection<Actions>(
        res.browseData.map((bd) => bd.actions),
      );

      // replace actions with the intersection in all browseData meaning that only the common actions are applied
      // this is helpful with canonical urls
      res.browseData = res.browseData.map((bd) => ({
        ...bd,
        actions: actionsIntersection,
      }));

      const featuresIntersection = getIntersection<Record<string, unknown>>(
        res.browseData.map((bd) => bd.features),
      );

      // do the same for features
      res.browseData = res.browseData.map((bd) => ({
        ...bd,
        features: featuresIntersection,
      }));
    }

    const modifiedBrowseData = applyGenericOverridesAndExceptions<
      PupilLessonQuery["browseData"][number]
    >({
      journey: "pupil",
      queryName: "pupilLessonQuery",
      browseData: res.browseData,
    });

    if (modifiedBrowseData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const [browseDataSnake] = modifiedBrowseData;

    const [contentSnake] = res.content;

    if (!contentSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    lessonBrowseDataSchema.parse(browseDataSnake);
    lessonContentSchema.parse({
      ...contentSnake,
    });

    // We've already parsed this data with Zod so we can safely cast it to the correct type
    const browseData = keysToCamelCase(browseDataSnake) as LessonBrowseData;
    const content = keysToCamelCase(contentSnake) as LessonContent;

    return {
      browseData,
      content,
    };
  };
