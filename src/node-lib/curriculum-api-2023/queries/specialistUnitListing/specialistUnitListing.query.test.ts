import sdk, { BatchResult } from "../../sdk";

import specialistUnitListingQuery, {
  fetchSubjectDevelopmentStages,
  getExpandedDevelopmentStages,
  getExpandedSpecialistUnits,
  getPartialDevelopmentStageArray,
  getThemes,
  getUnitListingPageData,
} from "./specialistUnitListing.query";

const specialistUnits = [
  {
    contains_copyright_content: false,
    expired: null,
    synthetic_programme_slug: "communication-and-language-applying-learning",
    unit_slug: "celebrations-and-festivals-primary-1f8f",
    unit_title: "Celebrations and Festivals (Primary)",
    threads: [{ themeSlug: "primary", themeTitle: "primary" }],
    combined_programme_fields: {
      subject: "Communication and language",
      subject_slug: "communication-and-language",
      subject_type: "specialist",
      subject_parent: "Specialist",
      developmentstage: "Applying learning",
      developmentstage_slug: "applying-learning",
      phase_slug: "primary",
      phase: "primary",
      developmentstage_display_order: 1,
    },
    order_in_programme: 1,
  },
  {
    contains_copyright_content: false,
    expired: null,
    synthetic_programme_slug: "communication-and-language-applying-learning",
    unit_slug: "our-world-secondary-1102",
    unit_title: "Our World (Secondary)",
    threads: [{ themeSlug: "secondary", themeTitle: "secondary" }],
    combined_programme_fields: {
      subject: "Communication and language",
      subject_slug: "communication-and-language",
      subject_type: "specialist",
      subject_parent: "Specialist",
      developmentstage: "Applying learning",
      developmentstage_slug: "applying-learning",
      phase_slug: "secondary",
      phase: "secondary",
      developmentstage_display_order: 1,
    },
    order_in_programme: 1,
  },
];

jest.mock("../../sdk", () => {
  return {
    ...jest.requireActual("../../sdk"),
    getBatchedRequests: jest.fn(() =>
      Promise.resolve([
        {
          data: {
            specialistUnitLessonCount: { aggregate: { count: 4 } },
            specialistUnitExpiredLessonCount: { aggregate: { count: 4 } },
          },
        },
        {
          data: {
            specialistUnitLessonCount: { aggregate: { count: 4 } },
            specialistUnitExpiredLessonCount: { aggregate: { count: 4 } },
          },
        },
      ]),
    ),

    specialistUnitListing: jest.fn(() => Promise.resolve([])),
    developmentStages: jest.fn(() =>
      Promise.resolve({ developmentStages: [{}] }),
    ),
    specialistLessonCount: jest.fn(() =>
      Promise.resolve({
        specialistUnitLessonCount: { aggregate: { count: 0 } },
        specialistUnitExpiredLessonCount: { aggregate: { count: 0 } },
      }),
    ),
  };
});

