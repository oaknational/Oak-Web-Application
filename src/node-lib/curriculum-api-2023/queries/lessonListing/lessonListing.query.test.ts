import { syntheticUnitvariantLessonsFixture } from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import lessonListing, {
  getTransformedLessons,
  getTransformedUnit,
} from "./lessonListing.query";
import lessonListingSchema from "./lessonListing.schema";

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

    test("it returns data in the correct shape", async () => {
      const res = await lessonListing({
        ...sdk,
        lessonListing: jest.fn(() =>
          Promise.resolve({
            unit: [syntheticUnitvariantLessonsFixture()],
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });

      expect(lessonListingSchema.parse(res)).toEqual({
        programmeSlug: "programme-slug",
        keyStageSlug: "ks1",
        keyStageTitle: "Key stage 1",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        unitSlug: "unit-slug",
        unitTitle: "unit-title",
        tierSlug: null,
        tierTitle: null,
        examBoardSlug: null,
        examBoardTitle: null,
        yearTitle: "Year 1",
        lessons: [
          {
            lessonSlug: "lesson-slug",
            lessonTitle: "lesson-title",
            description: "lesson-description",
            pupilLessonOutcome: "pupil-lesson-outcome",
            expired: false,
            quizCount: 0,
            videoCount: 0,
            presentationCount: 0,
            worksheetCount: 0,
            hasCopyrightMaterial: false,
            orderInUnit: 1,
            lessonCohort: "2023-2024",
          },
        ],
      });
    });
    test("it returns lessons in the correct order", async () => {
      const lessonListingFixture2 = syntheticUnitvariantLessonsFixture({
        overrides: {
          supplementary_data: { unit_order: 2, order_in_unit: 2 },
          lesson_data: {
            lesson_id: 1,
            lesson_uid: "lesson-uid",
            title: "lesson-title-2",
            description: "lesson-description-2",
            slug: "lesson-slug",
            pupil_lesson_outcome: "pupil-lesson-outcome",
            key_learning_points: [{}],
            equipment_and_resources: null,
            content_guidance_details: null,
            content_guidance: null,
            supervision_level: null,
            thirdpartycontent_list: null,
            misconceptions_and_common_mistakes: null,
            keywords: null,
            video_id: null,
            sign_language_video_id: null,
            quiz_id_starter: null,
            quiz_id_exit: null,
            asset_id_slidedeck: null,
            asset_id_worksheet: null,
            copyright_content: null,
            _state: "published",
            _cohort: "2023-2024",
            deprecated_fields: null,
          },
        },
      });

      const res = await lessonListing({
        ...sdk,
        lessonListing: jest.fn(() =>
          Promise.resolve({
            unit: [lessonListingFixture2, syntheticUnitvariantLessonsFixture()],
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });

      expect(res.lessons[0]?.lessonTitle).toEqual("lesson-title");
      expect(res.lessons[1]?.lessonTitle).toEqual("lesson-title-2");
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
  describe("transform functions ", () => {
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
