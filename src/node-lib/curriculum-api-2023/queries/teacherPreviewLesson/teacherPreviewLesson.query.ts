import {
  lessonContentSchema as lessonContentSchemaFull,
  QuizQuestion,
} from "@oaknational/oak-curriculum-schema";

import { applyGenericOverridesAndExceptions } from "../../helpers/overridesAndExceptions";
import { TeachersPreviewLessonQuery } from "../../generated/sdk";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import { transformedLessonOverviewData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.query";
import lessonOverviewSchema, {
  LessonBrowseDataByKs,
  LessonOverviewContent,
  LessonOverviewPageData,
} from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

const teacherPreviewLessonQuery =
  (sdk: Sdk) =>
  async (args: { lessonSlug: string }): Promise<LessonOverviewPageData> => {
    const { lessonSlug } = args;

    const res = await sdk.teachersPreviewLesson({
      lessonSlug,
    });

    if (res.content.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::teacherPreviewLesson")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    const [content] = res.content;
    if (!content) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    const parsedLessonContent = lessonContentSchemaFull.parse({
      ...content,
      geo_restricted: true,
      login_required: true,
    });

    // Incomplete data will break the preview for new lessons
    const lessonContentData = keysToCamelCase({
      ...parsedLessonContent,
      exit_quiz: content.exit_quiz
        ? content.exit_quiz.filter((q: QuizQuestion) => q.question_stem)
        : null,
      starter_quiz: content.starter_quiz
        ? content.starter_quiz.filter((q: QuizQuestion) => q.question_stem)
        : null,
      additional_files: content?.additional_files,
    });

    const modifiedBrowseData = applyGenericOverridesAndExceptions<
      TeachersPreviewLessonQuery["browseData"][number]
    >({
      journey: "teacher",
      queryName: "teacherPreviewLessonQuery",
      browseData: res?.browseData,
    });

    if (modifiedBrowseData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const modBrowseData = keysToCamelCase(modifiedBrowseData[0]);

    const teacherPreviewData = transformedLessonOverviewData(
      modBrowseData as LessonBrowseDataByKs,
      lessonContentData as LessonOverviewContent,
      [],
    );

    const parsedLessonPreviewData = lessonOverviewSchema.parse({
      ...teacherPreviewData,
      lessonTitle: lessonContentData.lessonTitle,
      hasMediaClips: true,
    });

    return parsedLessonPreviewData;
  };

export default teacherPreviewLessonQuery;
