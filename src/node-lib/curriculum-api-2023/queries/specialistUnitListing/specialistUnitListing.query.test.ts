import sdk from "../../sdk";

import specialistUnitListingQuery, {
  getExpandedDevelopmentalStages,
  getExpandedSpecialistUnits,
  getPartialDevelopmentStages,
  getThemes,
} from "./specialistUnitListing.query";

const specialistUnits = [
  {
    contains_copyright_content: false,
    expired: null,
    synthetic_programme_slug: "communication-and-language-applying-learning",
    unit_slug: "celebrations-and-festivals-primary-1f8f",
    unit_title: "Celebrations and Festivals (Primary)",
    combined_programme_fields: {
      subject: "Communication and language",
      subject_slug: "communication-and-language",
      subject_type: "specialist",
      subject_parent: "Specialist",
      developmentstage: "Applying learning",
      developmentstage_slug: "applying-learning",
      phase_slug: "primary",
      phase: "primary",
    },
  },
  {
    contains_copyright_content: false,
    expired: null,
    synthetic_programme_slug: "communication-and-language-applying-learning",
    unit_slug: "our-world-secondary-1102",
    unit_title: "Our World (Secondary)",
    combined_programme_fields: {
      subject: "Communication and language",
      subject_slug: "communication-and-language",
      subject_type: "specialist",
      subject_parent: "Specialist",
      developmentstage: "Applying learning",
      developmentstage_slug: "applying-learning",
      phase_slug: "secondary",
      phase: "secondary",
    },
  },
];

jest.mock("../../sdk", () => {
  return {
    ...jest.requireActual("../../sdk"),
    getBatchedRequests: jest.fn(() =>
      Promise.resolve([
        {
          data: {
            specialistUnitLessonCount: { aggregate: { count: 0 } },
            specialistUnitExpiredLessonCount: { aggregate: { count: 0 } },
          },
        },
        {
          data: {
            developmentStageUnitCount: { aggregate: { count: 0 } },
            developmentStageLessonCount: { aggregate: { count: 0 } },
          },
        },
      ]),
    ),
    specialistUnitListing: jest.fn(() => Promise.resolve([])),
    specialistLessonCount: jest.fn(() =>
      Promise.resolve({
        specialistUnitLessonCount: { aggregate: { count: 0 } },
        specialistUnitExpiredLessonCount: { aggregate: { count: 0 } },
      }),
    ),
  };
});

describe("specialist unit listing", () => {
  test("throws a Zod error if the response is invalid", async () => {
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

describe("getPartialDevelopmentStages", () => {
  test("it returns correct stages", () => {
    const stages = getPartialDevelopmentStages(specialistUnits);
    expect(stages).toEqual([
      {
        slug: "applying-learning",
        title: "Applying learning",
        programmeSlug: "communication-and-language-applying-learning",
      },
    ]);
  });
});

describe("getExpandedDevelopmentalStages", () => {
  test("it returns correct expanded stages", () => {
    const DevelopmentalStages = getExpandedDevelopmentalStages(
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
          combined_programme_fields: {
            subject: "Communication and language",
            subject_slug: "communication-and-language",
            subject_type: "specialist",
            subject_parent: "Specialist",
            developmentstage: "Applying learning",
            developmentstage_slug: "applying-learning",
            phase_slug: "primary",
            phase: "primary",
          },
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
        programmeSlug: "communication-and-language-applying-learning",
        subjectSlug: "communication-and-language",
        subjectTitle: "Communication and language",
        expired: false,
        expiredLessonCount: 0,
        themeSlug: "primary",
        themeTitle: "primary",
        learningThemes: [{ themeSlug: "primary", themeTitle: "primary" }],
        developmentalStageSlug: "applying-learning",
        developmentalStageTitle: "Applying learning",
      },
    ]);
  });
});
