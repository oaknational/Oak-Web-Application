import {
  ProgrammeFields,
  StaticLesson,
} from "@oaknational/oak-curriculum-schema";

import {
  lessonListingPageDataSchema,
  LessonListingPageData,
  partialSyntheticUnitvariantLessonsArraySchema,
  partialSyntheticUnitvariantLessonsSchema,
} from "./lessonListing.schema";

import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import OakError from "@/errors/OakError";
import {
  LessonListSchema,
  Actions,
  LessonListItem,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { LessonListingQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import { constructDownloadsArray } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/downloadUtils";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import { getCorrectYear } from "@/node-lib/curriculum-api-2023/helpers/getCorrectYear";
import { getIntersection } from "@/utils/getIntersection";
import keysToCamelCase from "@/utils/snakeCaseConverter";

async function getDownloadableResourceCount(
  lesson: LessonListingQuery["lessons"][number]["static_lesson_list"],
): Promise<{
  quizCount: number;
  presentationCount: number;
  worksheetCount: number;
}> {
  const downloadsArray = await constructDownloadsArray({
    hasSlideDeckAssetObject: Boolean(lesson.lesson_data.asset_id_slidedeck),
    hasStarterQuiz: Boolean(lesson.lesson_data.quiz_id_starter),
    hasExitQuiz: Boolean(lesson.lesson_data.quiz_id_exit),
    hasWorksheetAssetObject: Boolean(lesson.lesson_data.asset_id_worksheet),
    lessonSlug: lesson.lesson_slug,
    isLegacy: lesson.is_legacy,
    // We don't need to check these assets as they aren't previewed in the lesson listing page
    hasWorksheetGoogleDriveDownloadableVersion: false,
    hasWorksheetAnswersAssetObject: false,
    hasSupplementaryAssetObject: false,
    hasLessonGuideObject: false,
    context: "lessonListingQuery",
  });

  const downloadsSet = new Set(
    downloadsArray.filter((d) => d.inGcsBucket !== false).map((d) => d.type),
  );
  const hasIntroQuiz =
    downloadsSet.has("intro-quiz-questions") &&
    downloadsSet.has("intro-quiz-answers");
  const hasExitQuiz =
    downloadsSet.has("exit-quiz-questions") &&
    downloadsSet.has("exit-quiz-answers");
  return {
    quizCount: +hasIntroQuiz + +hasExitQuiz,
    worksheetCount: +(
      downloadsSet.has("worksheet-pdf") || downloadsSet.has("worksheet-pptx")
    ),
    presentationCount: +downloadsSet.has("presentation"),
  };
}

export const getTransformedLessons = async (
  lessons: LessonListingQuery["lessons"],
): Promise<LessonListSchema> => {
  const lessonPromises = lessons[0]?.static_lesson_list
    ?.sort((a: StaticLesson, b: StaticLesson) => a.order - b.order)
    .map(async (staticLesson: StaticLesson) => {
      const publishedLesson = lessons.find(
        (lesson) => lesson.lesson_slug === staticLesson.slug,
      );

      if (publishedLesson) {
        const lesson =
          partialSyntheticUnitvariantLessonsSchema.parse(publishedLesson);
        const hasLegacyCopyrightMaterial =
          publishedLesson.lesson_data.copyright_content?.find(
            (c: { copyright_info: string }) =>
              c.copyright_info === "This lesson contains copyright material.",
          ) !== undefined;
        const { quizCount, worksheetCount, presentationCount } =
          await getDownloadableResourceCount(lesson);

        const transformedLesson = {
          lessonSlug: lesson.lesson_slug,
          lessonTitle: lesson.lesson_data.title,
          quizCount,
          worksheetCount,
          presentationCount,
          description:
            lesson.lesson_data.description ||
            lesson.lesson_data.pupil_lesson_outcome,
          pupilLessonOutcome: lesson.lesson_data.pupil_lesson_outcome,
          expired: Boolean(lesson.lesson_data.deprecated_fields?.expired),
          videoCount: lesson.lesson_data.video_id ? 1 : 0,
          hasLegacyCopyrightMaterial,
          orderInUnit: lesson.order_in_unit,
          lessonCohort: lesson.lesson_data._cohort,
          actions: (keysToCamelCase(lesson.actions) || null) as Actions,
          isUnpublished: false,
          lessonReleaseDate: lesson.lesson_data.lesson_release_date,
          geoRestricted: lesson.features?.agf__geo_restricted ?? false,
          loginRequired: lesson.features?.agf__login_required ?? false,
        };
        return transformedLesson;
      } else {
        return {
          lessonSlug: staticLesson.slug,
          lessonTitle: staticLesson.title,
          orderInUnit: staticLesson.order,
          isUnpublished: true,
          lessonReleaseDate: null,
          expired: lessons[0]?.is_legacy ?? false,
        };
      }
    });

  return Promise.all(lessonPromises ?? []);
};

type PackagedUnitData = {
  programmeFields: ProgrammeFields;
  unitSlug: string;
  unitvariantId: number;
  programmeSlug: string;
  unitTitle: string;
  programmeSlugByYear: string[];
};

export const getPackagedUnit = (
  packagedUnitData: PackagedUnitData,
  unitLessons: LessonListSchema,
  containsGeorestrictedLessons: boolean,
  containsLoginRequiredLessons: boolean,
): LessonListingPageData => {
  const {
    programmeFields,
    unitSlug,
    unitvariantId,
    unitTitle,
    programmeSlug,
    programmeSlugByYear,
  } = packagedUnitData;

  const modifiedProgrammeFields = getCorrectYear({
    programmeSlugByYear,
    programmeFields,
  });

  const combinedActions = getIntersection<LessonListItem["actions"]>(
    unitLessons
      .filter((lesson) => !lesson.isUnpublished)
      .map((lesson) => lesson.actions),
  ) as Actions;

  return {
    programmeSlug,
    keyStageSlug: modifiedProgrammeFields.keystage_slug,
    keyStageTitle: modifiedProgrammeFields.keystage_description,
    subjectSlug: modifiedProgrammeFields.subject_slug,
    subjectTitle: modifiedProgrammeFields.subject,
    parentSubject: modifiedProgrammeFields.subject_parent ?? null,
    unitSlug,
    unitvariantId,
    unitTitle,
    tierSlug: modifiedProgrammeFields.tier_slug,
    tierTitle: modifiedProgrammeFields.tier_description,
    examBoardSlug: modifiedProgrammeFields.examboard_slug,
    examBoardTitle: modifiedProgrammeFields.examboard,
    yearSlug: modifiedProgrammeFields.year_slug,
    yearTitle: modifiedProgrammeFields.year_description,
    year: modifiedProgrammeFields.year,
    lessons: unitLessons,
    pathwaySlug: modifiedProgrammeFields.pathway_slug,
    pathwayTitle: modifiedProgrammeFields.pathway,
    pathwayDisplayOrder: modifiedProgrammeFields.pathway_display_order,
    actions: combinedActions,
    containsGeorestrictedLessons,
    containsLoginRequiredLessons,
  };
};

const lessonListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string; unitSlug: string }) => {
    const res = await sdk.lessonListing(args);

    const modifiedLessons = applyGenericOverridesAndExceptions<
      LessonListingQuery["lessons"][number]
    >({
      journey: "teacher",
      queryName: "lessonListingQuery",
      browseData: res.lessons,
    });
    if (modifiedLessons.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const containsGeorestrictedLessons = modifiedLessons.some(
      (lesson) => lesson.features?.agf__geo_restricted === true,
    );
    const containsLoginRequiredLessons = modifiedLessons.some(
      (lesson) => lesson.features?.agf__login_required === true,
    );

    const parsedModifiedLessons =
      partialSyntheticUnitvariantLessonsArraySchema.parse(modifiedLessons);

    const unitLessons = await getTransformedLessons(parsedModifiedLessons);
    const packagedUnitData = modifiedLessons.reduce((acc, lesson) => {
      return {
        ...acc,
        programmeFields: lesson.programme_fields,
        unitSlug: lesson.unit_slug ?? "",
        unitvariantId: lesson.unitvariant_id ?? 0,
        programmeSlug: lesson.programme_slug ?? "",
        unitTitle:
          lesson.programme_fields.optionality ?? lesson.unit_data.title,
        programmeSlugByYear: lesson.programme_slug_by_year,
      };
    }, {} as PackagedUnitData);

    const packagedUnit = getPackagedUnit(
      packagedUnitData,
      unitLessons,
      containsGeorestrictedLessons,
      containsLoginRequiredLessons,
    );

    return lessonListingPageDataSchema.parse(packagedUnit);
  };

export default lessonListingQuery;
