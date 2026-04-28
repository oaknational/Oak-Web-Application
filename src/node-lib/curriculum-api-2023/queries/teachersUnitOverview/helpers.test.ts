import {
  programmeFieldsFixture,
  syntheticUnitvariantLessonsByKsFixture,
} from "@oaknational/oak-curriculum-schema";

import {
  getAdjacentUnits,
  getPackagedUnit,
  getProgrammeToggles,
  getTransformedLessons,
  getUnitCounts,
} from "./helpers";
import {
  threadsFixture,
  unitSequenceFixture,
  unitsInOtherProgrammesFixture,
} from "./teachersUnitOverview.query.test";
import type { UnitSequence } from "./teachersUnitOverview.schema";

const mockPackagedUnitData = {
  programmeFields: syntheticUnitvariantLessonsByKsFixture().programme_fields,
  unitSlug: "unit-slug",
  programmeSlug: "programme-slug",
  unitvariantId: 1,
  unitTitle:
    syntheticUnitvariantLessonsByKsFixture().programme_fields.optionality ??
    syntheticUnitvariantLessonsByKsFixture().unit_data.title,
  unitDescription:
    syntheticUnitvariantLessonsByKsFixture().unit_data.description,
  programmeSlugByYear:
    syntheticUnitvariantLessonsByKsFixture().programme_slug_by_year,
  nullUnitvariantId: 1,
  subjectCategories: [],
  whyThisWhyNow: "why this why now",
  priorKnowledgeRequirements: ["prior", "knowledge", "requirements"],
};

describe("getTransformedUnit", () => {
  it("getTransformedUnit returns the correct data", async () => {
    const transformedLessons = getPackagedUnit({
      packagedUnitData: mockPackagedUnitData,
      unitLessons: getTransformedLessons([
        syntheticUnitvariantLessonsByKsFixture({}),
      ]),
      containsGeorestrictedLessons: false,
      containsLoginRequiredLessons: false,
      unitSequenceData: unitSequenceFixture,
      unitsInOtherProgrammes: unitsInOtherProgrammesFixture,
      threads: threadsFixture,
    });
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
      subjectCategories: [],
      parentSubject: "Maths",
      tierSlug: null,
      tierTitle: null,
      unitSlug: "unit-slug",
      unitTitle: "unit-title",
      unitDescription: null,
      unitIndex: 1,
      unitCount: 4,
      unitvariantId: 1,
      yearGroupTitle: "Year 1",
      yearSlug: "year-1",
      year: "1",
      pathwaySlug: null,
      pathwayTitle: null,
      pathwayDisplayOrder: null,
      actions: { isPePractical: false },
      phaseSlug: "primary",
      phaseTitle: "Primary",
      threads: ["Thread 1", "Thread 2", "Thread 3"],
      whyThisWhyNow: "why this why now",
      priorKnowledgeRequirements: ["prior", "knowledge", "requirements"],
      containsGeorestrictedLessons: false,
      containsLoginRequiredLessons: false,
      nextUnit: {
        slug: "unit-2",
        title: "Unit 2",
      },
      prevUnit: null,
      tierOptionToggles: [],
      subjectOptionToggles: [],
    });
  });
  it("getTransformedUnit returns the correct data for optionality units", () => {
    const pfs = syntheticUnitvariantLessonsByKsFixture().programme_fields;

    const transformedLessons = getPackagedUnit({
      packagedUnitData: mockPackagedUnitData,
      unitLessons: getTransformedLessons([
        syntheticUnitvariantLessonsByKsFixture({
          overrides: {
            programme_fields: {
              ...pfs,
              optionality: "optional",
            },
          },
        }),
      ]),
      containsGeorestrictedLessons: false,
      containsLoginRequiredLessons: false,
      unitSequenceData: unitSequenceFixture,
      unitsInOtherProgrammes: unitsInOtherProgrammesFixture,
      threads: threadsFixture,
    });
    expect(transformedLessons).toEqual({
      examBoardSlug: null,
      examBoardTitle: null,
      keyStageSlug: "ks1",
      keyStageTitle: "Key Stage 1",
      subjectCategories: [],
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
      unitDescription: null,
      unitIndex: 1,
      unitCount: 4,
      unitvariantId: 1,
      yearGroupTitle: "Year 1",
      yearSlug: "year-1",
      year: "1",
      pathwaySlug: null,
      pathwayTitle: null,
      pathwayDisplayOrder: null,
      phaseSlug: "primary",
      phaseTitle: "Primary",
      actions: { isPePractical: false },
      containsGeorestrictedLessons: false,
      containsLoginRequiredLessons: false,
      threads: ["Thread 1", "Thread 2", "Thread 3"],
      whyThisWhyNow: "why this why now",
      priorKnowledgeRequirements: ["prior", "knowledge", "requirements"],
      parentSubject: "Maths",
      nextUnit: {
        slug: "unit-2",
        title: "Unit 2",
      },
      prevUnit: null,
      tierOptionToggles: [],
      subjectOptionToggles: [],
    });
  });

  it("sets unitCount for the current unit's year", () => {
    const sequence = unitSequenceFixture.slice(0, 2);
    const result = getPackagedUnit({
      packagedUnitData: mockPackagedUnitData,
      unitLessons: getTransformedLessons([
        syntheticUnitvariantLessonsByKsFixture({}),
      ]),
      containsGeorestrictedLessons: false,
      containsLoginRequiredLessons: false,
      unitSequenceData: sequence,
      unitsInOtherProgrammes: unitsInOtherProgrammesFixture,
      threads: threadsFixture,
    });
    expect(result.unitCount).toBe(sequence.length);
  });

  it("does not include units from other years in unitCount", () => {
    const result = getPackagedUnit({
      packagedUnitData: { ...mockPackagedUnitData, nullUnitvariantId: 20 },
      unitLessons: getTransformedLessons([
        syntheticUnitvariantLessonsByKsFixture({}),
      ]),
      containsGeorestrictedLessons: false,
      containsLoginRequiredLessons: false,
      unitSequenceData: [
        ...unitSequenceFixture,
        {
          unitSlug: "unit-20",
          unitTitle: "Unit 20",
          unitDescription: null,
          unitOrder: 1,
          nullUnitvariantId: 20,
          yearOrder: 2,
          year: "7",
          actions: null,
        },
        {
          unitSlug: "unit-21",
          unitTitle: "Unit 21",
          unitDescription: null,
          unitOrder: 2,
          nullUnitvariantId: 21,
          yearOrder: 2,
          year: "7",
          actions: null,
        },
      ],
      unitsInOtherProgrammes: unitsInOtherProgrammesFixture,
      threads: threadsFixture,
    });

    expect(result.unitCount).toBe(2);
  });
});

