import {
  canonicalLessonMediaClipsSchema,
  lessonMediaClipsSchema,
} from "./lessonMediaClips.schema";
import { constructLessonMediaData } from "./constructLessonMediaClips";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import {
  LessonMediaClipsQuery,
  InputMaybe,
  Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_13_1_0_Bool_Exp,
} from "@/node-lib/curriculum-api-2023/generated/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import {
  LessonBrowseDataByKs,
  lessonBrowseDataByKsSchema,
} from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

export const lessonMediaClipsQuery =
  (sdk: Sdk) =>
  async <T>(args: {
    lessonSlug: string;
    unitSlug?: string;
    programmeSlug?: string;
  }): Promise<T> => {
    const { lessonSlug, unitSlug, programmeSlug } = args;

    const browseDataWhere: InputMaybe<Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_13_1_0_Bool_Exp> =
      { lesson_slug: { _eq: lessonSlug } };

    if (unitSlug) {
      browseDataWhere["unit_slug"] = { _eq: unitSlug };
    }

    if (programmeSlug) {
      browseDataWhere["programme_slug"] = { _eq: programmeSlug };
    }

    const res = await sdk.lessonMediaClips({
      browseDataWhere,
    });

    const canonicalLesson = !unitSlug && !programmeSlug;

    if (
      !canonicalLesson &&
      res.browseData.length > 1 &&
      unitSlug &&
      programmeSlug
    ) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::lessonMediaClips")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    const modifiedBrowseData = applyGenericOverridesAndExceptions<
      LessonMediaClipsQuery["browseData"][number]
    >({
      journey: "teacher",
      queryName: "lessonMediaClipsQuery",
      browseData: res.browseData,
    });

    if (modifiedBrowseData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const [browseDataSnake] = modifiedBrowseData;

    /**
     * TODO: supplementary_data is not on current schema
     */
    lessonBrowseDataByKsSchema.parse({
      ...browseDataSnake,
      supplementary_data: { order_in_unit: 0, unit_order: 0 },
    });

    // We've already parsed this data with Zod so we can safely cast it to the correct type
    const browseData = keysToCamelCase(browseDataSnake) as LessonBrowseDataByKs;
    if (!canonicalLesson) {
      const data = constructLessonMediaData({
        ...browseData,
      });
      lessonMediaClipsSchema.safeParse({ ...data });
      return {
        ...data,
      } as T;
    } else {
      const data = constructLessonMediaData(browseData, [
        {
          programmeSlug: browseData.programmeSlug,
          unitSlug: browseData.unitSlug,
          unitTitle: browseData.unitData.title,
          keyStageSlug: browseData.programmeFields.keystageSlug,
          keyStageTitle: browseData.programmeFields.keystageDescription,
          subjectSlug: browseData.programmeFields.subjectSlug,
          subjectTitle: browseData.programmeFields.subject,
        },
      ]);
      canonicalLessonMediaClipsSchema.safeParse({
        ...data,
      });
      return data as T;
    }
  };

export type LessonMediaClipsQueryReturn = ReturnType<
  typeof lessonMediaClipsQuery
>;
