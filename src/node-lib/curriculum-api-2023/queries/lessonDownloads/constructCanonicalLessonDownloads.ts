import { LessonDownloadsCanonical } from "./lessonDownloadsCanonical.schema";
import {
  LessonDownloadsListSchema,
  LessonAdditionalFilesListSchema,
} from "./lessonDownloads.schema";
import { RawSyntheticUVLesson } from "./rawSyntheticUVLesson.schema";

import { lessonPathwaySchema } from "@/node-lib/curriculum-api-2023/shared.schema";
import { constructPathwayLesson } from "@/node-lib/curriculum-api-2023/helpers";
import keysToCamelCase from "@/utils/snakeCaseConverter";

const constructCanonicalLessonDownloads = ({
  downloads,
  additionalFiles,
  lessonSlug,
  browseData,
  isLegacy,
  lessonReleaseDate,
  lessonCopyRight,
  restrictions,
}: {
  downloads: LessonDownloadsListSchema;
  additionalFiles?: LessonAdditionalFilesListSchema;
  lessonSlug: string;
  browseData: RawSyntheticUVLesson[];
  isLegacy: boolean;
  lessonReleaseDate: string;
  lessonCopyRight?: { copyrightInfo: string }[] | null;
  restrictions: {
    geoRestricted: boolean | null;
    loginRequired: boolean | null;
  };
}): LessonDownloadsCanonical => {
  const baseDownloads = {
    downloads: downloads,
    additionalFiles: additionalFiles,
    isLegacy: isLegacy,
    lessonSlug: lessonSlug,
    lessonTitle: browseData[0]?.lesson_data.title,
    expired: null,
    isSpecialist: false,
    updatedAt: browseData[0]?.lesson_data.updated_at,
    geoRestricted: restrictions.geoRestricted,
    copyrightContent: lessonCopyRight,
    actions: keysToCamelCase(browseData[0]?.actions),
  };

  return browseData.reduce(
    (acc, lesson) => {
      const pathwayLesson = constructPathwayLesson(lesson);

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
      lessonReleaseDate,
      isSpecialist: false,
    } as LessonDownloadsCanonical,
  );
};

export default constructCanonicalLessonDownloads;
