import { pupilLessonQuery } from "./pupilLesson.query";

import {
  syntheticUnitvariantLessonsSchemaFixture,
  contentFixture,
} from "@/node-lib/curriculum-api-2023/fixtures/schema.new.fixture";
import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("pupilLesson()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await pupilLessonQuery({
        ...sdk,
        pupilLesson: jest.fn(() =>
          Promise.resolve({ browseData: [], content: [] }),
        ),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
        isLegacy: false,
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("it returns the lesson if found", async () => {
    const _syntheticUnitvariantLessonsSchemaFixture =
      syntheticUnitvariantLessonsSchemaFixture({
        lesson_slug: "lesson-slug-test",
        unit_slug: "unit-slug-test",
        programme_slug: "programme-slug-test",
        is_legacy: false,
      });

    const _contentFixture = contentFixture();

    const lesson = await pupilLessonQuery({
      ...sdk,
      pupilLesson: jest.fn(() =>
        Promise.resolve({
          browseData: [_syntheticUnitvariantLessonsSchemaFixture],
          content: [_contentFixture],
        }),
      ),
    })({
      lessonSlug: "test",
    });

    expect(lesson.browseData.lessonSlug).toEqual(
      _syntheticUnitvariantLessonsSchemaFixture.lesson_slug,
    );
    expect(lesson.browseData.unitSlug).toEqual(
      _syntheticUnitvariantLessonsSchemaFixture.unit_slug,
    );
    expect(lesson.browseData.programmeSlug).toEqual(
      _syntheticUnitvariantLessonsSchemaFixture.programme_slug,
    );
    expect(lesson.browseData.isLegacy).toEqual(
      _syntheticUnitvariantLessonsSchemaFixture.is_legacy,
    );
    expect(lesson.browseData.lessonSlug).toEqual(
      _syntheticUnitvariantLessonsSchemaFixture.lesson_slug,
    );
    expect(lesson.content.lessonId).toEqual(_contentFixture.lesson_id);
    expect(lesson.content.lessonTitle).toEqual(_contentFixture.lesson_title);
  });

  test("it returns the first lesson if multiple are found", async () => {
    const fixtures = [
      syntheticUnitvariantLessonsSchemaFixture({
        lesson_slug: "lesson-slug-test",
        unit_slug: "unit-slug-test",
        programme_slug: "programme-slug-test",
        is_legacy: false,
      }),
      syntheticUnitvariantLessonsSchemaFixture(),
    ];

    const _contentFixture = contentFixture();

    if (!fixtures || fixtures.length < 1) {
      throw new Error("No fixtures found");
    }

    const lesson = await pupilLessonQuery({
      ...sdk,
      pupilLesson: jest.fn(() =>
        Promise.resolve({
          browseData: fixtures,
          content: [_contentFixture],
        }),
      ),
    })({
      lessonSlug: "test",
    });

    expect(lesson.browseData.lessonSlug).toEqual(fixtures[0]?.lesson_slug);
    expect(lesson.browseData.unitSlug).toEqual(fixtures[0]?.unit_slug);
    expect(lesson.browseData.programmeSlug).toEqual(
      fixtures[0]?.programme_slug,
    );
    expect(lesson.browseData.isLegacy).toEqual(fixtures[0]?.is_legacy);
    expect(lesson.content.lessonId).toEqual(_contentFixture.lesson_id);
    expect(lesson.content.lessonTitle).toEqual(_contentFixture.lesson_title);
  });
});
