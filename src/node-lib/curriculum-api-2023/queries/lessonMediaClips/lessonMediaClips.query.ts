import {
  canonicalLessonMediaClipsSchema,
  LessonBrowseData,
  lessonBrowseDataSchema,
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
  Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_13_0_0_Bool_Exp,
} from "@/node-lib/curriculum-api-2023/generated/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

export const lessonMediaClipsQuery =
  (sdk: Sdk) =>
  async <T>(args: {
    lessonSlug: string;
    unitSlug?: string;
    programmeSlug?: string;
    isLegacy?: boolean;
  }): Promise<T> => {
    const { lessonSlug, unitSlug, programmeSlug, isLegacy } = args;

    const browseDataWhere: InputMaybe<Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_13_0_0_Bool_Exp> =
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

    /**
     * TODO: Add media clip query name to curriculum schema
     */
    const modifiedBrowseData = applyGenericOverridesAndExceptions<
      LessonMediaClipsQuery["browseData"][number]
    >({
      journey: "teacher",
      queryName: "lessonOverviewQuery",
      browseData: res.browseData,
    });

    if (modifiedBrowseData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const [browseDataSnake] = modifiedBrowseData;

    /**
     * TODO: supplementary_data is not on current schema
     */
    lessonBrowseDataSchema.parse({
      ...browseDataSnake,
      supplementary_data: { order_in_unit: 0, unit_order: 0 },
    });

    // We've already parsed this data with Zod so we can safely cast it to the correct type
    const browseData = keysToCamelCase(browseDataSnake) as LessonBrowseData;
    const mediaClipsFixture = lessonMediaClipsFixtures().mediaClips;
    if (!canonicalLesson) {
      const data = constructLessonMediaData(browseData);
      lessonMediaClipsSchema.parse({ ...data, mediaClips: mediaClipsFixture });
      return {
        ...data,
        mediaClips: mediaClipsFixture,
      } as T;
    } else {
      const data = constructLessonMediaData(browseData, []);
      canonicalLessonMediaClipsSchema.parse({
        ...data,
        mediaClips: mediaClipsFixture,
      });
      //Pathways  is hard coded currently
      return {
        lessonSlug: data.lessonSlug,
        lessonTitle: data.lessonTitle,
        mediaClips: lessonMediaClipsFixtures().mediaClips,
        pathways: [
          {
            lessonSlug: data.lessonSlug,
            lessonTitle: data.lessonTitle,
            unitSlug: data.unitSlug,
            unitTitle: data.unitTitle,
            keyStageSlug: data.keyStageSlug,
            keyStageTitle: data.keyStageTitle,
            subjectSlug: data.subjectSlug,
            subjectTitle: data.subjectTitle,
            yearTitle: data.yearTitle,
            examBoardTitle: data.examBoardTitle,
            tierTitle: data.tierTitle,
            tierSlug: data.tierSlug,
          },
        ],
      } as T;
    }
  };

export type LessonMediaClipsQueryReturn = ReturnType<
  typeof lessonMediaClipsQuery
>;
