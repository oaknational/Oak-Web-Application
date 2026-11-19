import { constructPathwayLesson } from "../../helpers";
import { applyGenericOverridesAndExceptions } from "../../helpers/overridesAndExceptions";
import { lessonBrowseDataByKsSchema } from "../canonicalLessonOverview/canonicalLessonOverview.schema";

import {
  canonicalLessonMediaSchema,
  CanonicalLessonMediaData,
} from "./canonicalLessonMedia.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const browseDataSchema = lessonBrowseDataByKsSchema.pick({
  lesson_slug: true,
  unit_slug: true,
  programme_slug: true,
  programme_fields: true,
  unit_data: true,
  lesson_data: true,
});

const canonicalLessonMediaQuery =
  (sdk: Sdk) =>
  async ({
    lessonSlug,
  }: {
    lessonSlug: string;
  }): Promise<CanonicalLessonMediaData> => {
    const res = await sdk.canonicalLessonMedia({ lessonSlug });
    const modifiedBrowseData = applyGenericOverridesAndExceptions({
      journey: "teacher",
      // Canonical media keeps the existing media exclusions and overrides.
      queryName: "lessonMediaClipsQuery",
      browseData: res.browseData,
    });
    const lessonsWithMedia = modifiedBrowseData
      .map((lesson) => browseDataSchema.parse(lesson))
      .filter((lesson) => lesson.lesson_data.media_clips);
    const firstLesson = lessonsWithMedia[0];

    if (!firstLesson) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    return canonicalLessonMediaSchema.parse({
      lessonTitle: firstLesson.lesson_data.title,
      subjectSlug: firstLesson.programme_fields.subject_slug,
      pathways: lessonsWithMedia.map(constructPathwayLesson),
    });
  };

export default canonicalLessonMediaQuery;
