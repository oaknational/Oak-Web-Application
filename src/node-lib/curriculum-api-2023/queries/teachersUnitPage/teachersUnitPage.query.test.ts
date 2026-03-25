import {
  syntheticUnitvariantLessonsByKsFixture,
  lessonDataFixture,
} from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import teachersUnitPageQuery, {
  getPackagedUnit,
  getTransformedLessons,
} from "./teachersUnitPage.query";
import { unitPageDataSchema } from "./teachersUnitPage.schema";

const unitPageFixture = syntheticUnitvariantLessonsByKsFixture({
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
const unitPageFixture2 = syntheticUnitvariantLessonsByKsFixture({
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

describe("teachersUnitPage", () => {
  it("throws a not found error if no unit is found", async () => {
    await expect(async () => {
      await teachersUnitPageQuery({
        ...sdk,
        teachersUnitPage: jest.fn(() => Promise.resolve({ lessons: [] })),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  it("returns data in the correct shape", async () => {
    const res = await teachersUnitPageQuery({
      ...sdk,
      teachersUnitPage: jest.fn(() =>
        Promise.resolve({
          lessons: [syntheticUnitvariantLessonsByKsFixture()],
        }),
      ),
    })({
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
    });

    expect(unitPageDataSchema.parse(res)).toEqual({
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
      parentSubject: "Maths",
      actions: { isPePractical: false },
      containsGeorestrictedLessons: false,
      containsLoginRequiredLessons: false,
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
          orderInUnit: 1,
          actions: null,
          geoRestricted: false,
          loginRequired: false,
          isUnpublished: false,
          lessonReleaseDate: null,
        },
      ],
    });
  });
  it("returns lessons in the correct order", async () => {
    const res = await teachersUnitPageQuery({
      ...sdk,
      teachersUnitPage: jest.fn(() =>
        Promise.resolve({
          lessons: [unitPageFixture2, unitPageFixture],
        }),
      ),
    })({
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
    });

    expect(res.lessons[0]?.lessonTitle).toEqual("lesson-title");
    expect(res.lessons[1]?.lessonTitle).toEqual("lesson-title-2");
  });
  it("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await teachersUnitPageQuery({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        teachersUnitPage: jest.fn(() =>
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
    programmeFields: syntheticUnitvariantLessonsByKsFixture().programme_fields,
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
          geoRestricted: false,
          loginRequired: false,
          isUnpublished: false,
        },
      ],
      programmeSlug: "programme-slug",
      subjectSlug: "maths",
      subjectTitle: "Maths",
      parentSubject: "Maths",
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
      actions: { isPePractical: false },
      containsGeorestrictedLessons: false,
      containsLoginRequiredLessons: false,
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
          geoRestricted: false,
          loginRequired: false,
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
      actions: { isPePractical: false },
      containsGeorestrictedLessons: false,
      containsLoginRequiredLessons: false,
      parentSubject: "Maths",
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
        lessonSlug: "lesson-slug",
        lessonTitle: "lesson-title",
        orderInUnit: 1,
        presentationCount: 0,
        pupilLessonOutcome: "pupil-lesson-outcome",
        quizCount: 0,
        videoCount: 0,
        worksheetCount: 0,
        actions: null,
        geoRestricted: false,
        loginRequired: false,
        isUnpublished: false,
        lessonReleaseDate: null,
      },
    ]);
  });

  describe("isPePractical", () => {
    const baseLesson = {
      lessonSlug: "lesson-slug",
      lessonTitle: "lesson-title",
      description: "lesson-description",
      pupilLessonOutcome: "pupil-lesson-outcome",
      expired: false,
      quizCount: 0,
      videoCount: 0,
      presentationCount: 0,
      worksheetCount: 0,
      orderInUnit: 1,
      geoRestricted: false,
      loginRequired: false,
      isUnpublished: false,
      lessonReleaseDate: null,
    };

    test("sets isPePractical true when at least one lesson is practical", () => {
      const result = getPackagedUnit(
        mockPackagedUnitData,
        [
          { ...baseLesson, actions: { isPePractical: true } },
          {
            ...baseLesson,
            lessonSlug: "lesson-2",
            actions: {},
          },
        ],
        false,
        false,
      );
      expect(result.actions?.isPePractical).toBe(true);
    });

    test("sets isPePractical false when no lessons are practical", () => {
      const result = getPackagedUnit(
        mockPackagedUnitData,
        [
          { ...baseLesson, actions: {} },
          { ...baseLesson, lessonSlug: "lesson-2", actions: null },
        ],
        false,
        false,
      );
      expect(result.actions?.isPePractical).toBe(false);
    });

    test("excludes unpublished lessons when determining isPePractical", () => {
      const result = getPackagedUnit(
        mockPackagedUnitData,
        [
          { ...baseLesson, actions: {} },
          {
            lessonSlug: "lesson-2",
            lessonTitle: "lesson-title-2",
            orderInUnit: 2,
            isUnpublished: true,
            lessonReleaseDate: null,
            expired: false,
          },
        ],
        false,
        false,
      );
      expect(result.actions?.isPePractical).toBe(false);
    });
  });
});
