import { syntheticUnitvariantLessonsFixture } from "@oaknational/oak-curriculum-schema";

import {
  getNextLessonsInUnit,
  constructLessonListingObjectArray,
  constructDownloadsArray,
} from "./downloadUtils";

import lessonListingFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonListing.fixture";

const lessons = lessonListingFixture().lessons;

describe("getNextLessonsInUnit()", () => {
  test("returns an empty array for an empty unit", async () => {
    expect(getNextLessonsInUnit([], "lesson-slug")).toEqual([]);
  });

  test("returns an empty array if the specified lesson is not in the unit", async () => {
    expect(getNextLessonsInUnit(lessons, "lesson-slug")).toEqual([]);
  });

  test("returns the next three lessons in the unit when the first lesson is found in a unit with more than three lessons", async () => {
    const nextLessons = getNextLessonsInUnit(lessons, "add-two-surds-6wwk0c");
    expect(nextLessons.length).toEqual(3);
    expect(nextLessons[0]?.lessonSlug).toEqual("subtract-two-surds-6njkac");
    expect(nextLessons[1]?.lessonSlug).toEqual(
      "subtract-two-surds-where-you-need-to-simplify-6gukce",
    );
    expect(nextLessons[2]?.lessonSlug).toEqual("subtract-three-surds");
  });

  test("returns the next two lessons when the lesson is the 3rd from the last in the unit", async () => {
    const nextLessons = getNextLessonsInUnit(
      lessons,
      "subtract-two-surds-where-you-need-to-simplify-6gukce",
    );
    expect(nextLessons.length).toEqual(2);
    expect(nextLessons[0]?.lessonSlug).toEqual("subtract-three-surds");
    expect(nextLessons[1]?.lessonSlug).toEqual("subtract-four-surds");
  });

  test("returns the next lesson when the lesson is the 2nd from the last in the unit", async () => {
    const nextLessons = getNextLessonsInUnit(lessons, "subtract-three-surds");
    expect(nextLessons.length).toEqual(1);
    expect(nextLessons[0]?.lessonSlug).toEqual("subtract-four-surds");
  });
  test("returns the next lesson when the lesson is the 1st and there are only 2 lessons in the unit", async () => {
    const nextLessons = getNextLessonsInUnit(
      lessons.splice(0, 2),
      "add-two-surds-6wwk0c",
    );
    expect(nextLessons.length).toEqual(1);
    expect(nextLessons[0]?.lessonSlug).toEqual("subtract-two-surds-6njkac");
  });
});

describe("constructLessonListingObjectArray()", () => {
  test("constructs lesson listing object ", () => {
    const constructedLesson = constructLessonListingObjectArray([
      syntheticUnitvariantLessonsFixture(),
    ]);
    expect(constructedLesson).toEqual([
      {
        lessonSlug: "lesson-slug",
        lessonTitle: "lesson-title",
        description: "lesson-description",
        pupilLessonOutcome: "pupil-lesson-outcome",
        expired: false,
        quizCount: 0,
        videoCount: 0,
        presentationCount: 0,
        worksheetCount: 0,
        hasCopyrightMaterial: false,
        orderInUnit: 1,
        lessonCohort: "2023-2024",
      },
    ]);
  });

  test("constructs lesson listing object with multiple lessons", () => {
    const constructedLesson = constructLessonListingObjectArray([
      syntheticUnitvariantLessonsFixture(),
      syntheticUnitvariantLessonsFixture({
        overrides: {
          lesson_slug: "lesson-slug-2",
          lesson_data: {
            lesson_id: 1,
            lesson_uid: "lesson-uid",
            title: "lesson-title-2",
            description: "lesson-description-2",
            slug: "lesson-slug",
            pupil_lesson_outcome: "pupil-lesson-outcome",
            key_learning_points: [{}],
            equipment_and_resources: null,
            content_guidance_details: null,
            content_guidance: null,
            supervision_level: null,
            thirdpartycontent_list: null,
            misconceptions_and_common_mistakes: null,
            keywords: null,
            video_id: null,
            sign_language_video_id: null,
            quiz_id_starter: null,
            quiz_id_exit: null,
            asset_id_slidedeck: null,
            asset_id_worksheet: null,
            copyright_content: null,
            _state: "published",
            _cohort: "2023-2024",
            updated_at: "2023-01-01T00:00:00.000Z",
            deprecated_fields: null,
          },
        },
      }),
    ]);
    expect(constructedLesson).toEqual([
      {
        lessonSlug: "lesson-slug",
        lessonTitle: "lesson-title",
        description: "lesson-description",
        pupilLessonOutcome: "pupil-lesson-outcome",
        expired: false,
        quizCount: 0,
        videoCount: 0,
        presentationCount: 0,
        worksheetCount: 0,
        hasCopyrightMaterial: false,
        orderInUnit: 1,
        lessonCohort: "2023-2024",
      },
      {
        lessonSlug: "lesson-slug-2",
        lessonTitle: "lesson-title-2",
        description: "lesson-description-2",
        pupilLessonOutcome: "pupil-lesson-outcome",
        expired: false,
        quizCount: 0,
        videoCount: 0,
        presentationCount: 0,
        worksheetCount: 0,
        hasCopyrightMaterial: false,
        orderInUnit: 1,
        lessonCohort: "2023-2024",
      },
    ]);
  });
});

describe("constructDownloadsArray()", () => {
  test("constructs correct downloadable resource", () => {
    const downloads = constructDownloadsArray({
      hasSlideDeckAssetObject: true,
      hasStarterQuiz: true,
      hasExitQuiz: true,
      hasWorksheetAssetObject: true,
      hasWorksheetAnswersAssetObject: true,
      hasWorksheetGoogleDriveDownloadableVersion: true,
      hasSupplementaryAssetObject: true,
      isLegacy: true,
    });
    expect(downloads).toEqual([
      {
        exists: true,
        type: "presentation",
        ext: "pptx",
        label: "Slide deck",
      },
      {
        exists: true,
        type: "intro-quiz-questions",
        label: "Starter quiz questions",
        ext: "pdf",
      },
      {
        exists: true,
        type: "intro-quiz-answers",
        label: "Starter quiz answers",
        ext: "pdf",
      },
      {
        exists: true,
        type: "exit-quiz-questions",
        label: "Exit quiz questions",
        ext: "pdf",
      },
      {
        exists: true,
        type: "exit-quiz-answers",
        label: "Exit quiz answers",
        ext: "pdf",
      },
      {
        exists: true,
        type: "worksheet-pdf",
        label: "Worksheet",
        ext: "pdf",
      },
      {
        exists: true,
        type: "worksheet-pptx",
        label: "Worksheet",
        ext: "pptx",
      },
      {
        exists: true,
        type: "supplementary-pdf",
        label: "Additional material",
        ext: "pdf",
      },
      {
        exists: true,
        type: "supplementary-docx",
        label: "Additional material",
        ext: "docx",
      },
    ]);
  });
  test("has correct number of resources available for download", () => {
    const downloads = constructDownloadsArray({
      hasSlideDeckAssetObject: true,
      hasStarterQuiz: true,
      hasExitQuiz: false,
      hasWorksheetAssetObject: true,
      hasWorksheetAnswersAssetObject: true,
      hasWorksheetGoogleDriveDownloadableVersion: true,
      hasSupplementaryAssetObject: false,
      isLegacy: true,
    });
    const filteredDownloads = downloads.filter(
      (download) => download.exists === true,
    );

    expect(filteredDownloads.length).toEqual(5);
  });
});
