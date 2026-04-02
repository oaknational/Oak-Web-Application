import {
  syntheticUnitvariantLessonsByKsFixture,
  lessonDataFixture,
  programmeFieldsFixture,
  lessonFixture,
} from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import teachersUnitOverviewQuery from "./teachersUnitOverview.query";
import {
  unitOverviewDataSchema,
  UnitSequence,
} from "./teachersUnitOverview.schema";

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
    lesson_data: lessonFixture({
      overrides: {
        lesson_id: 1,
        lesson_uid: "lesson-uid",
        title: "lesson-title-2",
        description: "lesson-description-2",
        slug: "lesson-slug-2",
        pupil_lesson_outcome: "pupil-lesson-outcome",
        key_learning_points: [{ key_learning_point: "" }],
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
    }),
  },
});

export const unitsInOtherProgrammesFixture = [
  {
    programme_slug: "programme-slug",
    programme_fields: programmeFieldsFixture(),
  },
];

const currentUnitSubjectCategoriesFixture = [
  {
    subjectCategories: [
      {
        id: 1,
        title: "Theology",
        slug: "theology",
      },
      {
        id: 2,
        title: "Philosophy",
        slug: "philosophy",
      },
    ],
  },
];

export const unitSequenceFixture: UnitSequence = [
  {
    unitSlug: "unit-1",
    unitTitle: "Unit 1",
    unitDescription: null,
    unitOrder: 1,
    nullUnitvariantId: 1,
    yearOrder: 1,
    year: "1",
  },
  {
    unitSlug: "unit-2",
    unitTitle: "Unit 2",
    unitDescription: null,
    unitOrder: 2,
    nullUnitvariantId: 2,
    yearOrder: 1,
    year: "1",
  },
  {
    unitSlug: "unit-3",
    unitTitle: "Unit 3",
    unitDescription: null,
    unitOrder: 3,
    nullUnitvariantId: 3,
    yearOrder: 1,
    year: "1",
  },
  {
    unitSlug: "unit-4",
    unitTitle: "Unit 4",
    unitDescription: null,
    unitOrder: 4,
    nullUnitvariantId: 4,
    yearOrder: 1,
    year: "1",
  },
];

describe("teachersUnitOverview", () => {
  it("throws a not found error if no lessons are found", async () => {
    await expect(async () => {
      await teachersUnitOverviewQuery({
        ...sdk,
        teachersUnitOverview: jest.fn(() =>
          Promise.resolve({
            lessons: [],
            unitSequence: unitSequenceFixture,
            unitsInOtherProgrammes: unitsInOtherProgrammesFixture,
            currentUnitSubjectCategories: currentUnitSubjectCategoriesFixture,
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  it("returns data in the correct shape", async () => {
    const res = await teachersUnitOverviewQuery({
      ...sdk,
      teachersUnitOverview: jest.fn(() =>
        Promise.resolve({
          lessons: [syntheticUnitvariantLessonsByKsFixture()],
          unitSequence: unitSequenceFixture,
          unitsInOtherProgrammes: unitsInOtherProgrammesFixture,
          currentUnitSubjectCategories: currentUnitSubjectCategoriesFixture,
        }),
      ),
    })({
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
    });

    expect(unitOverviewDataSchema.parse(res)).toEqual({
      programmeSlug: "programme-slug",
      keyStageSlug: "ks1",
      keyStageTitle: "Key Stage 1",
      subjectSlug: "maths",
      subjectTitle: "Maths",
      unitSlug: "unit-slug",
      unitTitle: "unit-title",
      unitDescription: null,
      unitIndex: 1,
      unitCount: 4,
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
      phaseSlug: "primary",
      phaseTitle: "Primary",
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
      nextUnit: {
        slug: "unit-2",
        title: "Unit 2",
      },
      prevUnit: null,
      tierOptionToggles: [],
      subjectOptionToggles: [],
    });
  });
  it("returns lessons in the correct order", async () => {
    const res = await teachersUnitOverviewQuery({
      ...sdk,
      teachersUnitOverview: jest.fn(() =>
        Promise.resolve({
          lessons: [unitPageFixture2, unitPageFixture],
          unitSequence: unitSequenceFixture,
          unitsInOtherProgrammes: unitsInOtherProgrammesFixture,
          currentUnitSubjectCategories: currentUnitSubjectCategoriesFixture,
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
      await teachersUnitOverviewQuery({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        teachersUnitOverview: jest.fn(() =>
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
            unitSequence: unitSequenceFixture,
            unitsInOtherProgrammes: unitsInOtherProgrammesFixture,
            currentUnitSubjectCategories: currentUnitSubjectCategoriesFixture,
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });
    }).rejects.toThrow(`lesson_slug`);
  });

  it("filters unit counts when subjectCategorySlug is provided", async () => {
    const res = await teachersUnitOverviewQuery({
      ...sdk,
      teachersUnitOverview: jest.fn(() =>
        Promise.resolve({
          lessons: [syntheticUnitvariantLessonsByKsFixture()],
          unitSequence: [
            {
              ...unitSequenceFixture[0]!,
              subjectCategories: ["Theology"],
            },
            {
              ...unitSequenceFixture[1]!,
              subjectCategories: ["Theology"],
            },
            {
              ...unitSequenceFixture[2]!,
              subjectCategories: ["Philosophy"],
            },
          ],
          unitsInOtherProgrammes: unitsInOtherProgrammesFixture,
          currentUnitSubjectCategories: currentUnitSubjectCategoriesFixture,
        }),
      ),
    })({
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
      subjectCategorySlug: "theology",
    });

    expect(res.unitCount).toBe(2);
    expect(res.unitIndex).toBe(1);
  });
});
