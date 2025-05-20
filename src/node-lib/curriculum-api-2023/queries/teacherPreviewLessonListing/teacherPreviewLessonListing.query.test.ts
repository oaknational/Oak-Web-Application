import { syntheticUnitvariantLessonsByKsFixture } from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import teacherPreviewLessonListing, {
  getTransformedLessons,
  getPackagedUnit,
} from "./teacherPreviewLessonListing.query";

import { lessonListingPageDataSchema } from "@/node-lib/curriculum-api-2023/queries/lessonListing/lessonListing.schema";

describe("teacherPreviewLessonListing()", () => {
  describe("teacherPreviewLessonListing query", () => {
    test("throws a not found error if no unit is found", async () => {
      await expect(async () => {
        await teacherPreviewLessonListing({
          ...sdk,
          teacherPreviewLessonListing: jest.fn(() =>
            Promise.resolve({ lessons: [] }),
          ),
        })({
          programmeSlug: "programme-slug",
          unitSlug: "unit-slug",
        });
      }).rejects.toThrow(`Resource not found`);
    });

    test("it returns data in the correct shape", async () => {
      const res = await teacherPreviewLessonListing({
        ...sdk,
        teacherPreviewLessonListing: jest.fn(() =>
          Promise.resolve({
            lessons: [syntheticUnitvariantLessonsByKsFixture()],
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
        pathwaySlug: null,
        pathwayTitle: null,
        pathwayDisplayOrder: null,
        actions: {},
        lessons: [
          {
            lessonSlug: "lesson-slug",
            lessonTitle: "lesson-title",
            isUnpublished: true,
            orderInUnit: 1,
            lessonReleaseDate: "unreleased",
          },
        ],
      });
    });
    test("it returns lessons in the correct order", async () => {
      const lessonListingFixture2 = syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          order_in_unit: 2,
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
            lesson_release_date: null,
          },
        },
      });

      const res = await teacherPreviewLessonListing({
        ...sdk,
        teacherPreviewLessonListing: jest.fn(() =>
          Promise.resolve({
            lessons: [
              lessonListingFixture2,
              syntheticUnitvariantLessonsByKsFixture(),
            ],
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
        await teacherPreviewLessonListing({
          ...sdk,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          teacherPreviewLessonListing: jest.fn(() =>
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
            lessonReleaseDate: "unreleased",
            lessonSlug: "lesson-slug",
            lessonTitle: "lesson-title",
            orderInUnit: 1,
            presentationCount: 0,
            isUnpublished: true,
            pupilLessonOutcome: "pupil-lesson-outcome",
            quizCount: 0,
            videoCount: 0,
            worksheetCount: 0,
            actions: null,
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
        pathwaySlug: null,
        pathwayTitle: null,
        pathwayDisplayOrder: null,
        actions: {},
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
            isUnpublished: true,
            lessonCohort: "2023-2024",
            lessonReleaseDate: "unreleased",
            lessonSlug: "lesson-slug",
            lessonTitle: "lesson-title",
            orderInUnit: 1,
            presentationCount: 0,
            pupilLessonOutcome: "pupil-lesson-outcome",
            quizCount: 0,
            videoCount: 0,
            worksheetCount: 0,
            actions: null,
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
        pathwaySlug: null,
        pathwayTitle: null,
        pathwayDisplayOrder: null,
        actions: {},
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
          lessonReleaseDate: "unreleased",
          lessonSlug: "lesson-slug",
          lessonTitle: "lesson-title",
          orderInUnit: 1,
          presentationCount: 0,
          pupilLessonOutcome: "pupil-lesson-outcome",
          quizCount: 0,
          videoCount: 0,
          worksheetCount: 0,
          actions: null,
        },
      ]);
    });
  });
});
