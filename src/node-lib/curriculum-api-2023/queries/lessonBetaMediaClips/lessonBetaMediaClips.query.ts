import {
  LessonBrowseData,
  lessonBrowseDataSchema,
} from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { constructLessonMediaData } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/constructLessonMediaClips";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import { BetaLessonMediaClipsQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

export const betaLessonMediaClipsQuery =
  (sdk: Sdk) =>
  async <T>(args: {
    lessonSlug: string;
    unitSlug?: string;
    programmeSlug?: string;
    isLegacy?: boolean;
  }): Promise<T> => {
    const { lessonSlug, unitSlug, programmeSlug } = args;

    const res = await sdk.betaLessonMediaClips({
      lessonSlug,
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
      BetaLessonMediaClipsQuery["browseData"][number]
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
    lessonBrowseDataSchema.parse({
      ...browseDataSnake,
      supplementary_data: { order_in_unit: 0, unit_order: 0 },
    });

    const browseData = keysToCamelCase(browseDataSnake) as LessonBrowseData;

    const data = constructLessonMediaData(browseData, []);

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
  };

export type LessonMediaClipsQueryReturn = ReturnType<
  typeof betaLessonMediaClipsQuery
>;
