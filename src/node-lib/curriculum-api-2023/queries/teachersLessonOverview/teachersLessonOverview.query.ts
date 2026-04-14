import { keysToCamelCase } from "zod-to-camel-case";

import { TeachersLessonOverviewQuery } from "../../generated/sdk";
import {
  lessonOverviewQuizData,
  LessonUnitDataByKs,
  lessonUnitDataByKsSchema,
} from "../../shared.schema";
import { toSentenceCase } from "../../helpers";
import { applyGenericOverridesAndExceptions } from "../../helpers/overridesAndExceptions";
import { getCorrectYear } from "../../helpers/getCorrectYear";
import { isExcludedFromTeachingMaterials } from "../../helpers/teachingMaterialsAi/isExcluded";

import {
  teachersLessonContentSchema,
  TeachersLessonOverviewAdjacentLesson,
  TeachersLessonOverviewContent,
  TeachersLessonOverviewDownloads,
  TeachersLessonOverviewPageData,
  TeachersLessonBrowseDataByKs,
  teachersLessonBrowseDataByKsSchema,
} from "./teachersLessonOverview.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { mediaClipsRecordCamelSchema } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { convertBytesToMegabytes } from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";

export type TeachersLessonUnitStaticLessonList = NonNullable<
  NonNullable<LessonUnitDataByKs["supplementaryData"]>["staticLessonList"]
>;

