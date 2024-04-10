import { pupilLessonQuery } from "./pupilLesson.query";

import { pupilLessonFixture } from "@/node-lib/curriculum-api-2023/fixtures/pupilLesson.fixture";
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
    const fixture = pupilLessonFixture({
      lesson_slug: "lesson-slug-test",
      unit_slug: "unit-slug-test",
      programme_slug: "programme-slug-test",
      is_legacy: false,
    });

    const lesson = await pupilLessonQuery({
      ...sdk,
      pupilLesson: jest.fn(() =>
        Promise.resolve({
          browseData: [fixture],
          content: [{}],
        }),
      ),
    })({
      lessonSlug: "test",
    });

    expect(lesson.browseData.lesson_slug).toEqual(fixture.lesson_slug);
    expect(lesson.browseData.unit_slug).toEqual(fixture.unit_slug);
    expect(lesson.browseData.programme_slug).toEqual(fixture.programme_slug);
    expect(lesson.browseData.is_legacy).toEqual(fixture.is_legacy);
  });

  test("it returns the first lesson if multiple are found", async () => {
    const fixtures = [
      pupilLessonFixture({
        lesson_slug: "lesson-slug-test",
        unit_slug: "unit-slug-test",
        programme_slug: "programme-slug-test",
        is_legacy: false,
      }),
      pupilLessonFixture(),
    ];

    if (!fixtures || fixtures.length < 1) {
      throw new Error("No fixtures found");
    }

    const lesson = await pupilLessonQuery({
      ...sdk,
      pupilLesson: jest.fn(() =>
        Promise.resolve({
          browseData: fixtures,
          content: [{}],
        }),
      ),
    })({
      lessonSlug: "test",
    });

    expect(lesson.browseData.lesson_slug).toEqual(fixtures[0]?.lesson_slug);
    expect(lesson.browseData.unit_slug).toEqual(fixtures[0]?.unit_slug);
    expect(lesson.browseData.programme_slug).toEqual(
      fixtures[0]?.programme_slug,
    );
    expect(lesson.browseData.is_legacy).toEqual(fixtures[0]?.is_legacy);
  });
});
