import {
  canonicalLessonShareSchema,
  lessonShareSchema,
  rawLessonShareSchema,
} from "./lessonShare.schema";
import { constructShareableResources } from "./constructShareableResources";

import OakError from "@/errors/OakError";
import { rawSyntheticUVLessonSchema } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/rawSyntheticUVLesson.schema";
import errorReporter from "@/common-lib/error-reporter";
import { LessonShareQuery as SdkLessonShareQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import { LessonPathway } from "@/node-lib/curriculum-api-2023/shared.schema";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import {
  constructLessonBrowseQuery,
  constructPathwayLesson,
} from "@/node-lib/curriculum-api-2023/helpers";

const lessonShareQuery =
  (sdk: Sdk) =>
  async <T>(args: {
    programmeSlug?: string;
    unitSlug?: string;
    lessonSlug: string;
  }): Promise<T> => {
    const { lessonSlug, unitSlug, programmeSlug } = args;

    const browseDataWhere = constructLessonBrowseQuery({
      unitSlug,
      programmeSlug,
      lessonSlug,
    });

    const res = await sdk.lessonShare({ lessonSlug, browseDataWhere });

    const rawLesson = res.share;

    const modifiedBrowseData = applyGenericOverridesAndExceptions<
      SdkLessonShareQuery["browse"][number]
    >({
      journey: "teacher",
      queryName: "lessonShareQuery",
      browseData: res.browse,
    });

    if (
      !rawLesson ||
      !modifiedBrowseData ||
      modifiedBrowseData.length === 0 ||
      rawLesson.length === 0
    ) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const canonicalLesson = !unitSlug && !programmeSlug;
    if (!canonicalLesson && rawLesson.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::lessonShare")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    const parsedRawLesson = rawLessonShareSchema.parse(rawLesson[0]);
    const parsedModifiedBrowseData = rawSyntheticUVLessonSchema.parse(
      modifiedBrowseData[0],
    );
    const shareableResources = constructShareableResources(parsedRawLesson);

    if (canonicalLesson) {
      const parsedBrowseData = modifiedBrowseData.map((bd) =>
        rawSyntheticUVLessonSchema.parse(bd),
      );
      const pathways = parsedBrowseData.reduce((acc, lesson) => {
        const pathwayLesson = constructPathwayLesson(lesson);
        acc.push(pathwayLesson);
        return acc;
      }, [] as LessonPathway[]);
      const lesson = canonicalLessonShareSchema.parse({
        shareableResources,
        isLegacy: parsedModifiedBrowseData.is_legacy,
        expired: parsedRawLesson.expired,
        pathways,
        isSpecialist: false,
        lessonSlug,
        lessonTitle: parsedRawLesson.lesson_title,
        lessonReleaseDate:
          parsedModifiedBrowseData.lesson_data.lesson_release_date,
      });
      return lesson as T;
    } else {
      const lesson = lessonShareSchema.parse({
        ...constructPathwayLesson(parsedModifiedBrowseData),
        isSpecialist: false,
        lessonSlug: lessonSlug,
        lessonTitle: parsedRawLesson.lesson_title,
        shareableResources,
        isLegacy: parsedModifiedBrowseData.is_legacy,
        expired: parsedRawLesson.expired,
        lessonReleaseDate:
          parsedModifiedBrowseData.lesson_data.lesson_release_date,
      });

      return lesson as T;
    }
  };

export type LessonShareQuery = ReturnType<typeof lessonShareQuery>;

export default lessonShareQuery;
