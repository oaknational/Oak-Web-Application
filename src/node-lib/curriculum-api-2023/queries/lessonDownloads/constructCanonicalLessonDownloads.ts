import { LessonDownloadsCanonical } from "./lessonDownloadsCanonical.schema";
import { LessonDownloadsListSchema } from "./lessonDownloads.schema";
import { RawSyntheticUVLesson } from "./rawSyntheticUVLesson.schema";

import { lessonPathwaySchema } from "@/node-lib/curriculum-api-2023/shared.schema";
import { toSentenceCase } from "@/node-lib/curriculum-api-2023/helpers";

const constructCanonicalLessonDownloads = (
  downloads: LessonDownloadsListSchema,
  lessonSlug: string,
  browseData: RawSyntheticUVLesson[],
  isLegacy: boolean,
  lessonCopyRight: { copyrightInfo: string }[] | null,
  restrictions: {
    geoRestricted: boolean | null;
    loginRequired: boolean | null;
  },
): LessonDownloadsCanonical => {
  const baseDownloads = {
    downloads: downloads,
    isLegacy: isLegacy,
    lessonSlug: lessonSlug,
    lessonTitle: browseData[0]?.lesson_data.title,
    expired: null,
    isSpecialist: false,
    updatedAt: browseData[0]?.lesson_data.updated_at,
    copyrightContent: lessonCopyRight,
  };

  return browseData.reduce(
    (acc, lesson) => {
      const unitTitle =
        lesson.programme_fields.optionality ?? lesson.unit_data.title;
      const pathwayLesson = {
        programmeSlug: lesson.programme_slug,
        unitSlug: lesson.unit_data.slug,
        unitTitle,
        keyStageSlug: lesson.programme_fields.keystage_slug,
        keyStageTitle: toSentenceCase(
          lesson.programme_fields.keystage_description,
        ),
        subjectSlug: lesson.programme_fields.subject_slug,
        subjectTitle: lesson.programme_fields.subject,
        lessonCohort: lesson.lesson_data._cohort,
        examBoardSlug: lesson.programme_fields.examboard_slug,
        examBoardTitle: lesson.programme_fields.examboard,
        lessonSlug: lesson.lesson_slug,
        lessonTitle: lesson.lesson_data.title,
        tierSlug: lesson.programme_fields.tier_slug,
        tierTitle: lesson.programme_fields.tier_description,
      };

      const pathway = lessonPathwaySchema.parse(pathwayLesson);
      return {
        ...acc,
        pathways: [...acc.pathways, pathway],
      };
    },
    {
      ...baseDownloads,
      ...restrictions,
      pathways: [],
      isLegacy: false,
      isSpecialist: false,
    } as LessonDownloadsCanonical,
  );
};

export default constructCanonicalLessonDownloads;
