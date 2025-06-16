import { syntheticUnitvariantLessonsByKsFixture } from "@oaknational/oak-curriculum-schema";

import { betaLessonMediaClipsQuery } from "./lessonBetaMediaClips.query";

import { LessonMediaClipsData } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("lessonBetaMediaClips", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await betaLessonMediaClipsQuery({
        ...sdk,
        betaLessonMediaClips: jest.fn(() =>
          Promise.resolve({ browseData: [] }),
        ),
      })({
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("it returns the lesson if found", async () => {
    const _syntheticUnitvariantLessonsFixture =
      syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          lesson_slug: "lesson-slug-test",
        },
      });

    const lesson = (await betaLessonMediaClipsQuery({
      ...sdk,
      betaLessonMediaClips: jest.fn(() =>
        Promise.resolve({
          browseData: [_syntheticUnitvariantLessonsFixture],
        }),
      ),
    })({
      lessonSlug: "lesson-slug-test",
    })) as LessonMediaClipsData;

    expect(lesson.lessonSlug).toEqual(
      _syntheticUnitvariantLessonsFixture.lesson_slug,
    );
  });

  test("it returns the first lesson if multiple are found", async () => {
    const fixtures = [
      syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          lesson_slug: "lesson-slug-test",
          unit_slug: "unit-slug-test",
          programme_slug: "programme-slug-test",
          is_legacy: false,
        },
      }),
      syntheticUnitvariantLessonsByKsFixture(),
    ];

    if (!fixtures || fixtures.length < 1) {
      throw new Error("No fixtures found");
    }

    const lesson = (await betaLessonMediaClipsQuery({
      ...sdk,
      betaLessonMediaClips: jest.fn(() =>
        Promise.resolve({
          browseData: fixtures,
        }),
      ),
    })({
      lessonSlug: "test",
    })) as LessonMediaClipsData;

    expect(lesson.lessonSlug).toEqual(fixtures[0]?.lesson_slug);
  });
});