describe("getUnitCounts", () => {
  it("returns unitCount for the current unit's year", () => {
    const sequence = unitSequenceFixture.slice(0, 2);
    const result = getUnitCounts({
      unitSequenceData: sequence,
      nullUnitvariantId: sequence[0]!.nullUnitvariantId,
    });
    expect(result.unitCount).toBe(sequence.length);
  });

  it("does not include units from other years in unitCount", () => {
    const sequence: UnitSequence = [
      ...unitSequenceFixture,
      {
        unitSlug: "unit-20",
        unitTitle: "Unit 20",
        unitDescription: null,
        unitOrder: 1,
        nullUnitvariantId: 20,
        yearOrder: 2,
        year: "7",
        actions: null,
      },
      {
        unitSlug: "unit-21",
        unitTitle: "Unit 21",
        unitDescription: null,
        unitOrder: 2,
        nullUnitvariantId: 21,
        yearOrder: 2,
        year: "7",
        actions: null,
      },
    ];
    const result = getUnitCounts({
      unitSequenceData: sequence,
      nullUnitvariantId: 20,
    });

    expect(result.unitCount).toBe(2);
  });

  it("deduplicates optionality variants when counting units", () => {
    const sequence: UnitSequence = [
      {
        unitSlug: "unit-1-core",
        unitTitle: "Unit 1",
        unitDescription: null,
        unitOrder: 1,
        nullUnitvariantId: 1,
        yearOrder: 1,
        year: "7",
        actions: null,
      },
      {
        unitSlug: "unit-2-core",
        unitTitle: "Unit 2",
        unitDescription: null,
        unitOrder: 2,
        nullUnitvariantId: 2,
        yearOrder: 1,
        year: "7",
        actions: null,
      },
      {
        unitSlug: "unit-2-optionality",
        unitTitle: "Unit 2",
        unitDescription: null,
        optionalityTitle: "Stretch",
        unitOrder: 2,
        nullUnitvariantId: 2,
        yearOrder: 1,
        year: "7",
        actions: null,
      },
      {
        unitSlug: "unit-3-core",
        unitTitle: "Unit 3",
        unitDescription: null,
        unitOrder: 3,
        nullUnitvariantId: 3,
        yearOrder: 1,
        year: "7",
        actions: null,
      },
    ];

    const result = getUnitCounts({
      unitSequenceData: sequence,
      nullUnitvariantId: 2,
    });

    expect(result.unitCount).toBe(3);
    expect(result.unitIndex).toBe(2);
  });

  it("filters out swimming units for non-swimming units", () => {
    const sequence: UnitSequence = [
      {
        unitSlug: "unit-1",
        unitTitle: "Unit 1",
        unitDescription: null,
        unitOrder: 1,
        nullUnitvariantId: 1,
        yearOrder: 1,
        year: "7",
        actions: null,
      },
      {
        unitSlug: "swimming-and-water-safety-1",
        unitTitle: "Swimming and water safety 1",
        unitDescription: null,
        unitOrder: 2,
        nullUnitvariantId: 2,
        yearOrder: 1,
        year: "7",
        actions: null,
        isSwimming: true,
      },
      {
        unitSlug: "unit-3",
        unitTitle: "Unit 3",
        unitDescription: null,
        unitOrder: 3,
        nullUnitvariantId: 3,
        yearOrder: 1,
        year: "7",
        actions: null,
      },
    ];

    const result = getUnitCounts({
      unitSequenceData: sequence,
      nullUnitvariantId: 1,
    });

    expect(result.unitCount).toBe(2);
    expect(result.unitIndex).toBe(1);
  });

  it("counts only swimming units for swimming units", () => {
    const sequence: UnitSequence = [
      {
        unitSlug: "unit-1",
        unitTitle: "Unit 1",
        unitDescription: null,
        unitOrder: 1,
        nullUnitvariantId: 1,
        yearOrder: 1,
        year: "7",
        actions: null,
      },
      {
        unitSlug: "swimming-and-water-safety-1",
        unitTitle: "Swimming and water safety 1",
        unitDescription: null,
        unitOrder: 2,
        nullUnitvariantId: 2,
        yearOrder: 1,
        year: "7",
        actions: null,
        isSwimming: true,
      },
      {
        unitSlug: "swimming-and-water-safety-2",
        unitTitle: "Swimming and water safety 2",
        unitDescription: null,
        unitOrder: 4,
        nullUnitvariantId: 4,
        yearOrder: 1,
        year: "7",
        actions: null,
        isSwimming: true,
      },
      {
        unitSlug: "unit-3",
        unitTitle: "Unit 3",
        unitDescription: null,
        unitOrder: 3,
        nullUnitvariantId: 3,
        yearOrder: 1,
        year: "7",
        actions: null,
      },
    ];

    const result = getUnitCounts({
      unitSequenceData: sequence,
      nullUnitvariantId: 4,
    });

    expect(result.unitCount).toBe(2);
    expect(result.unitIndex).toBe(2);
  });

  it("filters to overlapping subject categories when subject category grouping is enabled", () => {
    const sequence: UnitSequence = [
      {
        unitSlug: "grammar-1",
        unitTitle: "Grammar 1",
        unitDescription: null,
        unitOrder: 1,
        nullUnitvariantId: 1,
        yearOrder: 1,
        year: "7",
        subjectCategories: ["Grammar"],
        actions: {
          subject_category_actions: {
            group_by_subjectcategory: true,
            all_disabled: false,
            default_category_id: 1,
          },
        },
      },
      {
        unitSlug: "grammar-2",
        unitTitle: "Grammar 2",
        unitDescription: null,
        unitOrder: 2,
        nullUnitvariantId: 2,
        yearOrder: 1,
        year: "7",
        subjectCategories: ["Grammar"],
        actions: null,
      },
      {
        unitSlug: "writing-1",
        unitTitle: "Writing 1",
        unitDescription: null,
        unitOrder: 3,
        nullUnitvariantId: 3,
        yearOrder: 1,
        year: "7",
        subjectCategories: ["Writing"],
        actions: null,
      },
    ];

    const result = getUnitCounts({
      unitSequenceData: sequence,
      nullUnitvariantId: 1,
    });

    expect(result.unitCount).toBe(2);
    expect(result.unitIndex).toBe(1);
  });

  it("does not filter by subject category when grouping is disabled", () => {
    const sequence: UnitSequence = [
      {
        unitSlug: "grammar-1",
        unitTitle: "Grammar 1",
        unitDescription: null,
        unitOrder: 1,
        nullUnitvariantId: 1,
        yearOrder: 1,
        year: "7",
        subjectCategories: ["Grammar"],
        actions: {
          subject_category_actions: {
            group_by_subjectcategory: false,
            all_disabled: false,
            default_category_id: 1,
          },
        },
      },
      {
        unitSlug: "grammar-2",
        unitTitle: "Grammar 2",
        unitDescription: null,
        unitOrder: 2,
        nullUnitvariantId: 2,
        yearOrder: 1,
        year: "7",
        subjectCategories: ["Grammar"],
        actions: null,
      },
      {
        unitSlug: "writing-1",
        unitTitle: "Writing 1",
        unitDescription: null,
        unitOrder: 3,
        nullUnitvariantId: 3,
        yearOrder: 1,
        year: "7",
        subjectCategories: ["Writing"],
        actions: null,
      },
    ];

    const result = getUnitCounts({
      unitSequenceData: sequence,
      nullUnitvariantId: 1,
    });

    expect(result.unitCount).toBe(3);
    expect(result.unitIndex).toBe(1);
  });
});

