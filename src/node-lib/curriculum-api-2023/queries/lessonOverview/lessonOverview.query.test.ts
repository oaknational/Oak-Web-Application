import {
  lessonContentFixture,
  syntheticUnitvariantLessonsByKsFixture,
} from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";
import { lessonPathwaySchema } from "../../shared.schema";

import lessonOverview, {
  getContentGuidance,
  getCopyrightContent,
  getDownloadsArray,
} from "./lessonOverview.query";

describe("lessonOverview()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await lessonOverview({
        ...sdk,
        lessonOverview: jest.fn(() =>
          Promise.resolve({ content: [], browseData: [] }),
        ),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("it returns the lesson if found", async () => {
    const _syntheticUnitvariantLessonsByKsFixture =
      syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          lesson_slug: "lesson-slug-test",
          unit_slug: "unit-slug-test",
          programme_slug: "programme-slug-test",
          is_legacy: false,
          programme_slug_by_year: ["programme-slug-test"],
        },
      });

    const _lessonContentFixture = lessonContentFixture({
      overrides: {
        exit_quiz: [],
        starter_quiz: [],
      },
    });

    const lesson = await lessonOverview({
      ...sdk,
      lessonOverview: jest.fn(() =>
        Promise.resolve({
          browseData: [_syntheticUnitvariantLessonsByKsFixture],
          content: [_lessonContentFixture],
        }),
      ),
    })({
      lessonSlug: "test",
    });

    expect(lesson.lessonSlug).toEqual(
      _syntheticUnitvariantLessonsByKsFixture.lesson_slug,
    );
    expect(lesson.unitSlug).toEqual(
      _syntheticUnitvariantLessonsByKsFixture.unit_slug,
    );
    expect(lesson.programmeSlug).toEqual(
      _syntheticUnitvariantLessonsByKsFixture.programme_slug,
    );
    expect(lesson.isLegacy).toEqual(
      _syntheticUnitvariantLessonsByKsFixture.is_legacy,
    );
    expect(lesson.lessonSlug).toEqual(
      _syntheticUnitvariantLessonsByKsFixture.lesson_slug,
    );

    expect(lesson.lessonTitle).toEqual(_lessonContentFixture.lesson_title);
  });

  test("it should return pathways for canonical lesson if unit_slug and programme_slug are not passed as props", async () => {
    const _syntheticUnitvariantLessonsByKsFixture1 =
      syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          programme_slug: "lesson-slug-test-1",
        },
      });
    const _syntheticUnitvariantLessonsByKsFixture2 =
      syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          programme_slug: "lesson-slug-test-2",
        },
      });
    const _syntheticUnitvariantLessonsByKsFixture3 =
      syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          programme_slug: "lesson-slug-test-3",
        },
      });

    const _lessonContentFixture = lessonContentFixture({
      overrides: {
        exit_quiz: [],
        starter_quiz: [],
      },
    });

    const lesson = await lessonOverview({
      ...sdk,
      lessonOverview: jest.fn(() =>
        Promise.resolve({
          browseData: [
            _syntheticUnitvariantLessonsByKsFixture1,
            _syntheticUnitvariantLessonsByKsFixture2,
            _syntheticUnitvariantLessonsByKsFixture3,
          ],
          content: [_lessonContentFixture],
        }),
      ),
    })({
      lessonSlug: "test",
    });
    lesson.pathways.forEach((pathway) => {
      const l = lessonPathwaySchema.safeParse(pathway);
      expect(l.success).toBeTruthy();
    });
    expect(lesson.pathways[0]?.programmeSlug).toEqual("lesson-slug-test-1");
    expect(lesson.pathways[1]?.programmeSlug).toEqual("lesson-slug-test-2");
    expect(lesson.pathways[2]?.programmeSlug).toEqual("lesson-slug-test-3");

    expect(lesson.pathways.length).toEqual(3);
  });

  test("throws a 'Resource not found' error if  data", async () => {
    await expect(async () => {
      await lessonOverview({
        ...sdk,
        lessonOverview: jest.fn(() =>
          Promise.resolve({
            browseData: [],
            content: [],
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow("Resource not found");
  });

  describe("getCopyrightContent", () => {
    it("should return null if content is null", () => {
      expect(getCopyrightContent(null)).toBeNull();
    });

    it("should return an array with copyrightInfo if provided", () => {
      const content = [
        { copyrightInfo: "Copyright 2024 Example Corp." },
        { copyrightInfo: "Copyright 2023 Another Corp." },
      ];
      expect(getCopyrightContent(content)).toEqual([
        { copyrightInfo: "Copyright 2024 Example Corp." },
        { copyrightInfo: "Copyright 2023 Another Corp." },
      ]);
    });

    it("should handle empty string copyrightInfo fields", () => {
      const content = [{ copyrightInfo: "" }];
      expect(getCopyrightContent(content)).toEqual([{ copyrightInfo: "" }]);
    });
  });
  describe("getContentGuidance", () => {
    it("should return null if content.contentGuidance is null", () => {
      expect(getContentGuidance(null)).toBeNull();
    });

    it("should return an array with content guidance details if provided", () => {
      expect(
        getContentGuidance([
          {
            contentguidanceLabel: "Label 1",
            contentguidanceDescription: "Description 1",
            contentguidanceArea: "Area 1",
          },
          {
            contentguidanceLabel: "Label 2",
            contentguidanceDescription: "Description 2",
            contentguidanceArea: "Area 2",
          },
        ]),
      ).toEqual([
        {
          contentGuidanceLabel: "Label 1",
          contentGuidanceDescription: "Description 1",
          contentGuidanceArea: "Area 1",
        },
        {
          contentGuidanceLabel: "Label 2",
          contentGuidanceDescription: "Description 2",
          contentGuidanceArea: "Area 2",
        },
      ]);
    });
  });
  describe("getDownloadsArray", () => {
    it("should return correct downloads array when all content flags are true and isLegacy is false", () => {
      const content = {
        hasSlideDeckAssetObject: true,
        hasStarterQuiz: true,
        hasExitQuiz: true,
        hasWorksheetAssetObject: true,
        hasWorksheetAnswersAssetObject: true,
        hasWorksheetGoogleDriveDownloadableVersion: true,
        hasSupplementaryAssetObject: true,
        isLegacy: false,
      };

      const expectedDownloads = [
        { exists: true, type: "presentation" },
        { exists: true, type: "intro-quiz-questions" },
        { exists: true, type: "intro-quiz-answers" },
        { exists: true, type: "exit-quiz-questions" },
        { exists: true, type: "exit-quiz-questions" },
        { exists: true, type: "worksheet-pdf" },
        { exists: true, type: "worksheet-pptx" },
        { exists: true, type: "supplementary-pdf" },
        { exists: true, type: "supplementary-docx" },
      ];

      expect(getDownloadsArray(content)).toEqual(expectedDownloads);
    });

    it("should return correct downloads array when all content flags are true and isLegacy is true", () => {
      const content = {
        hasSlideDeckAssetObject: true,
        hasStarterQuiz: true,
        hasExitQuiz: true,
        hasWorksheetAssetObject: true,
        hasWorksheetAnswersAssetObject: true,
        hasWorksheetGoogleDriveDownloadableVersion: true,
        hasSupplementaryAssetObject: true,
        isLegacy: true,
      };

      const expectedDownloads = [
        { exists: true, type: "presentation" },
        { exists: true, type: "intro-quiz-questions" },
        { exists: true, type: "intro-quiz-answers" },
        { exists: true, type: "exit-quiz-questions" },
        { exists: true, type: "exit-quiz-questions" },
        { exists: true, type: "worksheet-pdf" },
        { exists: true, type: "worksheet-pptx" },
        { exists: true, type: "supplementary-pdf" },
        { exists: true, type: "supplementary-docx" },
      ];

      expect(getDownloadsArray(content)).toEqual(expectedDownloads);
    });

    it("should return correct downloads array when all content flags are false and isLegacy is false", () => {
      const content = {
        hasSlideDeckAssetObject: false,
        hasStarterQuiz: false,
        hasExitQuiz: false,
        hasWorksheetAssetObject: false,
        hasWorksheetAnswersAssetObject: false,
        hasWorksheetGoogleDriveDownloadableVersion: false,
        hasSupplementaryAssetObject: false,
        isLegacy: false,
      };

      const expectedDownloads = [
        { exists: false, type: "presentation" },
        { exists: false, type: "intro-quiz-questions" },
        { exists: false, type: "intro-quiz-answers" },
        { exists: false, type: "exit-quiz-questions" },
        { exists: false, type: "exit-quiz-questions" },
        { exists: false, type: "worksheet-pdf" },
        { exists: false, type: "worksheet-pptx" },
        { exists: false, type: "supplementary-pdf" },
        { exists: false, type: "supplementary-docx" },
      ];

      expect(getDownloadsArray(content)).toEqual(expectedDownloads);
    });

    it("should return correct downloads array when isLegacy is true and hasWorksheetGoogleDriveDownloadableVersion is true", () => {
      const content = {
        hasSlideDeckAssetObject: false,
        hasStarterQuiz: false,
        hasExitQuiz: false,
        hasWorksheetAssetObject: false,
        hasWorksheetAnswersAssetObject: false,
        hasWorksheetGoogleDriveDownloadableVersion: true,
        hasSupplementaryAssetObject: false,
        isLegacy: true,
      };

      const expectedDownloads = [
        { exists: false, type: "presentation" },
        { exists: false, type: "intro-quiz-questions" },
        { exists: false, type: "intro-quiz-answers" },
        { exists: false, type: "exit-quiz-questions" },
        { exists: false, type: "exit-quiz-questions" },
        { exists: true, type: "worksheet-pdf" },
        { exists: true, type: "worksheet-pptx" },
        { exists: false, type: "supplementary-pdf" },
        { exists: false, type: "supplementary-docx" },
      ];

      expect(getDownloadsArray(content)).toEqual(expectedDownloads);
    });

    it("should return correct downloads array when isLegacy is false and hasWorksheetAssetObject is true", () => {
      const content = {
        hasSlideDeckAssetObject: false,
        hasStarterQuiz: false,
        hasExitQuiz: false,
        hasWorksheetAssetObject: true,
        hasWorksheetAnswersAssetObject: false,
        hasWorksheetGoogleDriveDownloadableVersion: false,
        hasSupplementaryAssetObject: false,
        isLegacy: false,
      };

      const expectedDownloads = [
        { exists: false, type: "presentation" },
        { exists: false, type: "intro-quiz-questions" },
        { exists: false, type: "intro-quiz-answers" },
        { exists: false, type: "exit-quiz-questions" },
        { exists: false, type: "exit-quiz-questions" },
        { exists: true, type: "worksheet-pdf" },
        { exists: true, type: "worksheet-pptx" },
        { exists: false, type: "supplementary-pdf" },
        { exists: false, type: "supplementary-docx" },
      ];

      expect(getDownloadsArray(content)).toEqual(expectedDownloads);
    });
  });
});
