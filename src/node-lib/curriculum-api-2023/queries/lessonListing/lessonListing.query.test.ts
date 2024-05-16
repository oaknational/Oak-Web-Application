import { syntheticUnitvariantLessonsFixture } from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import lessonListing, {
  getTransformedLessons,
  getTransformedUnit,
} from "./lessonListing.query";

describe("lessonListing()", () => {
  describe("lessonListing query", () => {
    test("throws a not found error if no unit is found", async () => {
      await expect(async () => {
        await lessonListing({
          ...sdk,
          lessonListing: jest.fn(() => Promise.resolve({ unit: [] })),
        })({
          programmeSlug: "programme-slug",
          unitSlug: "unit-slug",
        });
      }).rejects.toThrow(`Resource not found`);
    });

    test("throws a Zod error if the response is invalid", async () => {
      await expect(async () => {
        await lessonListing({
          ...sdk,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          lessonListing: jest.fn(() =>
            Promise.resolve({
              unit: [
                {
                  programmeSlug: "programme-slug",
                  unitTitle: "unit-title",
                  subjectSlug: "subject-slug",
                  subjectTitle: "subject-title",
                  keyStageSlug: "key-stage-slug",
                  keyStageTitle: "key-stage-title",
                  lessons: [],
                },
              ],
            }),
          ),
        })({
          programmeSlug: "programme-slug",
          unitSlug: "unit-slug",
        });
      }).rejects.toThrow(`lesson_slug`);
    });
  });
  describe("transform functions", () => {
    test("getTransformedUnit returns the correct data", async () => {
      const transformedLessons = getTransformedUnit(
        syntheticUnitvariantLessonsFixture(),
        [],
      );
      expect(transformedLessons).toEqual({
        examBoardSlug: null,
        examBoardTitle: null,
        keyStageSlug: "ks1",
        keyStageTitle: "Key stage 1",
        lessons: [],
        programmeSlug: "programme-slug",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        tierSlug: null,
        tierTitle: null,
        unitSlug: "unit-slug",
        unitTitle: "unit-title",
        yearTitle: "Year 1",
      });
    });
    test("getTransformedLessons returns the correct data", async () => {
      const transformedLessons = getTransformedLessons({
        unit: [syntheticUnitvariantLessonsFixture()],
      });
      expect(transformedLessons).toEqual([
        {
          description: "lesson-description",
          expired: false,
          hasCopyrightMaterial: false,
          lessonCohort: "2023-2024",
          lessonSlug: "lesson-slug",
          lessonTitle: "lesson-title",
          orderInUnit: 1,
          presentationCount: 0,
          pupilLessonOutcome: "pupil-lesson-outcome",
          quizCount: 0,
          videoCount: 0,
          worksheetCount: 0,
        },
      ]);
    });
  });
});
