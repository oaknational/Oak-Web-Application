import { MediaClipListCamelCase } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { constructLessonMediaData } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/constructLessonMediaClips";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import { BetaLessonMediaClipsQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import {
  LessonBrowseDataByKs,
  lessonBrowseDataByKsSchema,
} from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

export const betaLessonMediaClipsQuery =
  (sdk: Sdk) =>
  async <T>(args: { lessonSlug: string }): Promise<T> => {
    const { lessonSlug } = args;

    const res = await sdk.betaLessonMediaClips({
      lessonSlug,
    });

    if (res.browseData.length > 1) {
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

    const lessonData = {
      ...browseDataSnake?.lesson_data,
      key_learning_points: [],
      lesson_release_date:
        browseDataSnake?.lesson_data?.lesson_release_date ?? null,
    };

    const manipulatedData = {
      ...browseDataSnake,
      lesson_data: lessonData,
    };
    lessonBrowseDataByKsSchema.parse({
      ...manipulatedData,
      supplementary_data: { order_in_unit: 0, unit_order: 0 },
    });

    const browseData = keysToCamelCase(
      manipulatedData,
    ) as LessonBrowseDataByKs & {
      mediaClips: MediaClipListCamelCase;
    };

    const data = constructLessonMediaData(browseData, [
      {
        programmeSlug: browseData.programmeSlug,
        unitSlug: browseData.unitSlug,
        unitTitle: browseData.unitData.title,
        keyStageSlug: browseData.programmeFields.keystageSlug,
        keyStageTitle: browseData.programmeFields.keystageDescription,
        subjectSlug: browseData.programmeFields.subjectSlug,
        subjectTitle: browseData.programmeFields.subject,
        yearGroupSlug: browseData.programmeFields.yearSlug,
        yearGroupTitle: browseData.programmeFields.yearDescription,
      },
    ]);
    return data as T;
  };

export type LessonMediaClipsQueryReturn = ReturnType<
  typeof betaLessonMediaClipsQuery
>;
