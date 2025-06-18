import {
  lessonDataFixture,
  syntheticUnitvariantLessonsByKsFixture,
} from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import lessonListing, {
  getTransformedLessons,
  getPackagedUnit,
} from "./lessonListing.query";
import { lessonListingPageDataSchema } from "./lessonListing.schema";

describe("lessonListing()", () => {
  describe("lessonListing query", () => {
    test("throws a not found error if no unit is found", async () => {
      await expect(async () => {
        await lessonListing({
          ...sdk,
          lessonListing: jest.fn(() => Promise.resolve({ lessons: [] })),
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
            lessons: [
              syntheticUnitvariantLessonsByKsFixture({
                overrides: {
                  lesson_data: {
                    ...lessonDataFixture(),
                    lesson_release_date: "2023-01-01T00:00:00.000Z",
                  },
                },
              }),
            ],
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });

      expect(lessonListingPageDataSchema.parse(res)).toEqual({
        programmeSlug: "programme-slug",
        keyStageSlug: "ks1",
        keyStageTitle: "Key Stage 1",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        unitSlug: "unit-slug",
        unitTitle: "unit-title",
        unitvariantId: 1,
        tierSlug: null,
        tierTitle: null,
        examBoardSlug: null,
        examBoardTitle: null,
        yearTitle: "Year 1",
        yearSlug: "year-1",
        year: "1",
        pathwaySlug: null,
        pathwayTitle: null,
        pathwayDisplayOrder: null,
        actions: {},
        containsGeorestrictedLessons: false,
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
            actions: null,
            isUnpublished: false,
            lessonReleaseDate: "2023-01-01T00:00:00.000Z",
          },
        ],
      });
    });
    test("it returns lessons in the correct order", async () => {
      const lessonListingFixture2 = syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          order_in_unit: 2,
          static_lesson_list: [
            { slug: "lesson-slug-2", title: "lesson-title-2", order: 2 },
            { slug: "lesson-slug", title: "lesson-title", order: 1 },
          ],
          lesson_slug: "lesson-slug-2",
          lesson_data: {
            lesson_id: 1,
            lesson_uid: "lesson-uid",
            title: "lesson-title-2",
            description: "lesson-description-2",
            slug: "lesson-slug-2",
            pupil_lesson_outcome: "pupil-lesson-outcome",
            key_learning_points: [{}],
            equipment_and_resources: null,
            content_guidance_details: null,
            phonics_outcome: null,
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
            updated_at: "2023-01-01T00:00:00.000Z",
            deprecated_fields: null,
            expiration_date: null,
            lesson_release_date: "2023-01-01T00:00:00.000Z",
          },
        },
      });
      const lessonListingFixture = syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          static_lesson_list: [
            {
              slug: "lesson-slug-2",
              title: "lesson-title-2",
              order: 2,
            },
            { slug: "lesson-slug", title: "lesson-title", order: 1 },
          ],
          lesson_data: {
            ...lessonDataFixture(),
            lesson_release_date: "2023-01-01T00:00:00.000Z",
          },
        },
      });
      const res = await lessonListing({
        ...sdk,
        lessonListing: jest.fn(() =>
          Promise.resolve({
            lessons: [lessonListingFixture2, lessonListingFixture],
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
              lessons: [
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
    const mockPackagedUnitData = {
      programmeFields:
        syntheticUnitvariantLessonsByKsFixture().programme_fields,
      unitSlug: "unit-slug",
      programmeSlug: "programme-slug",
      unitvariantId: 1,
      unitTitle:
        syntheticUnitvariantLessonsByKsFixture().programme_fields.optionality ??
        syntheticUnitvariantLessonsByKsFixture().unit_data.title,
      programmeSlugByYear:
        syntheticUnitvariantLessonsByKsFixture().programme_slug_by_year,
    };
    test("getTransformedUnit returns the correct data", async () => {
      const transformedLessons = getPackagedUnit(
        mockPackagedUnitData,
        getTransformedLessons([syntheticUnitvariantLessonsByKsFixture({})]),
        false,
      );
      expect(transformedLessons).toEqual({
        examBoardSlug: null,
        examBoardTitle: null,
        keyStageSlug: "ks1",
        keyStageTitle: "Key Stage 1",
        lessons: [
          {
            description: "lesson-description",
            expired: false,
            hasCopyrightMaterial: false,
            lessonCohort: "2023-2024",
            lessonReleaseDate: null,
            lessonSlug: "lesson-slug",
            lessonTitle: "lesson-title",
            orderInUnit: 1,
            presentationCount: 0,
            pupilLessonOutcome: "pupil-lesson-outcome",
            quizCount: 0,
            videoCount: 0,
            worksheetCount: 0,
            actions: null,
            isUnpublished: false,
          },
        ],
        programmeSlug: "programme-slug",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        tierSlug: null,
        tierTitle: null,
        unitSlug: "unit-slug",
        unitTitle: "unit-title",
        unitvariantId: 1,
        yearTitle: "Year 1",
        yearSlug: "year-1",
        year: "1",
        pathwaySlug: null,
        pathwayTitle: null,
        pathwayDisplayOrder: null,
        actions: {},
        containsGeorestrictedLessons: false,
      });
    });
    test("getTransformedUnit returns the correct data for optionality units", () => {
      const pfs = syntheticUnitvariantLessonsByKsFixture().programme_fields;
      const transformedLessons = getPackagedUnit(
        mockPackagedUnitData,
        getTransformedLessons([
          syntheticUnitvariantLessonsByKsFixture({
            overrides: {
              programme_fields: {
                ...pfs,
                optionality: "optional",
              },
            },
          }),
        ]),
        false,
      );
      expect(transformedLessons).toEqual({
        examBoardSlug: null,
        examBoardTitle: null,
        keyStageSlug: "ks1",
        keyStageTitle: "Key Stage 1",
        lessons: [
          {
            description: "lesson-description",
            expired: false,
            hasCopyrightMaterial: false,
            lessonCohort: "2023-2024",
            lessonReleaseDate: null,
            lessonSlug: "lesson-slug",
            lessonTitle: "lesson-title",
            orderInUnit: 1,
            presentationCount: 0,
            pupilLessonOutcome: "pupil-lesson-outcome",
            quizCount: 0,
            videoCount: 0,
            worksheetCount: 0,
            actions: null,
            isUnpublished: false,
          },
        ],
        programmeSlug: "programme-slug",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        tierSlug: null,
        tierTitle: null,
        unitSlug: "unit-slug",
        unitTitle: "unit-title",
        unitvariantId: 1,
        yearTitle: "Year 1",
        yearSlug: "year-1",
        year: "1",
        pathwaySlug: null,
        pathwayTitle: null,
        pathwayDisplayOrder: null,
        actions: {},
        containsGeorestrictedLessons: false,
      });
    });
    test("getTransformedLessons returns the correct data", async () => {
      const transformedLessons = getTransformedLessons([
        syntheticUnitvariantLessonsByKsFixture(),
      ]);
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
          actions: null,
          isUnpublished: false,
          lessonReleaseDate: null,
        },
      ]);
    });
  });
});