describe("getAdjacentUnits", () => {
  it("gets the previous unit", () => {
    const transformedLessons = getPackagedUnit({
      packagedUnitData: { ...mockPackagedUnitData, nullUnitvariantId: 3 },
      unitLessons: getTransformedLessons([
        syntheticUnitvariantLessonsByKsFixture({}),
      ]),
      containsGeorestrictedLessons: false,
      containsLoginRequiredLessons: false,
      unitSequenceData: unitSequenceFixture,
      unitsInOtherProgrammes: unitsInOtherProgrammesFixture,
      threads: threadsFixture,
    });

    expect(transformedLessons.prevUnit).toEqual({
      slug: "unit-2",
      title: "Unit 2",
    });
  });
  it("gets the next optionality unit", () => {
    const transformedLessons = getPackagedUnit({
      packagedUnitData: { ...mockPackagedUnitData, nullUnitvariantId: 4 },
      unitLessons: getTransformedLessons([
        syntheticUnitvariantLessonsByKsFixture({}),
      ]),
      containsGeorestrictedLessons: false,
      containsLoginRequiredLessons: false,
      unitSequenceData: unitSequenceFixture.concat({
        unitSlug: "unit-slug",
        unitTitle: "Null Title",
        unitDescription: null,
        optionalityTitle: "Optionality title",
        unitOrder: 5,
        nullUnitvariantId: 5,
        yearOrder: 1,
        year: "7",
        actions: null,
      }),
      unitsInOtherProgrammes: unitsInOtherProgrammesFixture,
      threads: threadsFixture,
    });

    expect(transformedLessons.nextUnit).toEqual({
      title: "Optionality title",
      slug: "unit-slug",
    });
  });
  it("gets the previous optionality unit", () => {
    const result = getAdjacentUnits({
      unitSequenceData: [
        ...unitSequenceFixture,
        {
          unitSlug: "unit-slug",
          unitTitle: "Null Title",
          unitDescription: null,
          optionalityTitle: "Optionality title",
          unitOrder: 5,
          nullUnitvariantId: 5,
          yearOrder: 1,
          year: "7",
          actions: null,
        },
        {
          unitSlug: "unit-slug",
          unitTitle: "Unit Title",
          unitDescription: null,
          unitOrder: 6,
          nullUnitvariantId: 6,
          yearOrder: 1,
          year: "7",
          actions: null,
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
    const result = getAdjacentUnits({
      unitSequenceData: [
        ...unitSequenceFixture,
        {
          unitOrder: 6,
          unitSlug: "next-slug",
          unitTitle: "Next unit",
          unitDescription: null,
          nullUnitvariantId: 6,
          yearOrder: 1,
          year: "7",
          actions: null,
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
    const result = getAdjacentUnits({
      unitSequenceData: [
        {
          unitOrder: 2,
          unitSlug: "prev-slug",
          unitTitle: "Prev unit",
          unitDescription: null,
          nullUnitvariantId: 2,
          yearOrder: 1,
          year: "7",
          actions: null,
        },
        {
          unitOrder: 5,
          unitSlug: "current-slug",
          unitTitle: "Current unit",
          unitDescription: null,
          nullUnitvariantId: 5,
          yearOrder: 1,
          year: "7",
          actions: null,
        },
        {
          unitOrder: 6,
          unitSlug: "next-slug",
          unitTitle: "Next unit",
          unitDescription: null,
          nullUnitvariantId: 6,
          yearOrder: 1,
          year: "7",
          actions: null,
        },
      ],
      nullUnitvariantId: 5,
    });
    expect(result.prevUnit).toEqual({ slug: "prev-slug", title: "Prev unit" });
  });
  it("gets the next unit from the correct year", () => {
    const result = getAdjacentUnits({
      unitSequenceData: [
        {
          unitSlug: "unit-1",
          unitTitle: "Unit 1",
          unitDescription: null,
          nullUnitvariantId: 1,
          yearOrder: 1,
          unitOrder: 1,
          year: "7",
          actions: null,
        },
        {
          unitSlug: "unit-10",
          unitTitle: "Unit 10",
          unitDescription: null,
          nullUnitvariantId: 20,
          yearOrder: 2,
          unitOrder: 2,
          year: "7",
          actions: null,
        },
        {
          unitSlug: "unit-2",
          unitTitle: "Unit 2",
          unitDescription: null,
          nullUnitvariantId: 2,
          yearOrder: 1,
          unitOrder: 2,
          year: "7",
          actions: null,
        },
      ],
      nullUnitvariantId: 1,
    });
    expect(result.nextUnit).toEqual({
      slug: "unit-2",
      title: "Unit 2",
    });
  });
  it("gets the previous unit from the correct year", () => {
    const result = getAdjacentUnits({
      unitSequenceData: [
        {
          unitSlug: "unit-2",
          unitTitle: "Unit 2",
          unitDescription: null,
          nullUnitvariantId: 2,
          yearOrder: 2,
          unitOrder: 2,
          year: "7",
          actions: null,
        },
        {
          unitSlug: "unit-20",
          unitTitle: "Unit 20",
          unitDescription: null,
          nullUnitvariantId: 20,
          yearOrder: 1,
          unitOrder: 2,
          year: "7",
          actions: null,
        },
        {
          unitSlug: "unit-3",
          unitTitle: "Unit 3",
          unitDescription: null,
          nullUnitvariantId: 3,
          yearOrder: 2,
          unitOrder: 2,
          year: "7",
          actions: null,
        },
      ],
      nullUnitvariantId: 3,
    });
    expect(result.prevUnit).toEqual({
      slug: "unit-2",
      title: "Unit 2",
    });
  });

  it("gets swimming neighbours only for swimming units", () => {
    const result = getAdjacentUnits({
      unitSequenceData: [
        {
          unitSlug: "unit-1",
          unitTitle: "Unit 1",
          unitDescription: null,
          nullUnitvariantId: 1,
          yearOrder: 1,
          unitOrder: 1,
          year: "1",
          actions: null,
        },
        {
          unitSlug: "swimming-1",
          unitTitle: "Swimming 1",
          unitDescription: null,
          nullUnitvariantId: 2,
          yearOrder: 1,
          unitOrder: 2,
          year: "1",
          isSwimming: true,
          actions: null,
        },
        {
          unitSlug: "unit-2",
          unitTitle: "Unit 2",
          unitDescription: null,
          nullUnitvariantId: 3,
          yearOrder: 1,
          unitOrder: 3,
          year: "1",
          actions: null,
        },
        {
          unitSlug: "swimming-2",
          unitTitle: "Swimming 2",
          unitDescription: null,
          nullUnitvariantId: 4,
          yearOrder: 2,
          unitOrder: 1,
          year: "2",
          isSwimming: true,
          actions: null,
        },
        {
          unitSlug: "unit-3",
          unitTitle: "Unit 3",
          unitDescription: null,
          nullUnitvariantId: 5,
          yearOrder: 2,
          unitOrder: 2,
          year: "2",
          actions: null,
        },
        {
          unitSlug: "swimming-3",
          unitTitle: "Swimming 3",
          unitDescription: null,
          nullUnitvariantId: 6,
          yearOrder: 3,
          unitOrder: 1,
          year: "3",
          isSwimming: true,
          actions: null,
        },
      ],
      nullUnitvariantId: 4,
    });

    expect(result.prevUnit).toEqual({
      slug: "swimming-1",
      title: "Swimming 1",
    });
    expect(result.nextUnit).toEqual({
      slug: "swimming-3",
      title: "Swimming 3",
    });
  });

  it("returns no previous unit for the first swimming unit", () => {
    const result = getAdjacentUnits({
      unitSequenceData: [
        {
          unitSlug: "swimming-1",
          unitTitle: "Swimming 1",
          unitDescription: null,
          nullUnitvariantId: 1,
          yearOrder: 1,
          unitOrder: 1,
          year: "1",
          isSwimming: true,
          actions: null,
        },
        {
          unitSlug: "unit-2",
          unitTitle: "Unit 2",
          unitDescription: null,
          nullUnitvariantId: 2,
          yearOrder: 1,
          unitOrder: 2,
          year: "1",
          actions: null,
        },
        {
          unitSlug: "swimming-2",
          unitTitle: "Swimming 2",
          unitDescription: null,
          nullUnitvariantId: 3,
          yearOrder: 2,
          unitOrder: 1,
          year: "2",
          isSwimming: true,
          actions: null,
        },
      ],
      nullUnitvariantId: 1,
    });

    expect(result.prevUnit).toBeNull();
    expect(result.nextUnit).toEqual({
      slug: "swimming-2",
      title: "Swimming 2",
    });
  });

  it("returns no next unit for the last swimming unit", () => {
    const result = getAdjacentUnits({
      unitSequenceData: [
        {
          unitSlug: "swimming-1",
          unitTitle: "Swimming 1",
          unitDescription: null,
          nullUnitvariantId: 1,
          yearOrder: 1,
          unitOrder: 1,
          year: "1",
          isSwimming: true,
          actions: null,
        },
        {
          unitSlug: "unit-2",
          unitTitle: "Unit 2",
          unitDescription: null,
          nullUnitvariantId: 2,
          yearOrder: 2,
          unitOrder: 1,
          year: "2",
          actions: null,
        },
        {
          unitSlug: "swimming-2",
          unitTitle: "Swimming 2",
          unitDescription: null,
          nullUnitvariantId: 3,
          yearOrder: 3,
          unitOrder: 1,
          year: "3",
          isSwimming: true,
          actions: null,
        },
      ],
      nullUnitvariantId: 3,
    });

    expect(result.prevUnit).toEqual({
      slug: "swimming-1",
      title: "Swimming 1",
    });
    expect(result.nextUnit).toBeNull();
  });

  it("gets adjacent units within the same subject category", () => {
    const result = getAdjacentUnits({
      unitSequenceData: [
        {
          unitSlug: "grammar-1",
          unitTitle: "Grammar 1",
          unitDescription: null,
          nullUnitvariantId: 2,
          yearOrder: 1,
          unitOrder: 2,
          year: "1",
          subjectCategories: ["Grammar"],
          actions: {
            subject_category_actions: {
              group_by_subjectcategory: true,
              all_disabled: false,
              default_category_id: 1,
            },
          },
        },
        {
          unitSlug: "writing-2",
          unitTitle: "Writing 2",
          unitDescription: null,
          nullUnitvariantId: 3,
          yearOrder: 1,
          unitOrder: 3,
          year: "1",
          actions: null,
          subjectCategories: ["Writing"],
        },
        {
          unitSlug: "grammar-2",
          unitTitle: "Grammar 2",
          unitDescription: null,
          nullUnitvariantId: 4,
          yearOrder: 2,
          unitOrder: 1,
          year: "2",
          subjectCategories: ["Grammar"],
          actions: {
            subject_category_actions: {
              group_by_subjectcategory: true,
              all_disabled: false,
              default_category_id: 1,
            },
          },
        },
        {
          unitSlug: "language-3",
          unitTitle: "Language 3",
          unitDescription: null,
          nullUnitvariantId: 5,
          yearOrder: 2,
          unitOrder: 2,
          year: "2",
          actions: null,
          subjectCategories: ["Language"],
        },
        {
          unitSlug: "grammar-3",
          unitTitle: "Grammar 3",
          unitDescription: null,
          nullUnitvariantId: 6,
          yearOrder: 3,
          unitOrder: 1,
          year: "3",
          isSwimming: false,
          subjectCategories: ["Grammar"],
          actions: {
            subject_category_actions: {
              group_by_subjectcategory: true,
              all_disabled: false,
              default_category_id: 1,
            },
          },
        },
      ],
      nullUnitvariantId: 4,
    });

    expect(result.nextUnit).toEqual({
      slug: "grammar-3",
      title: "Grammar 3",
    });

    expect(result.prevUnit).toEqual({
      slug: "grammar-1",
      title: "Grammar 1",
    });
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
    const result = getPackagedUnit({
      packagedUnitData: mockPackagedUnitData,
      unitLessons: [
        { ...baseLesson, actions: { isPePractical: true } },
        {
          ...baseLesson,
          lessonSlug: "lesson-2",
          actions: {},
        },
      ],
      containsGeorestrictedLessons: false,
      containsLoginRequiredLessons: false,
      unitSequenceData: unitSequenceFixture,
      unitsInOtherProgrammes: unitsInOtherProgrammesFixture,
      threads: threadsFixture,
    });
    expect(result.actions?.isPePractical).toBe(true);
  });

  it("sets isPePractical false when no lessons are practical", () => {
    const result = getPackagedUnit({
      packagedUnitData: mockPackagedUnitData,
      unitLessons: [
        { ...baseLesson, actions: {} },
        { ...baseLesson, lessonSlug: "lesson-2", actions: null },
      ],
      containsGeorestrictedLessons: false,
      containsLoginRequiredLessons: false,
      unitSequenceData: unitSequenceFixture,
      unitsInOtherProgrammes: unitsInOtherProgrammesFixture,
      threads: threadsFixture,
    });
    expect(result.actions?.isPePractical).toBe(false);
  });

  it("excludes unpublished lessons when determining isPePractical", () => {
    const result = getPackagedUnit({
      packagedUnitData: mockPackagedUnitData,
      unitLessons: [
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
      containsGeorestrictedLessons: false,
      containsLoginRequiredLessons: false,
      unitSequenceData: unitSequenceFixture,
      unitsInOtherProgrammes: unitsInOtherProgrammesFixture,
      threads: threadsFixture,
    });
    expect(result.actions?.isPePractical).toBe(false);
  });
});

describe("getProgrammeToggles", () => {
  it("returns empty array for tier and subject toggles", () => {
    const allProgrammes = [
      {
        programme_slug: "english-primary-ks1",
        programme_fields: programmeFieldsFixture(),
      },
    ];
    const result = getProgrammeToggles("english-primary-ks1", allProgrammes);
    expect(result.subjectOptionToggles).toEqual([]);
    expect(result.tierOptionToggles).toEqual([]);
  });
  it("returns tier toggles", () => {
    const allProgrammes = [
      {
        programme_slug: "maths-secondary-ks4-foundation",
        programme_fields: programmeFieldsFixture({
          overrides: {
            tier_slug: "foundation",
            tier_description: "Foundation",
            keystage_slug: "ks4",
            subject_slug: "maths",
          },
        }),
      },
      {
        programme_slug: "maths-secondary-ks4-higher",
        programme_fields: programmeFieldsFixture({
          overrides: {
            tier_slug: "higher",
            tier_description: "Higher",
            keystage_slug: "ks4",
            subject_slug: "maths",
          },
        }),
      },
    ];
    const result = getProgrammeToggles(
      "maths-secondary-ks4-foundation",
      allProgrammes,
    );
    expect(result.tierOptionToggles).toEqual([
      {
        title: "Foundation",
        programmeSlug: "maths-secondary-ks4-foundation",
        isSelected: true,
      },
      {
        title: "Higher",
        programmeSlug: "maths-secondary-ks4-higher",
        isSelected: false,
      },
    ]);
  });
  it("returns subject toggles", () => {
    const allProgrammes = [
      {
        programme_slug: "biology-secondary-ks4-aqa",
        programme_fields: programmeFieldsFixture({
          overrides: {
            subject: "Biology",
            keystage_slug: "ks4",
            subject_slug: "biology",
            examboard_slug: "aqa",
          },
        }),
      },
      {
        programme_slug: "combined-science-secondary-ks4-aqa",
        programme_fields: programmeFieldsFixture({
          overrides: {
            subject: "Combined science",
            keystage_slug: "ks4",
            subject_slug: "combined-science",
            examboard_slug: "aqa",
          },
        }),
      },
    ];
    const result = getProgrammeToggles(
      "combined-science-secondary-ks4-aqa",
      allProgrammes,
    );
    expect(result.subjectOptionToggles).toEqual([
      {
        title: "Combined science",
        programmeSlug: "combined-science-secondary-ks4-aqa",
        isSelected: true,
        subjectSlug: "combined-science",
      },
      {
        title: "Biology",
        programmeSlug: "biology-secondary-ks4-aqa",
        isSelected: false,
        subjectSlug: "biology",
      },
    ]);
  });

  it("returns both subject and tier toggles", () => {
    const allProgrammes = [
      {
        programme_slug: "biology-secondary-ks4-higher-aqa",
        programme_fields: programmeFieldsFixture({
          overrides: {
            subject: "Biology",
            keystage_slug: "ks4",
            subject_slug: "biology",
            examboard_slug: "aqa",
            tier_slug: "higher",
            tier_description: "Higher",
          },
        }),
      },
      {
        programme_slug: "combined-science-secondary-ks4-higher-aqa",
        programme_fields: programmeFieldsFixture({
          overrides: {
            subject: "Combined science",
            keystage_slug: "ks4",
            subject_slug: "combined-science",
            examboard_slug: "aqa",
            tier_slug: "higher",
            tier_description: "Higher",
          },
        }),
      },
      {
        programme_slug: "biology-secondary-ks4-foundation-aqa",
        programme_fields: programmeFieldsFixture({
          overrides: {
            subject: "Biology",
            keystage_slug: "ks4",
            subject_slug: "biology",
            examboard_slug: "aqa",
            tier_slug: "foundation",
            tier_description: "Foundation",
          },
        }),
      },
      {
        programme_slug: "combined-science-secondary-ks4-foundation-aqa",
        programme_fields: programmeFieldsFixture({
          overrides: {
            subject: "Combined science",
            keystage_slug: "ks4",
            subject_slug: "combined-science",
            examboard_slug: "aqa",
            tier_slug: "foundation",
            tier_description: "Foundation",
          },
        }),
      },
    ];
    const result = getProgrammeToggles(
      "combined-science-secondary-ks4-higher-aqa",
      allProgrammes,
    );
    expect(result.subjectOptionToggles).toEqual([
      {
        title: "Combined science",
        programmeSlug: "combined-science-secondary-ks4-higher-aqa",
        isSelected: true,
        subjectSlug: "combined-science",
      },
      {
        title: "Biology",
        programmeSlug: "biology-secondary-ks4-higher-aqa",
        isSelected: false,
        subjectSlug: "biology",
      },
    ]);
    expect(result.tierOptionToggles).toEqual([
      {
        title: "Foundation",
        programmeSlug: "combined-science-secondary-ks4-foundation-aqa",
        isSelected: false,
      },
      {
        title: "Higher",
        programmeSlug: "combined-science-secondary-ks4-higher-aqa",
        isSelected: true,
      },
    ]);
  });
  it("does not include options from other exam boards", () => {
    const allProgrammes = [
      {
        programme_slug: "biology-secondary-ks4-aqa",
        programme_fields: programmeFieldsFixture({
          overrides: {
            subject: "Biology",
            keystage_slug: "ks4",
            subject_slug: "biology",
            examboard_slug: "aqa",
          },
        }),
      },
      {
        programme_slug: "combined-science-secondary-ks4-aqa",
        programme_fields: programmeFieldsFixture({
          overrides: {
            subject: "Combined science",
            keystage_slug: "ks4",
            subject_slug: "combined-science",
            examboard_slug: "aqa",
          },
        }),
      },
      {
        programme_slug: "physics-secondary-ks4-edexcel",
        programme_fields: programmeFieldsFixture({
          overrides: {
            subject: "Physics",
            keystage_slug: "ks4",
            subject_slug: "physics",
            examboard_slug: "edexcel",
          },
        }),
      },
    ];
    const result = getProgrammeToggles(
      "combined-science-secondary-ks4-aqa",
      allProgrammes,
    );
    expect(result.subjectOptionToggles).toEqual([
      {
        title: "Combined science",
        programmeSlug: "combined-science-secondary-ks4-aqa",
        isSelected: true,
        subjectSlug: "combined-science",
      },
      {
        title: "Biology",
        programmeSlug: "biology-secondary-ks4-aqa",
        isSelected: false,
        subjectSlug: "biology",
      },
    ]);
  });

  it("sorts subject toggles", () => {
    const allProgrammes = [
      {
        programme_slug: "chemistry-secondary-ks4-aqa",
        programme_fields: programmeFieldsFixture({
          overrides: {
            subject: "Chemistry",
            subject_slug: "chemistry",
            examboard_slug: "aqa",
            subject_display_order: 30,
          },
        }),
      },
      {
        programme_slug: "biology-secondary-ks4-aqa",
        programme_fields: programmeFieldsFixture({
          overrides: {
            subject: "Biology",
            subject_slug: "biology",
            examboard_slug: "aqa",
            subject_display_order: 10,
          },
        }),
      },
      {
        programme_slug: "combined-science-secondary-ks4-aqa",
        programme_fields: programmeFieldsFixture({
          overrides: {
            subject: "Combined science",
            subject_slug: "combined-science",
            examboard_slug: "aqa",
            subject_display_order: 20,
          },
        }),
      },
    ];

    const result = getProgrammeToggles(
      "combined-science-secondary-ks4-aqa",
      allProgrammes,
    );

    expect(
      result.subjectOptionToggles.map((toggle) => toggle.programmeSlug),
    ).toEqual([
      "combined-science-secondary-ks4-aqa",
      "biology-secondary-ks4-aqa",
      "chemistry-secondary-ks4-aqa",
    ]);
  });

  it("sorts tiers", () => {
    const allProgrammes = [
      {
        programme_slug: "combined-science-secondary-ks4-higher-aqa",
        programme_fields: programmeFieldsFixture({
          overrides: {
            subject: "Combined science",
            subject_slug: "combined-science",
            examboard_slug: "aqa",
            tier_slug: "higher",
            tier_description: "Higher",
            tier_display_order: 20,
          },
        }),
      },
      {
        programme_slug: "combined-science-secondary-ks4-foundation-aqa",
        programme_fields: programmeFieldsFixture({
          overrides: {
            subject: "Combined science",
            subject_slug: "combined-science",
            examboard_slug: "aqa",
            tier_slug: "foundation",
            tier_description: "Foundation",
            tier_display_order: 10,
          },
        }),
      },
    ];

    const result = getProgrammeToggles(
      "combined-science-secondary-ks4-higher-aqa",
      allProgrammes,
    );

    expect(
      result.tierOptionToggles.map((toggle) => toggle.programmeSlug),
    ).toEqual([
      "combined-science-secondary-ks4-foundation-aqa",
      "combined-science-secondary-ks4-higher-aqa",
    ]);
  });
});
