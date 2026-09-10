import {
  lessonShareSchema,
  rawLessonShareSchema,
  type LessonShareData,
} from "./lessonShare.schema";
import { constructShareableResources } from "./constructShareableResources";

import OakError from "@/errors/OakError";
import { rawSyntheticUVLessonSchema } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/rawSyntheticUVLesson.schema";
import errorReporter from "@/common-lib/error-reporter";
import { LessonShareQuery as SdkLessonShareQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import { constructPathwayLesson } from "@/node-lib/curriculum-api-2023/helpers";

export type LessonShareQueryArgs = {
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
};

const lessonShareQuery =
  (sdk: Sdk) =>
  async (args: LessonShareQueryArgs): Promise<LessonShareData> => {
    const { lessonSlug, unitSlug, programmeSlug } = args;

    const res = await sdk.lessonShare({
      lessonSlug,
      programmeSlug,
      unitSlug,
    });

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

    if (rawLesson.length > 1) {
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

    const lesson = lessonShareSchema.parse({
      ...constructPathwayLesson(parsedModifiedBrowseData),
      subjectParent:
        parsedModifiedBrowseData.programme_fields.subject_parent ?? null,
      phaseSlug: parsedModifiedBrowseData.programme_fields.phase_slug,
      phaseTitle: parsedModifiedBrowseData.programme_fields.phase_description,
      pathwaySlug:
        parsedModifiedBrowseData.programme_fields.pathway_slug ?? null,
      yearGroupTitle:
        parsedModifiedBrowseData.programme_fields.year_description,
      lessonSlug: lessonSlug,
      lessonTitle: parsedRawLesson.lesson_title,
      shareableResources,
      isLegacy: parsedModifiedBrowseData.is_legacy,
      expired: parsedRawLesson.expired,
      lessonReleaseDate:
        parsedModifiedBrowseData.lesson_data.lesson_release_date,
      georestricted:
        parsedModifiedBrowseData.features?.agf__geo_restricted ?? false,
      loginRequired:
        parsedModifiedBrowseData.features?.agf__login_required ?? false,
    });

    return lesson;
  };

export type LessonShareQuery = ReturnType<typeof lessonShareQuery>;

export default lessonShareQuery;
