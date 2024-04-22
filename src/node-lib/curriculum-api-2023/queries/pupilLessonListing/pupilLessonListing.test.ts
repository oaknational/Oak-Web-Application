import { syntheticUnitvariantLessonsFixture } from "@oaknational/oak-curriculum-schema";

import { pupilLessonListingQuery } from "./pupilLessonListing.query";

import { PupilLessonListingQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("pupilLessonListing()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await pupilLessonListingQuery({
        ...sdk,
        pupilLessonListing: jest.fn(() => Promise.resolve({ browseData: [] })),
      })({
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("it returns the lesson if found", async () => {
    const _syntheticUnitvariantLessonsFixture =
      syntheticUnitvariantLessonsFixture({
        overrides: {
          unit_slug: "unit-slug-test",
          programme_slug: "programme-slug-test",
        },
      });

    const lesson = await pupilLessonListingQuery({
      ...sdk,
      pupilLessonListing: jest.fn(
        () =>
          Promise.resolve({
            browseData: [_syntheticUnitvariantLessonsFixture],
          }) as Promise<PupilLessonListingQuery>, // Add the correct return type
      ),
    })({
      unitSlug: "test",
      programmeSlug: "test",
    });

    expect(lesson.browseData[0]?.lessonSlug).toEqual(
      _syntheticUnitvariantLessonsFixture.lesson_slug,
    );
    expect(lesson.browseData[0]?.unitSlug).toEqual(
      _syntheticUnitvariantLessonsFixture.unit_slug,
    );
    expect(lesson.browseData[0]?.programmeSlug).toEqual(
      _syntheticUnitvariantLessonsFixture.programme_slug,
    );
  });

  test("it returns the first lesson if multiple are found", async () => {
    const fixtures = [
      syntheticUnitvariantLessonsFixture({
        overrides: {
          unit_slug: "unit-slug-test",
          programme_slug: "programme-slug-test",
        },
      }),
      syntheticUnitvariantLessonsFixture(),
    ];

    if (!fixtures || fixtures.length < 1) {
      throw new Error("No fixtures found");
    }
    const lesson = await pupilLessonListingQuery({
      ...sdk,
      pupilLessonListing: jest.fn(
        () =>
          Promise.resolve({
            browseData: fixtures as PupilLessonListingQuery["browseData"],
          }) as Promise<PupilLessonListingQuery>,
      ),
    })({
      unitSlug: "test",
      programmeSlug: "test",
    });

    expect(lesson.browseData[0]?.lessonSlug).toEqual(fixtures[0]?.lesson_slug);
    expect(lesson.browseData[0]?.unitSlug).toEqual(fixtures[0]?.unit_slug);
    expect(lesson.browseData[0]?.programmeSlug).toEqual(
      fixtures[0]?.programme_slug,
    );
    expect(lesson.browseData[0]?.isLegacy).toEqual(fixtures[0]?.is_legacy);
  });
});