export function getAdjacentLessonsByOrderInUnit(
  rows: TeachersLessonUnitStaticLessonList,
  currentLessonSlug: string,
): {
  previousLesson: TeachersLessonOverviewAdjacentLesson | null;
  nextLesson: TeachersLessonOverviewAdjacentLesson | null;
} {
  const sortedRows = rows.toSorted(
    (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
  );
  const idx = sortedRows.findIndex((r) => r.slug === currentLessonSlug);

  if (idx === -1) {
    return { previousLesson: null, nextLesson: null };
  }

  const previousLesson = sortedRows[idx - 1] ?? null;
  const nextLesson = sortedRows[idx + 1] ?? null;

  return {
    previousLesson: previousLesson
      ? {
          lessonSlug: previousLesson.slug,
          lessonTitle: previousLesson.title,
          lessonIndex: idx,
        }
      : null,
    nextLesson: nextLesson
      ? {
          lessonSlug: nextLesson.slug,
          lessonTitle: nextLesson.title,
          lessonIndex: idx + 2,
        }
      : null,
  };
}

export const getDownloadsArray = (content: {
  hasSlideDeckAssetObject: boolean;
  hasStarterQuiz: boolean;
  hasExitQuiz: boolean;
  hasWorksheetAssetObject: boolean;
  hasWorksheetAnswersAssetObject: boolean;
  hasSupplementaryAssetObject: boolean;
  hasLessonGuideObject: boolean;
}): TeachersLessonOverviewPageData["downloads"] => {
  const downloads: TeachersLessonOverviewDownloads = [
    {
      exists: content.hasSlideDeckAssetObject,
      type: "presentation",
    },
    {
      exists: content.hasStarterQuiz,
      type: "intro-quiz-questions",
    },
    {
      exists: content.hasStarterQuiz,
      type: "intro-quiz-answers",
    },
    {
      exists: content.hasExitQuiz,
      type: "exit-quiz-questions",
    },
    {
      exists: content.hasExitQuiz,
      type: "exit-quiz-questions",
    },
    {
      exists:
        content.hasWorksheetAssetObject ||
        content.hasWorksheetAnswersAssetObject,
      type: "worksheet-pdf",
    },
    {
      exists:
        content.hasWorksheetAssetObject ||
        content.hasWorksheetAnswersAssetObject,
      type: "worksheet-pptx",
    },
    {
      exists: content.hasSupplementaryAssetObject,
      type: "supplementary-pdf",
    },
    {
      exists: content.hasSupplementaryAssetObject,
      type: "supplementary-docx",
    },
    {
      exists: content.hasLessonGuideObject,
      type: "lesson-guide-pdf",
    },
  ];

  return downloads;
};

export function getContentGuidance(
  content: TeachersLessonOverviewContent["contentGuidance"],
): TeachersLessonOverviewPageData["contentGuidance"] {
  if (content === null) {
    return null;
  }
  return content.map((item) => ({
    contentGuidanceLabel: item.contentguidanceLabel ?? "",
    contentGuidanceDescription: item.contentguidanceDescription ?? "",
    contentGuidanceArea: item.contentguidanceArea ?? "",
  }));
}

export const getAdditionalFiles = (
  additionalFiles: TeachersLessonOverviewContent["downloadableFiles"],
): string[] | null => {
  if (!additionalFiles) {
    return [];
  }

  return additionalFiles.map((af) => {
    const name = af.mediaObject.displayName;
    const type = af.mediaObject.url.split(".").pop() ?? "";
    const size = af.mediaObject.bytes;
    const sizeString = convertBytesToMegabytes(size);
    return `${name} ${sizeString} (${type.toUpperCase()})`;
  });
};

export const transformedTeachersLessonOverviewData = (
  browseData: TeachersLessonBrowseDataByKs,
  content: TeachersLessonOverviewContent,
  unitData: LessonUnitDataByKs,
  excludedFromTeachingMaterials: boolean,
  adjacentLessons?: {
    previousLesson: TeachersLessonOverviewAdjacentLesson | null;
    nextLesson: TeachersLessonOverviewAdjacentLesson | null;
  } | null,
): TeachersLessonOverviewPageData => {
  const reportError = errorReporter("transformedTeachersLessonOverviewData");
  const starterQuiz = lessonOverviewQuizData.parse(content.starterQuiz);
  const exitQuiz = lessonOverviewQuizData.parse(content.exitQuiz);
  const unitTitle =
    browseData.programmeFields.optionality ?? browseData.unitData.title;
  const additionalFiles = content?.downloadableFiles;
  const hasAdditionalFiles = additionalFiles
    ? additionalFiles.length > 0
    : false;

  let mediaClips = null;
  try {
    mediaClips = browseData.lessonData.mediaClips
      ? mediaClipsRecordCamelSchema.parse(browseData.lessonData.mediaClips)
      : null;
  } catch (error) {
    browseData.lessonData.mediaClips = null;
    reportError(error);
  }

  return {
    programmeSlug: browseData.programmeSlug,
    unitSlug: browseData.unitSlug,
    unitTitle,
    keyStageSlug: browseData.programmeFields.keystageSlug,
    keyStageTitle: toSentenceCase(
      browseData.programmeFields.keystageDescription,
    ),
    subjectSlug: browseData.programmeFields.subjectSlug,
    subjectTitle: browseData.programmeFields.subject,
    subjectParent: browseData.programmeFields.subjectParent ?? null,
    phaseSlug: browseData.programmeFields.phaseSlug,
    phaseTitle: browseData.programmeFields.phaseDescription,
    pathwaySlug: browseData.programmeFields.pathwaySlug,
    yearTitle: browseData.programmeFields.yearDescription,
    year: browseData.programmeFields.year,
    examBoardTitle: browseData.programmeFields.examboard,
    examBoardSlug: browseData.programmeFields.examboardSlug,
    downloads: getDownloadsArray({
      hasExitQuiz: content.exitQuiz && Boolean(content.exitQuiz.length > 1),
      hasStarterQuiz:
        content.starterQuiz && Boolean(content.starterQuiz.length > 1),
      hasSupplementaryAssetObject: Boolean(content.hasSupplementaryAssetObject),
      hasWorksheetAnswersAssetObject: Boolean(
        content.hasWorksheetAnswersAssetObject,
      ),
      hasWorksheetAssetObject: Boolean(content.hasWorksheetAssetObject),
      hasSlideDeckAssetObject: Boolean(content.hasSlideDeckAssetObject),
      hasLessonGuideObject: Boolean(content.hasLessonGuideObject),
    }),
    updatedAt: browseData.lessonData.updatedAt,
    lessonSlug: browseData.lessonSlug,
    lessonTitle: browseData.lessonData.title,
    tierTitle: browseData.programmeFields.tierDescription,
    tierSlug: browseData.programmeFields.tierSlug,
    contentGuidance: getContentGuidance(content.contentGuidance),
    misconceptionsAndCommonMistakes: content.misconceptionsAndCommonMistakes,
    teacherTips: content.teacherTips,
    lessonEquipmentAndResources: browseData.lessonData.equipmentAndResources,
    additionalMaterialUrl: content.supplementaryAssetObjectUrl,
    keyLearningPoints: content.keyLearningPoints ?? null,
    pupilLessonOutcome: content.pupilLessonOutcome,
    lessonKeywords: content.lessonKeywords,
    supervisionLevel: content.supervisionLevel,
    worksheetUrl: content.worksheetAssetObjectUrl,
    presentationUrl: content.slideDeckAssetObjectUrl,
    videoMuxPlaybackId: content.videoMuxPlaybackId,
    videoWithSignLanguageMuxPlaybackId:
      content.videoWithSignLanguageMuxPlaybackId,
    transcriptSentences: content.transcriptSentences,
    isWorksheetLandscape: Boolean(
      browseData.lessonData.deprecatedFields?.worksheetIsLandscape,
    ),
    expired: Boolean(browseData.lessonData.deprecatedFields?.expired) || false,
    starterQuiz: starterQuiz,
    exitQuiz: exitQuiz,
    videoTitle: content.videoTitle,
    lessonCohort: browseData.lessonData._cohort,
    lessonGuideUrl: content.lessonGuideAssetObjectUrl ?? null,
    phonicsOutcome: content.phonicsOutcome,
    actions: browseData.actions,
    hasMediaClips: mediaClips
      ? Object.keys(mediaClips).length > 0 &&
        Object.values(mediaClips).some((key) => key.length > 0)
      : false,
    lessonOutline: browseData.lessonData.lessonOutline ?? null,
    lessonMediaClips: mediaClips,
    additionalFiles:
      hasAdditionalFiles && additionalFiles
        ? getAdditionalFiles(additionalFiles)
        : null,
    pathwayTitle: browseData.programmeFields.pathwayDescription ?? null,
    lessonReleaseDate: content.lessonReleaseDate ?? null,
    orderInUnit: browseData.orderInUnit ?? 1,
    unitTotalLessonCount:
      unitData.supplementaryData?.staticLessonList?.length ??
      unitData.lessonCount,
    geoRestricted: browseData.features?.agfGeoRestricted ?? false,
    loginRequired: browseData.features?.agfLoginRequired ?? false,
    excludedFromTeachingMaterials,
    subjectCategories: browseData.unitData.subjectcategories,
    previousLesson: adjacentLessons?.previousLesson ?? null,
    nextLesson: adjacentLessons?.nextLesson ?? null,
  };
};

const teachersLessonOverviewQuery =
  (sdk: Sdk) =>
  async (args: {
    lessonSlug: string;
    unitSlug: string;
    programmeSlug: string;
  }): Promise<TeachersLessonOverviewPageData> => {
    const { lessonSlug, unitSlug, programmeSlug } = args;

    const res = await sdk.teachersLessonOverview({
      lessonSlug,
      unitSlug,
      programmeSlug,
    });

    const restrictedAndHighlyRestrictedWorksList =
      res.tpcWorks[0]?.works_list ?? [];

    const modifiedBrowseData = applyGenericOverridesAndExceptions<
      TeachersLessonOverviewQuery["browseData"][number]
    >({
      journey: "teacher",
      // Same CMS exclusions/opt-outs as lessonOverview; QueryNames is schema-driven from oak-curriculum-schema.
      // TD: add query name to the schema
      queryName: "lessonOverviewQuery",
      browseData: res.browseData,
    });

    if (modifiedBrowseData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const modifiedProgrammeFields = getCorrectYear({
      programmeSlugByYear: modifiedBrowseData[0]?.programme_slug_by_year,
      programmeFields: modifiedBrowseData[0]?.programme_fields,
    });

    const browseDataSnake = {
      ...modifiedBrowseData[0],
      programme_fields: modifiedProgrammeFields,
    };
    const [contentSnake] = res.content;

    if (!contentSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (res.content.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023:teachersLessonOverview")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    const [unitDataSnake] = res.unitData;

    if (!unitDataSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    teachersLessonBrowseDataByKsSchema.parse(browseDataSnake);
    teachersLessonContentSchema.parse({
      ...contentSnake,
      additional_files: null,
    });
    lessonUnitDataByKsSchema.parse(unitDataSnake);

    const browseData = keysToCamelCase(
      browseDataSnake,
    ) as TeachersLessonBrowseDataByKs;
    const content = keysToCamelCase({
      ...contentSnake,
    }) as TeachersLessonOverviewContent;
    const unitData = keysToCamelCase(unitDataSnake) as LessonUnitDataByKs;

    const excludedFromTeachingMaterials = isExcludedFromTeachingMaterials(
      browseData.lessonData,
      restrictedAndHighlyRestrictedWorksList,
      content,
    );

    const staticLessonList = unitData.supplementaryData?.staticLessonList;
    const adjacentLessons = staticLessonList?.length
      ? getAdjacentLessonsByOrderInUnit(staticLessonList, lessonSlug)
      : null;

    return transformedTeachersLessonOverviewData(
      browseData,
      content,
      unitData,
      excludedFromTeachingMaterials,
      adjacentLessons,
    );
  };

export default teachersLessonOverviewQuery;
