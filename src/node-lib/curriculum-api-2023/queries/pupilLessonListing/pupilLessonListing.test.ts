import { PupilLessonListingQuery } from "../../generated/sdk";

import { pupilLessonListingQuery } from "./pupilLessonListing.query";

import { syntheticUnitvariantLessonsSchemaFixture } from "@/node-lib/curriculum-api-2023/fixtures/schema.new.fixture";
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
    const _syntheticUnitvariantLessonsSchemaFixture =
      syntheticUnitvariantLessonsSchemaFixture({
        unit_slug: "unit-slug-test",
        programme_slug: "programme-slug-test",
      });

    const lesson = await pupilLessonListingQuery({
      ...sdk,
      pupilLessonListing: jest.fn(
        () =>
          Promise.resolve({
            browseData: [_syntheticUnitvariantLessonsSchemaFixture],
          }) as Promise<PupilLessonListingQuery>, // Add the correct return type
      ),
    })({
      unitSlug: "test",
      programmeSlug: "test",
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
  });

  test("it returns the first lesson if multiple are found", async () => {
    const fixtures = [
      syntheticUnitvariantLessonsSchemaFixture({
        unit_slug: "unit-slug-test",
        programme_slug: "programme-slug-test",
      }),
      syntheticUnitvariantLessonsSchemaFixture(),
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

    expect(lesson.browseData.lessonSlug).toEqual(fixtures[0]?.lesson_slug);
    expect(lesson.browseData.unitSlug).toEqual(fixtures[0]?.unit_slug);
    expect(lesson.browseData.programmeSlug).toEqual(
      fixtures[0]?.programme_slug,
    );
    expect(lesson.browseData.isLegacy).toEqual(fixtures[0]?.is_legacy);
  });
});