describe("specialist unit listing", () => {
  test("throws a Zod error if the response is invalid (units)", async () => {
    await expect(async () => {
      await specialistUnitListingQuery({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        specialistUnitListing: jest.fn(() =>
          Promise.resolve({
            specialistUnits: [
              {
                synthetic_programme_slug:
                  "communication-and-language-applying-learning",
                unit_slug: "celebrations-and-festivals-primary-1f8f",
                unit_title: "Celebrations and Festivals (Primary)",
                contains_copyright_content: false,
                expired: null,
                threads: null,
              },
            ],
          }),
        ),
      })({
        programmeSlug: "combined_programme_fields",
      });
    }).rejects.toThrow(`combined_programme_fields`);
  });
  test("throws a error if the response is invalid (development stages)", async () => {
    await expect(async () => {
      await fetchSubjectDevelopmentStages(
        {
          ...sdk,
        },
        specialistUnits,
      );
    }).rejects.toThrow(`Resource not found`);
  });
  test("throws a not found error if no unit is found", async () => {
    await expect(async () => {
      await specialistUnitListingQuery({
        ...sdk,
        specialistUnitListing: jest.fn(() =>
          Promise.resolve({ specialistUnits: [] }),
        ),
      })({
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
});

describe("getThemes", () => {
  test("it returns correct themes", () => {
    const themes = getThemes(specialistUnits);
    expect(themes).toEqual([
      { themeSlug: "primary", themeTitle: "primary" },
      { themeSlug: "secondary", themeTitle: "secondary" },
    ]);
  });
});

describe("getPartialDevelopmentStageArray", () => {
  test("it returns correct partial stages", () => {
    const developmentalStages = getPartialDevelopmentStageArray([
      {
        combined_programme_fields: {
          subject: "Independent living",
          subject_slug: "independent-living",
          subject_type: "specialist",
          subject_parent: "Specialist",
          developmentstage: "A",
          developmentstage_slug: "a",
          developmentstage_display_order: 1,
        },
        synthetic_programme_slug: "independent-living-building-understanding",
      },
      {
        combined_programme_fields: {
          subject: "Independent living",
          subject_slug: "independent-living",
          subject_type: "specialist",
          subject_parent: "Specialist",
          developmentstage: "B",
          developmentstage_slug: "b",
          developmentstage_display_order: 1,
        },
        synthetic_programme_slug: "independent-living-building-understanding",
      },
    ]);
    expect(developmentalStages).toEqual([
      {
        programmeSlug: "independent-living-building-understanding",
        slug: "a",
        title: "A",
      },
      {
        programmeSlug: "independent-living-building-understanding",
        slug: "b",
        title: "B",
      },
    ]);
  });
});

describe("getExpandedDevelopmentalStages", () => {
  test("it returns correct expanded stages", () => {
    const DevelopmentalStages = getExpandedDevelopmentStages(
      [
        {
          slug: "applying-learning",
          title: "Applying learning",
          programmeSlug: "communication-and-language-applying-learning",
        },
      ],
      [
        {
          data: {
            developmentStageUnitCount: { aggregate: { count: 3 } },
            developmentStageLessonCount: { aggregate: { count: 10 } },
          },
        },
      ],
    );
    expect(DevelopmentalStages).toEqual([
      {
        slug: "applying-learning",
        title: "Applying learning",
        programmeSlug: "communication-and-language-applying-learning",
        unitCount: 3,
        lessonCount: 10,
      },
    ]);
  });
});

describe("getExpandedUnits", () => {
  test("it throws an error when no corresponding data", () => {
    expect(() =>
      getExpandedSpecialistUnits(specialistUnits, [
        {
          data: {
            specialistUnitLessonCount: { aggregate: { count: 0 } },
            specialistUnitExpiredLessonCount: { aggregate: { count: 0 } },
          },
        },
      ]),
    ).toThrow();
  });

  test("it returns correct expanded subjects", () => {
    const res = getExpandedSpecialistUnits(
      [
        {
          contains_copyright_content: false,
          expired: null,
          synthetic_programme_slug:
            "communication-and-language-applying-learning",
          unit_slug: "celebrations-and-festivals-primary-1f8f",
          unit_title: "Celebrations and Festivals (Primary)",
          threads: [{ themeSlug: "primary", themeTitle: "primary" }],
          combined_programme_fields: {
            subject: "Communication and language",
            subject_slug: "communication-and-language",
            subject_type: "specialist",
            subject_parent: "Specialist",
            developmentstage: "Applying learning",
            developmentstage_slug: "applying-learning",
            phase_slug: "primary",
            phase: "primary",
            developmentstage_display_order: 1,
          },
          order_in_programme: 1,
        },
      ],
      [
        {
          data: {
            specialistUnitLessonCount: { aggregate: { count: 4 } },
            specialistUnitExpiredLessonCount: { aggregate: { count: 0 } },
          },
        },
      ],
    );

    expect(res.length).toBe(1);
    expect(res[0]).toStrictEqual([
      {
        title: "Celebrations and Festivals (Primary)",
        slug: "celebrations-and-festivals-primary-1f8f",
        lessonCount: 4,
        nullTitle: "Celebrations and Festivals (Primary)",
        unpublishedLessonCount: 0,
        orderInProgramme: 1,
        programmeSlug: "communication-and-language-applying-learning",
        subjectSlug: "communication-and-language",
        subjectTitle: "Communication and language",
        expired: false,
        expiredLessonCount: 0,
        themeSlug: "primary",
        themeTitle: "primary",
        learningThemes: [{ themeSlug: "primary", themeTitle: "primary" }],
        developmentStageSlug: "applying-learning",
        developmentStageTitle: "Applying learning",
      },
    ]);
  });
  describe("populateUnitsWithBatchResponses", () => {
    const data = [
      {
        data: {
          specialistUnitLessonCount: { aggregate: { count: 4 } },
          specialistUnitExpiredLessonCount: { aggregate: { count: 0 } },
        },
      },
      {
        data: {
          specialistUnitLessonCount: { aggregate: { count: 4 } },
          specialistUnitExpiredLessonCount: { aggregate: { count: 0 } },
        },
      },
      {
        data: {
          developmentStageUnitCount: { aggregate: { count: 4 } },
          developmentStageLessonCount: { aggregate: { count: 4 } },
        },
      },
      {
        data: {
          developmentStageUnitCount: { aggregate: { count: 4 } },
          developmentStageLessonCount: { aggregate: { count: 4 } },
        },
      },
    ] as unknown as BatchResult;
    const pageData = getUnitListingPageData(data, specialistUnits, [
      {
        slug: "applying-learning",
        title: "Applying learning",
        programmeSlug: "communication-and-language-applying-learning",
      },
    ]);

    expect(pageData).toEqual({
      developmentStage: [
        {
          lessonCount: 4,
          programmeSlug: "communication-and-language-applying-learning",
          slug: "applying-learning",
          title: "Applying learning",
          unitCount: 4,
        },
      ],
      developmentStageSlug: "applying-learning",
      learningThemes: [
        {
          themeSlug: "primary",
          themeTitle: "primary",
        },
        {
          themeSlug: "secondary",
          themeTitle: "secondary",
        },
      ],
      programmeSlug: "communication-and-language-applying-learning",
      subjectSlug: "communication-and-language",
      subjectTitle: "Communication and language",
      units: [
        [
          {
            developmentStageSlug: "applying-learning",
            developmentStageTitle: "Applying learning",
            expired: false,
            expiredLessonCount: 0,
            unpublishedLessonCount: 0,

            learningThemes: [
              {
                themeSlug: "primary",
                themeTitle: "primary",
              },
            ],
            lessonCount: 4,
            nullTitle: "Celebrations and Festivals (Primary)",
            programmeSlug: "communication-and-language-applying-learning",
            slug: "celebrations-and-festivals-primary-1f8f",
            subjectSlug: "communication-and-language",
            subjectTitle: "Communication and language",
            themeSlug: "primary",
            themeTitle: "primary",
            title: "Celebrations and Festivals (Primary)",
            orderInProgramme: 1,
          },
        ],
        [
          {
            developmentStageSlug: "applying-learning",
            developmentStageTitle: "Applying learning",
            expired: false,
            expiredLessonCount: 0,
            unpublishedLessonCount: 0,

            learningThemes: [
              {
                themeSlug: "secondary",
                themeTitle: "secondary",
              },
            ],
            lessonCount: 4,
            nullTitle: "Our World (Secondary)",
            programmeSlug: "communication-and-language-applying-learning",
            slug: "our-world-secondary-1102",
            subjectSlug: "communication-and-language",
            subjectTitle: "Communication and language",
            themeSlug: "secondary",
            themeTitle: "secondary",
            title: "Our World (Secondary)",
            orderInProgramme: 1,
          },
        ],
      ],
    });
  });
});
