import { LessonOverviewQuery } from "../../generated/sdk";
import { constructPathwayLesson } from "../../helpers";
import { applyGenericOverridesAndExceptions } from "../../helpers/overridesAndExceptions";

import {
  canonicalLessonHubSchema,
  CanonicalLessonHubData,
  lessonBrowseDataByKsSchema,
} from "./canonicalLessonOverview.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const getPathways = (
  res: LessonOverviewQuery,
): CanonicalLessonHubData["pathways"] => {
  const pathwayBrowseDataSchema = lessonBrowseDataByKsSchema.pick({
    lesson_slug: true,
    unit_slug: true,
    programme_slug: true,
    programme_fields: true,
    unit_data: true,
    lesson_data: true,
  });

  return res.browseData.map((lesson) => {
    const pathway = constructPathwayLesson(
      pathwayBrowseDataSchema.parse(lesson),
    );
    return {
      programmeSlug: pathway.programmeSlug,
      unitSlug: pathway.unitSlug,
      unitTitle: pathway.unitTitle,
      subjectTitle: pathway.subjectTitle,
      examBoardTitle: pathway.examBoardTitle,
      tierTitle: pathway.tierTitle,
      yearGroupTitle: pathway.yearGroupTitle,
      pathwayTitle: pathway.pathwayTitle,
    };
  });
};

const canonicalLessonOverviewQuery =
  (sdk: Sdk) =>
  async (args: { lessonSlug: string }): Promise<CanonicalLessonHubData> => {
    const { lessonSlug } = args;
    const res = await sdk.lessonOverview({
      lessonSlug,
    });

    const modifiedBrowseData = applyGenericOverridesAndExceptions<
      LessonOverviewQuery["browseData"][number]
    >({
      journey: "teacher",
      queryName: "lessonOverviewQuery",
      browseData: res.browseData,
    });

    if (modifiedBrowseData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const pathways = getPathways(res);
    const firstBrowseData = lessonBrowseDataByKsSchema
      .pick({
        lesson_slug: true,
        unit_slug: true,
        programme_slug: true,
        programme_fields: true,
        unit_data: true,
        lesson_data: true,
      })
      .parse(modifiedBrowseData[0]);

    return canonicalLessonHubSchema.parse({
      lessonTitle: firstBrowseData.lesson_data.title,
      subjectSlug: firstBrowseData.programme_fields.subject_slug,
      pathways,
    });
  };

export default canonicalLessonOverviewQuery;
