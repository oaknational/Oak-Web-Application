import { pupilLessonQuery } from "./pupilLesson.query";

import {
  browseDataFixture,
  contentFixture,
} from "@/node-lib/curriculum-api-2023/fixtures/pupilLesson.fixture";
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
    const _browseDataFixture = browseDataFixture({
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
          browseData: [_browseDataFixture],
          content: [_contentFixture],
        }),
      ),
    })({
      lessonSlug: "test",
    });

    expect(lesson.browseData.lessonSlug).toEqual(
      _browseDataFixture.lesson_slug,
    );
    expect(lesson.browseData.unitSlug).toEqual(_browseDataFixture.unit_slug);
    expect(lesson.browseData.programmeSlug).toEqual(
      _browseDataFixture.programme_slug,
    );
    expect(lesson.browseData.isLegacy).toEqual(_browseDataFixture.is_legacy);
    expect(lesson.browseData.programmeFields.lessonSlug).toEqual(
      lesson.browseData.programmeFields.lesson_slug,
    );
    expect(lesson.content.lessonId).toEqual(_contentFixture.lesson_id);
    expect(lesson.content.lessonTitle).toEqual(_contentFixture.lesson_title);
  });

  test("it returns the first lesson if multiple are found", async () => {
    const fixtures = [
      browseDataFixture({
        lesson_slug: "lesson-slug-test",
        unit_slug: "unit-slug-test",
        programme_slug: "programme-slug-test",
        is_legacy: false,
      }),
      browseDataFixture(),
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
