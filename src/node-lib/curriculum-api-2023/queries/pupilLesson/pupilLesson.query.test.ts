import {
  syntheticUnitvariantLessonsFixture,
  lessonContentFixture,
} from "@oaknational/oak-curriculum-schema";

import { pupilLessonQuery } from "./pupilLesson.query";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("pupilLesson()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await pupilLessonQuery({
        ...sdk,
        pupilLesson: jest.fn(() =>
          Promise.resolve({
            browseData: [],
            content: [],
          }),
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
    const _syntheticUnitvariantLessonsFixture =
      syntheticUnitvariantLessonsFixture({
        overrides: {
          lesson_slug: "lesson-slug-test",
          unit_slug: "unit-slug-test",
          programme_slug: "programme-slug-test",
          is_legacy: false,
        },
      });

    const _lessonContentFixture = lessonContentFixture();

    const lesson = await pupilLessonQuery({
      ...sdk,
      pupilLesson: jest.fn(() =>
        Promise.resolve({
          browseData: [_syntheticUnitvariantLessonsFixture],
          content: [_lessonContentFixture],
        }),
      ),
    })({
      lessonSlug: "test",
    });

    expect(lesson.browseData.lessonSlug).toEqual(
      _syntheticUnitvariantLessonsFixture.lesson_slug,
    );
    expect(lesson.browseData.unitSlug).toEqual(
      _syntheticUnitvariantLessonsFixture.unit_slug,
    );
    expect(lesson.browseData.programmeSlug).toEqual(
      _syntheticUnitvariantLessonsFixture.programme_slug,
    );
    expect(lesson.browseData.isLegacy).toEqual(
      _syntheticUnitvariantLessonsFixture.is_legacy,
    );
    expect(lesson.browseData.lessonSlug).toEqual(
      _syntheticUnitvariantLessonsFixture.lesson_slug,
    );
    expect(lesson.content.lessonId).toEqual(_lessonContentFixture.lesson_id);
    expect(lesson.content.lessonTitle).toEqual(
      _lessonContentFixture.lesson_title,
    );
  });

  test("it returns the first lesson if multiple are found", async () => {
    const fixtures = [
      syntheticUnitvariantLessonsFixture({
        overrides: {
          lesson_slug: "lesson-slug-test",
          unit_slug: "unit-slug-test",
          programme_slug: "programme-slug-test",
          is_legacy: false,
        },
      }),
      syntheticUnitvariantLessonsFixture(),
    ];

    const _lessonContentFixture = lessonContentFixture();

    if (!fixtures || fixtures.length < 1) {
      throw new Error("No fixtures found");
    }

    const lesson = await pupilLessonQuery({
      ...sdk,
      pupilLesson: jest.fn(() =>
        Promise.resolve({
          browseData: fixtures,
          content: [_lessonContentFixture],
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
    expect(lesson.content.lessonId).toEqual(_lessonContentFixture.lesson_id);
    expect(lesson.content.lessonTitle).toEqual(
      _lessonContentFixture.lesson_title,
    );
  });
});
