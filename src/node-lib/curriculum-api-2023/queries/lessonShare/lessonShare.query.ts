import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";
import { constructPathwayLesson } from "../../helpers";
import {
  InputMaybe,
  Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_10_0_0_Bool_Exp,
} from "../../generated/sdk";
import { rawSyntheticUVLessonSchema } from "../lessonDownloads/rawSyntheticUVLesson.schema";
import { LessonPathway } from "../../shared.schema";

import {
  canonicalLessonShareSchema,
  lessonShareSchema,
  rawLessonShareSchema,
} from "./lessonShare.schema";
import { constructShareableResources } from "./constructShareableResources";

import errorReporter from "@/common-lib/error-reporter";

const lessonShareQuery =
  (sdk: Sdk) =>
  async <T>(args: {
    programmeSlug?: string;
    unitSlug?: string;
    lessonSlug: string;
  }): Promise<T> => {
    const { lessonSlug, unitSlug, programmeSlug } = args;
    const browseDataWhere: InputMaybe<Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_10_0_0_Bool_Exp> =
      {};

    const canonicalLesson = !unitSlug && !programmeSlug;

    if (canonicalLesson) {
      browseDataWhere["lesson_slug"] = { _eq: lessonSlug };
    }

    if (unitSlug) {
      browseDataWhere["unit_slug"] = { _eq: unitSlug };
    }

    if (programmeSlug) {
      browseDataWhere["programme_slug"] = { _eq: programmeSlug };
    }

    const res = await sdk.lessonShare({ lessonSlug, browseDataWhere });

    const rawLesson = res.share;
    const rawBrowseData = res.browse;

    if (!rawLesson || rawLesson.length === 0 || !rawBrowseData) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (rawLesson.length > 1 || rawBrowseData.length > 1) {
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
    const parsedRawBrowseData = rawSyntheticUVLessonSchema.parse(
      rawBrowseData[0],
    );
    const shareableResources = constructShareableResources(parsedRawLesson);

    if (canonicalLesson) {
      const parsedBrowseData = rawBrowseData.map((bd) =>
        rawSyntheticUVLessonSchema.parse(bd),
      );
      const pathways = parsedBrowseData.reduce((acc, lesson) => {
        const pathwayLesson = constructPathwayLesson(lesson);
        acc.push(pathwayLesson);
        return acc;
      }, [] as LessonPathway[]);

      const lesson = canonicalLessonShareSchema.parse({
        shareableResources,
        isLegacy: parsedRawBrowseData.is_legacy,
        expired: parsedRawLesson.expired,
        pathways,
        isSpecialist: false,
        lessonSlug,
        lessonTitle: parsedRawLesson.lesson_title,
      });
      return lesson as T;
    } else {
      const lesson = lessonShareSchema.parse({
        ...constructPathwayLesson(parsedRawBrowseData),
        isSpecialist: false,
        lessonSlug: lessonSlug,
        lessonTitle: parsedRawLesson.lesson_title,
        shareableResources,
        isLegacy: parsedRawBrowseData.is_legacy,
        expired: parsedRawLesson.expired,
      });

      return lesson as T;
    }
  };

export default lessonShareQuery;
