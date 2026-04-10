/**
 * @jest-environment node
 */
import {
  lessonContentFixture,
  syntheticUnitvariantLessonsByKsFixture,
  additionalFilesFixture,
  mediaClipsFixture,
} from "@oaknational/oak-curriculum-schema";
import { keysToCamelCase } from "zod-to-camel-case";

import lessonMediaClipsFixtures from "../../fixtures/lessonMediaClips.fixture";

import teachersLessonOverview, {
  getContentGuidance,
  getCopyrightContent,
  getDownloadsArray,
  getAdditionalFiles,
  getAdjacentLessonsByOrderInUnit,
} from "./teachersLessonOverview.query";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

export const _additionalFilesFixture = keysToCamelCase(
  additionalFilesFixture().downloadable_files,
);

const unitSlugTest = "unit-slug-test";
const programmeSlugTest = "programme-slug-test";

describe("teachersLessonOverview()", () => {
  test("throws a not found error if no unit data is found", async () => {
    const _syntheticUnitvariantLessonsByKsFixture =
      syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          lesson_slug: "lesson-slug-test",
          unit_slug: unitSlugTest,
          programme_slug: programmeSlugTest,
          is_legacy: false,
          programme_slug_by_year: [programmeSlugTest],
        },
      });

    const _lessonContentFixture = lessonContentFixture({
      overrides: {
        exit_quiz: [],
        starter_quiz: [],
      },
    });

    await expect(async () => {
      await teachersLessonOverview({
        ...sdk,
        teachersLessonOverview: jest.fn(() =>
          Promise.resolve({
            browseData: [_syntheticUnitvariantLessonsByKsFixture],
            content: [_lessonContentFixture],
            unitData: [],
            tpcWorks: [],
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await teachersLessonOverview({
        ...sdk,
        teachersLessonOverview: jest.fn(() =>
          Promise.resolve({
            content: [],
            browseData: [],
            unitData: [],
            tpcWorks: [],
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  describe("getAdjacentLessonsByOrderInUnit", () => {
    it("returns previous and next when current lesson is in the middle", () => {
      expect(
        getAdjacentLessonsByOrderInUnit(
          [
            { slug: "a", title: "A", order: 1 },
            { slug: "b", title: "B", order: 2 },
            { slug: "c", title: "C", order: 3 },
          ],
          "b",
        ),
      ).toEqual({
        previousLesson: {
          lessonSlug: "a",
          lessonTitle: "A",
          lessonIndex: 1,
        },
        nextLesson: {
          lessonSlug: "c",
          lessonTitle: "C",
          lessonIndex: 3,
        },
      });
    });

    it("returns null previous on first lesson and null next on last", () => {
      expect(
        getAdjacentLessonsByOrderInUnit(
          [
            { slug: "a", title: "A", order: 1 },
            { slug: "b", title: "B", order: 2 },
          ],
          "a",
        ),
      ).toEqual({
        previousLesson: null,
        nextLesson: {
          lessonSlug: "b",
          lessonTitle: "B",
          lessonIndex: 2,
        },
      });
      expect(
        getAdjacentLessonsByOrderInUnit(
          [
            { slug: "a", title: "A", order: 1 },
            { slug: "b", title: "B", order: 2 },
          ],
          "b",
        ),
      ).toEqual({
        previousLesson: {
          lessonSlug: "a",
          lessonTitle: "A",
          lessonIndex: 1,
        },
        nextLesson: null,
      });
    });

    it("returns both null when current slug is not in the list", () => {
      expect(
        getAdjacentLessonsByOrderInUnit(
          [{ slug: "a", title: "A", order: 1 }],
          "missing",
        ),
      ).toEqual({ previousLesson: null, nextLesson: null });
    });

    it("sorts by order when rows are not in sequence order", () => {
      expect(
        getAdjacentLessonsByOrderInUnit(
          [
            { slug: "lesson-c", title: "C", order: 3 },
            { slug: "lesson-a", title: "A", order: 1 },
            { slug: "lesson-b", title: "B", order: 2 },
          ],
          "lesson-b",
        ),
      ).toEqual({
        previousLesson: {
          lessonSlug: "lesson-a",
          lessonTitle: "A",
          lessonIndex: 1,
        },
        nextLesson: {
          lessonSlug: "lesson-c",
          lessonTitle: "C",
          lessonIndex: 3,
        },
      });
    });

    it("breaks ties on equal order by slug", () => {
      expect(
        getAdjacentLessonsByOrderInUnit(
          [
            { slug: "zebra", title: "Z", order: 1 },
            { slug: "alpha", title: "A", order: 1 },
            { slug: "mike", title: "M", order: 2 },
          ],
          "zebra",
        ),
      ).toEqual({
        previousLesson: {
          lessonSlug: "alpha",
          lessonTitle: "A",
          lessonIndex: 1,
        },
        nextLesson: {
          lessonSlug: "mike",
          lessonTitle: "M",
          lessonIndex: 3,
        },
      });
    });
  });

  test("it returns the lesson if found", async () => {
    const _syntheticUnitvariantLessonsByKsFixture =
      syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          lesson_slug: "lesson-slug-test",
          unit_slug: unitSlugTest,
          programme_slug: programmeSlugTest,
          is_legacy: false,
          programme_slug_by_year: [programmeSlugTest],
        },
      });

    const _lessonContentFixture = lessonContentFixture({
      overrides: {
        exit_quiz: [],
        starter_quiz: [],
      },
    });

    const _unitDataFixture = {
      lesson_count:
        _syntheticUnitvariantLessonsByKsFixture.static_lesson_list?.length ?? 1,
      supplementary_data: {
        unit_order: 16,
        static_lesson_list: [
          {
            slug: "lesson-slug-test",
            order: 1,
            title: "Lesson Tile",
            _state: "published",
            lesson_uid: "test-uid",
          },
        ],
      },
    };

    const lesson = await teachersLessonOverview({
      ...sdk,
      teachersLessonOverview: jest.fn(() =>
        Promise.resolve({
          browseData: [_syntheticUnitvariantLessonsByKsFixture],
          content: [_lessonContentFixture],
          unitData: [_unitDataFixture],
          tpcWorks: [],
        }),
      ),
    })({
      lessonSlug: "lesson-slug-test",
      unitSlug: unitSlugTest,
      programmeSlug: programmeSlugTest,
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
    expect(lesson.lessonTitle).toEqual(_lessonContentFixture.lesson_title);
    expect(lesson.orderInUnit).toEqual(
      _syntheticUnitvariantLessonsByKsFixture.order_in_unit,
    );
    expect(lesson.unitTotalLessonCount).toEqual(
      _unitDataFixture.supplementary_data.static_lesson_list.length,
    );
    expect(lesson.previousLesson).toBeNull();
    expect(lesson.nextLesson).toBeNull();
  });

  test("returns null adjacent lessons when static_lesson_list is empty", async () => {
    const row = syntheticUnitvariantLessonsByKsFixture({
      overrides: {
        lesson_slug: "lesson-b",
        unit_slug: unitSlugTest,
        programme_slug: programmeSlugTest,
        order_in_unit: 2,
        programme_slug_by_year: [programmeSlugTest],
      },
    });
    const content = lessonContentFixture({
      overrides: { exit_quiz: [], starter_quiz: [] },
    });
    const unitData = {
      lesson_count: 3,
      supplementary_data: {
        unit_order: 1,
        static_lesson_list: [],
      },
    };

    const lesson = await teachersLessonOverview({
      ...sdk,
      teachersLessonOverview: jest.fn(() =>
        Promise.resolve({
          browseData: [row],
          content: [content],
          unitData: [unitData],
          tpcWorks: [],
        }),
      ),
    })({
      lessonSlug: "lesson-b",
      unitSlug: unitSlugTest,
      programmeSlug: programmeSlugTest,
    });

    expect(lesson.previousLesson).toBeNull();
    expect(lesson.nextLesson).toBeNull();
  });

  test("returns previous and next from static_lesson_list when unit and programme are provided", async () => {
    const browseRow = syntheticUnitvariantLessonsByKsFixture({
      overrides: {
        lesson_slug: "lesson-b",
        unit_slug: unitSlugTest,
        programme_slug: programmeSlugTest,
        order_in_unit: 2,
        programme_slug_by_year: [programmeSlugTest],
      },
    });
    const content = lessonContentFixture({
      overrides: { exit_quiz: [], starter_quiz: [] },
    });
    const unitData = {
      lesson_count: 3,
      supplementary_data: {
        unit_order: 1,
        static_lesson_list: [
          {
            slug: "lesson-a",
            order: 1,
            title: "Lesson A",
            _state: "published",
            lesson_uid: "uid-a",
          },
          {
            slug: "lesson-b",
            order: 2,
            title: "Lesson B",
            _state: "published",
            lesson_uid: "uid-b",
          },
          {
            slug: "lesson-c",
            order: 3,
            title: "Lesson C",
            _state: "published",
            lesson_uid: "uid-c",
          },
        ],
      },
    };

    const lesson = await teachersLessonOverview({
      ...sdk,
      teachersLessonOverview: jest.fn(() =>
        Promise.resolve({
          browseData: [browseRow],
          content: [content],
          unitData: [unitData],
          tpcWorks: [],
        }),
      ),
    })({
      lessonSlug: "lesson-b",
      unitSlug: unitSlugTest,
      programmeSlug: programmeSlugTest,
    });

    expect(lesson.previousLesson).toEqual({
      lessonSlug: "lesson-a",
      lessonTitle: "Lesson A",
      lessonIndex: 1,
    });
    expect(lesson.nextLesson).toEqual({
      lessonSlug: "lesson-c",
      lessonTitle: "Lesson C",
      lessonIndex: 3,
    });
  });

  test("throws a 'Resource not found' error if  data", async () => {
    await expect(async () => {
      await teachersLessonOverview({
        ...sdk,
        teachersLessonOverview: jest.fn(() =>
          Promise.resolve({
            browseData: [],
            content: [],
            unitData: [],
            tpcWorks: [],
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

    it("should return an array with content guidance details defaulted to empty strings in not provided", () => {
      expect(
        getContentGuidance([
          {
            contentguidanceLabel: null,
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
          {
            contentguidanceLabel: "Label 2",
            contentguidanceDescription: "Description 2",
            contentguidanceArea: null,
          },
        ]),
      ).toEqual([
        {
          contentGuidanceLabel: "",
          contentGuidanceDescription: "",
          contentGuidanceArea: "",
        },
        {
          contentGuidanceLabel: "Label 2",
          contentGuidanceDescription: "Description 2",
          contentGuidanceArea: "",
        },
      ]);
    });
  });
  describe("getDownloadsArray", () => {
    it("should return correct downloads array when all content flags are true", () => {
      const content = {
        hasSlideDeckAssetObject: true,
        hasStarterQuiz: true,
        hasExitQuiz: true,
        hasWorksheetAssetObject: true,
        hasWorksheetAnswersAssetObject: true,
        hasSupplementaryAssetObject: true,
        hasLessonGuideObject: true,
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
        { exists: true, type: "lesson-guide-pdf" },
      ];

      expect(getDownloadsArray(content)).toEqual(expectedDownloads);
    });

    it("should return correct downloads array when all content flags are false", () => {
      const content = {
        hasSlideDeckAssetObject: false,
        hasStarterQuiz: false,
        hasExitQuiz: false,
        hasWorksheetAssetObject: false,
        hasWorksheetAnswersAssetObject: false,
        hasSupplementaryAssetObject: false,
        hasLessonGuideObject: false,
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
        { exists: false, type: "lesson-guide-pdf" },
      ];

      expect(getDownloadsArray(content)).toEqual(expectedDownloads);
    });

    it("should return correct downloads array when hasWorksheetAssetObject is true", () => {
      const content = {
        hasSlideDeckAssetObject: false,
        hasStarterQuiz: false,
        hasExitQuiz: false,
        hasWorksheetAssetObject: true,
        hasWorksheetAnswersAssetObject: false,
        hasSupplementaryAssetObject: false,
        hasLessonGuideObject: false,
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
        { exists: false, type: "lesson-guide-pdf" },
      ];

      expect(getDownloadsArray(content)).toEqual(expectedDownloads);
    });
  });

  describe("getAdditionalFiles", () => {
    it("should return an empty array if additionalFiles is null", () => {
      expect(getAdditionalFiles(null)).toEqual([]);
    });

    it("should return an array of additional files if provided", () => {
      expect(getAdditionalFiles(_additionalFilesFixture)).toEqual([
        "File 1 1000 B (PDF)",
        "File 2 1.95 KB (PDF)",
      ]);
    });
  });
});
describe("hasMediaClips logic", () => {
  test("it returns hasMediaClips as true when media clips are present", async () => {
    const _syntheticUnitvariantLessonsByKsFixture =
      syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          lesson_slug: "lesson-slug-test",
          unit_slug: unitSlugTest,
          programme_slug: programmeSlugTest,
          is_legacy: false,
          programme_slug_by_year: [programmeSlugTest],
          lesson_data: {
            ...syntheticUnitvariantLessonsByKsFixture({}).lesson_data,
            ...mediaClipsFixture(),
          },
        },
      });

    const _lessonContentFixture = lessonContentFixture({
      overrides: {
        exit_quiz: [],
        starter_quiz: [],
      },
    });

    const _unitDataFixture = {
      lesson_count:
        _syntheticUnitvariantLessonsByKsFixture.static_lesson_list?.length ?? 1,
      supplementary_data: {
        unit_order: 16,
        static_lesson_list: [
          {
            slug: "lesson-slug-test",
            order: 1,
            title: "Lesson Tile",
            _state: "published",
            lesson_uid: "test-uid",
          },
        ],
      },
    };

    const lesson = await teachersLessonOverview({
      ...sdk,
      teachersLessonOverview: jest.fn(() =>
        Promise.resolve({
          browseData: [_syntheticUnitvariantLessonsByKsFixture],
          content: [_lessonContentFixture],
          unitData: [_unitDataFixture],
          tpcWorks: [],
        }),
      ),
    })({
      lessonSlug: "lesson-slug-test",
      unitSlug: unitSlugTest,
      programmeSlug: programmeSlugTest,
    });

    expect(lesson.lessonSlug).toEqual(
      _syntheticUnitvariantLessonsByKsFixture.lesson_slug,
    );
    expect(lesson.hasMediaClips).toEqual(true);
    expect(lesson.lessonMediaClips).toEqual(
      lessonMediaClipsFixtures({
        lessonSlug: "lesson-slug-test",
        unitSlug: unitSlugTest,
        programmeSlug: programmeSlugTest,
      }).mediaClips,
    );
  });
});
