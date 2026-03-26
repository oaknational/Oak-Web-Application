import { syntheticUnitvariantLessonsByKsFixture } from "@oaknational/oak-curriculum-schema";

import {
  getNeighbourUnits,
  getPackagedUnit,
  getTransformedLessons,
} from "./helpers";
import { unitSequenceFixture } from "./teachersUnitPage.query.test";

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
  nullUnitvariantId: 1,
};

describe("getTransformedUnit", () => {
  it("getTransformedUnit returns the correct data", async () => {
    const transformedLessons = getPackagedUnit(
      mockPackagedUnitData,
      getTransformedLessons([syntheticUnitvariantLessonsByKsFixture({})]),
      false,
      false,
      unitSequenceFixture,
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
      nextUnit: {
        slug: "unit-2",
        title: "Unit 2",
      },
      prevUnit: undefined,
    });
  });
  it("getTransformedUnit returns the correct data for optionality units", () => {
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
      unitSequenceFixture,
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
      nextUnit: {
        slug: "unit-2",
        title: "Unit 2",
      },
      prevUnit: undefined,
    });
  });
});

describe("getNeighbourUnits", () => {
  it("gets the previous unit", () => {
    const transformedLessons = getPackagedUnit(
      { ...mockPackagedUnitData, nullUnitvariantId: 3 },
      getTransformedLessons([syntheticUnitvariantLessonsByKsFixture({})]),
      false,
      false,
      unitSequenceFixture,
    );

    expect(transformedLessons.prevUnit).toEqual({
      slug: "unit-2",
      title: "Unit 2",
    });
  });
  it("gets the next optionality unit", () => {
    const transformedLessons = getPackagedUnit(
      { ...mockPackagedUnitData, nullUnitvariantId: 4 },
      getTransformedLessons([syntheticUnitvariantLessonsByKsFixture({})]),
      false,
      false,
      unitSequenceFixture.concat({
        unitSlug: "unit-slug",
        unitTitle: "Null Title",
        optionalityTitle: "Optionality title",
        unitOrder: 5,
        nullUnitvariantId: 5,
      }),
    );

    expect(transformedLessons.nextUnit).toEqual({
      title: "Optionality title",
      slug: "unit-slug",
    });
  });
  it("gets the previous optionality unit", () => {
    const result = getNeighbourUnits({
      unitSequenceData: [
        ...unitSequenceFixture,
        {
          unitSlug: "unit-slug",
          unitTitle: "Null Title",
          optionalityTitle: "Optionality title",
          unitOrder: 5,
          nullUnitvariantId: 5,
        },
        {
          unitSlug: "unit-slug",
          unitTitle: "Unit Title",
          unitOrder: 6,
          nullUnitvariantId: 6,
        },
      ],
      nullUnitvariantId: 6,
    });

    expect(result.prevUnit).toEqual({
      title: "Optionality title",
      slug: "unit-slug",
    });
  });
  it("gets the next unit when order is non sequential", () => {
    const result = getNeighbourUnits({
      unitSequenceData: [
        ...unitSequenceFixture,
        {
          unitOrder: 6,
          unitSlug: "next-slug",
          unitTitle: "Next unit",
          nullUnitvariantId: 6,
        },
      ],
      nullUnitvariantId: 4,
    });

    expect(result.nextUnit).toEqual({
      slug: "next-slug",
      title: "Next unit",
    });
  });
  it("gets the previous unit when the order is non sequential", () => {
    const result = getNeighbourUnits({
      unitSequenceData: [
        {
          unitOrder: 2,
          unitSlug: "prev-slug",
          unitTitle: "Prev unit",
          nullUnitvariantId: 2,
        },
        {
          unitOrder: 5,
          unitSlug: "current-slug",
          unitTitle: "Current unit",
          nullUnitvariantId: 5,
        },
        {
          unitOrder: 6,
          unitSlug: "next-slug",
          unitTitle: "Next unit",
          nullUnitvariantId: 6,
        },
      ],
      nullUnitvariantId: 5,
    });
    expect(result.prevUnit).toEqual({ slug: "prev-slug", title: "Prev unit" });
  });
});

describe("getTransformedLesons", () => {
  it("getTransformedLessons returns the correct data", async () => {
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

  it("sets isPePractical true when at least one lesson is practical", () => {
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
      unitSequenceFixture,
    );
    expect(result.actions?.isPePractical).toBe(true);
  });

  it("sets isPePractical false when no lessons are practical", () => {
    const result = getPackagedUnit(
      mockPackagedUnitData,
      [
        { ...baseLesson, actions: {} },
        { ...baseLesson, lessonSlug: "lesson-2", actions: null },
      ],
      false,
      false,
      unitSequenceFixture,
    );
    expect(result.actions?.isPePractical).toBe(false);
  });

  it("excludes unpublished lessons when determining isPePractical", () => {
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
      unitSequenceFixture,
    );
    expect(result.actions?.isPePractical).toBe(false);
  });
});
