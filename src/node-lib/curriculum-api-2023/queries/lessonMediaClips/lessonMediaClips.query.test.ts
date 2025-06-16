import { syntheticUnitvariantLessonsByKsFixture } from "@oaknational/oak-curriculum-schema";

import {
  LessonMediaClipsData,
  CanonicalLessonMediaClips,
} from "./lessonMediaClips.schema";
import { lessonMediaClipsQuery } from "./lessonMediaClips.query";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("lessonMediaClips()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await lessonMediaClipsQuery({
        ...sdk,
        lessonMediaClips: jest.fn(() => Promise.resolve({ browseData: [] })),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("it returns the lesson if found", async () => {
    const _syntheticUnitvariantLessonsFixture =
      syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          lesson_slug: "lesson-slug-test",
          unit_slug: "unit-slug-test",
          programme_slug: "programme-slug-test",
          is_legacy: false,
          lesson_data: {
            ...syntheticUnitvariantLessonsByKsFixture().lesson_data,
            lesson_outline: [{ lesson_outline: "test" }],
          },
        },
      });

    const lesson = (await lessonMediaClipsQuery({
      ...sdk,
      lessonMediaClips: jest.fn(() =>
        Promise.resolve({
          browseData: [_syntheticUnitvariantLessonsFixture],
        }),
      ),
    })({
      lessonSlug: "lesson-slug-test",
      unitSlug: "unit-slug-test",
      programmeSlug: "programme-slug-test",
    })) as LessonMediaClipsData;

    expect(lesson.lessonSlug).toEqual(
      _syntheticUnitvariantLessonsFixture.lesson_slug,
    );
    expect(lesson.unitSlug).toEqual(
      _syntheticUnitvariantLessonsFixture.unit_slug,
    );
    expect(lesson.programmeSlug).toEqual(
      _syntheticUnitvariantLessonsFixture.programme_slug,
    );

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
          lesson_data: {
            ...syntheticUnitvariantLessonsByKsFixture().lesson_data,
            lesson_outline: [{ lesson_outline: "test" }],
          },
        },
      }),
      syntheticUnitvariantLessonsByKsFixture(),
    ];

    if (!fixtures || fixtures.length < 1) {
      throw new Error("No fixtures found");
    }

    const lesson = (await lessonMediaClipsQuery({
      ...sdk,
      lessonMediaClips: jest.fn(() =>
        Promise.resolve({
          browseData: fixtures,
        }),
      ),
    })({
      lessonSlug: "test",
      unitSlug: "test",
    })) as LessonMediaClipsData;

    expect(lesson.lessonSlug).toEqual(fixtures[0]?.lesson_slug);
    expect(lesson.unitSlug).toEqual(fixtures[0]?.unit_slug);
    expect(lesson.programmeSlug).toEqual(fixtures[0]?.programme_slug);
  });

  test("returns canonical lesson data in correct format", async () => {
    const _syntheticUnitvariantLessonsFixture =
      syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          lesson_slug: "lesson-slug-test",
          unit_slug: "unit-slug-test",
          programme_slug: "programme-slug-test",
          is_legacy: false,
          lesson_data: {
            ...syntheticUnitvariantLessonsByKsFixture().lesson_data,
            lesson_outline: [{ lesson_outline: "test" }],
          },
        },
      });

    const lesson = (await lessonMediaClipsQuery({
      ...sdk,
      lessonMediaClips: jest.fn(() =>
        Promise.resolve({
          browseData: [_syntheticUnitvariantLessonsFixture],
        }),
      ),
    })({
      lessonSlug: "test",
    })) as CanonicalLessonMediaClips;
    expect(lesson.lessonSlug).toEqual(
      _syntheticUnitvariantLessonsFixture.lesson_slug,
    );
    expect(lesson.pathways).toHaveLength(1);
  });
});
