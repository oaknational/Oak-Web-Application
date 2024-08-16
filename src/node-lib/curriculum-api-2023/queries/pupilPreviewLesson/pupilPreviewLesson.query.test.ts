import { lessonContentFixture } from "@oaknational/oak-curriculum-schema";

import { pupilPreviewLessonQuery } from "./pupilPreviewLesson.query";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("pupilPreviewLesson()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await pupilPreviewLessonQuery({
        ...sdk,
        pupilPreviewLesson: jest.fn(() =>
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
    const _lessonContentFixture = lessonContentFixture();

    const lesson = await pupilPreviewLessonQuery({
      ...sdk,
      pupilPreviewLesson: jest.fn(() =>
        Promise.resolve({
          content: [_lessonContentFixture],
        }),
      ),
    })({
      lessonSlug: _lessonContentFixture.lesson_slug,
    });

    expect(lesson.browseData.lessonSlug).toEqual(
      _lessonContentFixture.lesson_slug,
    );
    expect(lesson.content.lessonId).toEqual(_lessonContentFixture.lesson_id);
    expect(lesson.content.lessonTitle).toEqual(
      _lessonContentFixture.lesson_title,
    );
  });

  test("it overrides unitSlug, programmeSlug and isLegacy if provided", async () => {
    const _lessonContentFixture = lessonContentFixture();

    const lesson = await pupilPreviewLessonQuery({
      ...sdk,
      pupilPreviewLesson: jest.fn(() =>
        Promise.resolve({
          content: [_lessonContentFixture],
        }),
      ),
    })({
      lessonSlug: _lessonContentFixture.lesson_slug,
      unitSlug: "unit-slug-test",
      programmeSlug: "programme-slug-test",
      isLegacy: true,
    });

    expect(lesson.browseData.unitSlug).toEqual("unit-slug-test");
    expect(lesson.browseData.programmeSlug).toEqual("programme-slug-test");
    expect(lesson.browseData.isLegacy).toEqual(true);
  });
});
