import { syntheticUnitvariantLessonsFixture } from "@oaknational/oak-curriculum-schema";

import { pupilLessonListingQuery } from "./pupilLessonListing.query";

import { PupilLessonListingQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("pupilLessonListing()", () => {
  test("it returns the lesson if found", async () => {
    const _syntheticUnitvariantLessonsFixture =
      syntheticUnitvariantLessonsFixture({
        overrides: {
          unit_slug: "unit-slug-test",
          programme_slug: "programme-slug-test-secondary-year-10",
        },
      });

    const lesson = await pupilLessonListingQuery({
      ...sdk,
      pupilLessonListing: jest.fn(
        () =>
          Promise.resolve({
            browseData: [_syntheticUnitvariantLessonsFixture],
            backLinkData: [],
          }) as Promise<PupilLessonListingQuery>, // Add the correct return type
      ),
      pupilLessonListingLessonContent: jest.fn(() =>
        Promise.resolve({
          data: [
            {
              lesson_slug: _syntheticUnitvariantLessonsFixture.lesson_slug,
              exit_quiz: [{ id: "quiz1" }, { id: "quiz2" }],
            },
          ],
        }),
      ),
    })({
      unitSlug: "test",
      programmeSlug: "programme-slug-test-secondary-year-10",
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
          programme_slug: "programme-slug-secondary-year-10",
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
      pupilLessonListingLessonContent: jest.fn(() =>
        Promise.resolve({
          data: fixtures.map((fixture) => ({
            lesson_slug: fixture.lesson_slug,
            exit_quiz: [{ id: "quiz1" }, { id: "quiz2" }],
          })),
        }),
      ),
    })({
      unitSlug: "test",
      programmeSlug: "programme-slug-test-secondary-year-10",
    });

    expect(lesson.browseData[0]?.lessonSlug).toEqual(fixtures[0]?.lesson_slug);
    expect(lesson.browseData[0]?.unitSlug).toEqual(fixtures[0]?.unit_slug);
    expect(lesson.browseData[0]?.programmeSlug).toEqual(
      fixtures[0]?.programme_slug,
    );
    expect(lesson.browseData[0]?.isLegacy).toEqual(fixtures[0]?.is_legacy);
  });

  test("it applies exclusions", async () => {
    const fixtures = [
      syntheticUnitvariantLessonsFixture({
        overrides: {
          unit_slug: "unit-slug-test",
          programme_slug: "programme-slug-secondary-year-10",
          actions: { exclusions: ["pupil"] },
        },
      }),
    ];

    if (!fixtures || fixtures.length < 1) {
      throw new Error("No fixtures found");
    }
    await expect(
      pupilLessonListingQuery({
        ...sdk,
        pupilLessonListing: jest.fn(
          () =>
            Promise.resolve({
              browseData: fixtures as PupilLessonListingQuery["browseData"],
            }) as Promise<PupilLessonListingQuery>,
        ),
        pupilLessonListingLessonContent: jest.fn(() =>
          Promise.resolve({
            data: fixtures.map((fixture) => ({
              lesson_slug: fixture.lesson_slug,
              exit_quiz: [{ id: "quiz1" }, { id: "quiz2" }],
            })),
          }),
        ),
      })({
        unitSlug: "test",
        programmeSlug: "programme-slug-test-secondary-year-10",
      }),
    ).rejects.toThrow("Resource not found");
  });

  test("it applies exclusions only if all versions excluded", async () => {
    const fixtures = [
      syntheticUnitvariantLessonsFixture({
        overrides: {
          unit_slug: "unit-slug-test",
          programme_slug: "programme-slug-secondary-year-10",
          actions: { exclusions: ["pupil"] },
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
      pupilLessonListingLessonContent: jest.fn(() =>
        Promise.resolve({
          data: fixtures.map((fixture) => ({
            lesson_slug: fixture.lesson_slug,
            exit_quiz: [{ id: "quiz1" }, { id: "quiz2" }],
          })),
        }),
      ),
    })({
      unitSlug: "test",
      programmeSlug: "programme-slug-test-secondary-year-10",
    });
    expect(lesson.browseData[0]?.lessonSlug).toEqual(fixtures[1]?.lesson_slug);
  });

  it("throws an error if the programmeSlug has the incorrect format", async () => {
    await expect(
      pupilLessonListingQuery({
        ...sdk,
        pupilLessonListing: jest.fn(
          () =>
            Promise.resolve({
              browseData: [],
              backLinkData: [],
            }) as Promise<PupilLessonListingQuery>,
        ),
      })({
        unitSlug: "test",
        programmeSlug: "programme-slug-test",
      }),
    ).rejects.toThrow("Resource not found");
  });
  test("throws a Zod error if the response is invalid", async () => {
    const _syntheticUnitvariantLessonsFixture =
      syntheticUnitvariantLessonsFixture({
        overrides: {
          lesson_slug: undefined,
          unit_slug: "unit-slug-test",
          programme_slug: "programme-slug-test-secondary-year-10",
        },
      });
    await expect(async () => {
      await pupilLessonListingQuery({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        pupilLessonListing: jest.fn(
          () =>
            Promise.resolve({
              browseData: [_syntheticUnitvariantLessonsFixture],
              backLinkData: [],
            }) as Promise<PupilLessonListingQuery>, // Add the correct return type
        ),
        pupilLessonListingLessonContent: jest.fn(() =>
          Promise.resolve({
            data: [
              {
                lesson_slug: _syntheticUnitvariantLessonsFixture.lesson_slug,
                exit_quiz: [{ id: "quiz1" }, { id: "quiz2" }],
              },
            ],
          }),
        ),
      })({
        unitSlug: "test",
        programmeSlug: "programme-slug-test-secondary-year-10",
      });
    }).rejects.toThrow();
  });
});
