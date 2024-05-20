import {
  lessonDataFixture,
  programmeFieldsFixture,
  syntheticUnitvariantLessonsFixture,
  unitDataFixture,
  unitvariantFixture,
} from "@oaknational/oak-curriculum-schema";

import sdk, { getBatchedRequests } from "../../sdk";

import unitListing, { getAllLearningThemes } from "./unitListing.query";
import { getTiersForProgramme } from "./getTiersForProgramme";
import {
  getLessonCountsForUnit,
  getThreadsForUnit,
  getUnitsForProgramme,
} from "./getUnitsForProgramme";

const mockBatched = getBatchedRequests as jest.Mock;

jest.mock("../../sdk", () => {
  return {
    ...jest.requireActual("../../sdk"),
    tiers: jest.fn(() =>
      Promise.resolve({
        tiers: [
          {
            programme_fields: programmeFieldsFixture({
              overrides: {
                tier: "foundation",
                tier_slug: "foundation",
                tier_description: "Foundation",
              },
            }),
            programme_slug: "subject-phase-ks-foundation",
          },
          {
            programme_fields: programmeFieldsFixture({
              overrides: {
                tier: "higher",
                tier_slug: "higher",
                tier_description: "Higher",
              },
            }),
            programme_slug: "subject-phase-ks-higher",
          },
        ],
      }),
    ),
    getBatchedRequests: jest.fn(() => Promise.resolve([])),
    unitListing: jest.fn(() =>
      Promise.resolve({
        programme: [
          {
            is_legacy: false,
            lesson_data: lessonDataFixture(),
            lesson_slug: "lesson-slug",
            null_unitvariant: unitvariantFixture(),
            programme_fields: programmeFieldsFixture({
              overrides: { tier_slug: null },
            }),
            programme_slug: "programme-slug",
            supplementary_data: { unit_order: 1, order_in_unit: 1 },
            unit_data: unitDataFixture(),
            unit_slug: "unit-slug",
          },
        ],
      }),
    ),
  };
});

describe("unitListing()", () => {
  test("throws a not found error if no unit is found", async () => {
    await expect(async () => {
      await unitListing({
        ...sdk,
        unitListing: jest.fn(() => Promise.resolve({ programme: [] })),
      })({
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  test("getAllLearningThemes returns themes in alphabetical order", () => {
    const res = getAllLearningThemes([
      [
        {
          slug: "unit-slug",
          title: "unit-title",
          nullTitle: "unit-title",
          programmeSlug: "programme-slug",
          keyStageSlug: "key-stage-slug",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          subjectSlug: "subject-slug",
          subjectTitle: "subject-title",
          keyStageTitle: "key-stage-title",
          yearTitle: "year-title",
          yearOrder: 1,
          unitStudyOrder: 1,
          cohort: "cohort",
          lessonCount: 1,
          expired: false,
          expiredLessonCount: 1,
          learningThemes: [
            { themeSlug: "b theme", themeTitle: "B Theme" },
            { themeSlug: "a theme", themeTitle: "A Theme" },
            { themeSlug: "c theme", themeTitle: "C Theme" },
          ],
        },
      ],
    ]);

    expect(res).toEqual([
      { themeSlug: "a theme", themeTitle: "A Theme" },
      { themeSlug: "b theme", themeTitle: "B Theme" },
      { themeSlug: "c theme", themeTitle: "C Theme" },
    ]);
  });

  test("getTiersForProgramme generates tiers in correct schema", async () => {
    mockBatched.mockResolvedValue(
      Promise.resolve([
        {
          data: {
            lessonCount: {
              aggregate: { count: 3 },
              nodes: [{ programme_fields: "foundation" }],
            },
            unitCount: {
              aggregate: { count: 2 },
              nodes: [{ programme_fields: "foundation" }],
            },
          },
        },
        {
          data: {
            lessonCount: {
              aggregate: { count: 2 },
              nodes: [{ programme_fields: "higher" }],
            },
            unitCount: {
              aggregate: { count: 1 },
              nodes: [{ programme_fields: "higher" }],
            },
          },
        },
      ]),
    );
    const res = await getTiersForProgramme(
      sdk,
      "subject-slug",
      "key-stage-slug",
      "exam-board-slug",
      false,
    );

    expect(res).toEqual([
      {
        tierTitle: "Foundation",
        tierSlug: "foundation",
        unitCount: 2,
        tierOrder: null,
        lessonCount: 3,
        tierProgrammeSlug: "subject-phase-ks-foundation",
      },
      {
        tierTitle: "Higher",
        tierSlug: "higher",
        unitCount: 1,
        lessonCount: 2,
        tierOrder: null,
        tierProgrammeSlug: "subject-phase-ks-higher",
      },
    ]);
  });
  test("getThreadsForUnit returns correct threads ", async () => {
    mockBatched.mockResolvedValue(
      Promise.resolve([
        {
          data: {
            threads: [
              {
                threads: [{ theme_slug: "theme1", theme_title: "Theme 1" }],
                unit_id: 1,
              },
            ],
          },
        },
        {
          data: {
            threads: [
              {
                threads: [{ theme_slug: "theme2", theme_title: "Theme 2" }],
                unit_id: 2,
              },
            ],
          },
        },
      ]),
    );
    const res = await getThreadsForUnit(["1", "2"]);

    expect(res[1]).toEqual([{ themeSlug: "theme1", themeTitle: "Theme 1" }]);
    expect(res[2]).toEqual([{ themeSlug: "theme2", themeTitle: "Theme 2" }]);
  });
  test("getThreadsForUnit groups threads by unit", async () => {
    mockBatched.mockResolvedValue(
      Promise.resolve([
        {
          data: {
            threads: [
              {
                threads: [{ theme_slug: "theme1", theme_title: "Theme 1" }],
                unit_id: 1,
              },
            ],
          },
        },
        {
          data: {
            threads: [
              {
                threads: [{ theme_slug: "theme2", theme_title: "Theme 2" }],
                unit_id: 2,
              },
            ],
          },
        },
        {
          data: {
            threads: [
              {
                threads: [{ theme_slug: "theme2", theme_title: "Theme 2" }],
                unit_id: 2,
              },
            ],
          },
        },
      ]),
    );

    const res = await getThreadsForUnit(["1", "2"]);
    expect(res[1]).toHaveLength(1);
    expect(res[2]).toHaveLength(2);
  });
  test("getLessonsForUnit returns correct counts", async () => {
    mockBatched.mockResolvedValue(
      Promise.resolve([
        {
          data: {
            lessonCount: {
              aggregate: { count: 2 },
              nodes: [{ unit_data: 1 }, { unit_slug: "unit-slug" }],
            },
            expiredLessonCount: {
              aggregate: { count: 1 },
              nodes: [{ unit_data: 1 }, { unit_slug: "unit-slug-2" }],
            },
          },
        },
      ]),
    );
    const res = await getLessonCountsForUnit([
      [{ programmeSlug: "programme-slug", slug: "unit-slug" }],
    ]);
    const unit = res[1]?.["unit-slug"];
    expect(unit?.lessonCount).toEqual(2);
    expect(unit?.expiredLessonCount).toEqual(1);
  });
  test("getUnitsForProgrammes returns correct units", async () => {
    mockBatched
      .mockResolvedValueOnce(
        Promise.resolve([
          {
            data: {
              threads: [
                {
                  threads: [{ theme_slug: "theme1", theme_title: "Theme 1" }],
                  unit_id: 1,
                },
              ],
            },
          },
        ]),
      )
      .mockResolvedValueOnce(
        Promise.resolve([
          {
            data: {
              lessonCount: {
                aggregate: { count: 2 },
                nodes: [{ unit_data: 1 }, { unit_slug: "unit-slug" }],
              },
              expiredLessonCount: {
                aggregate: { count: 1 },
                nodes: [{ unit_data: 1 }, { unit_slug: "unit-slug-2" }],
              },
            },
          },
        ]),
      );
    const res = await getUnitsForProgramme([
      syntheticUnitvariantLessonsFixture({
        overrides: {
          unit_data: {
            ...syntheticUnitvariantLessonsFixture().unit_data,
            unit_id: 1,
          },
        },
      }),
    ]);
    expect(res).toHaveLength(1);
    if (!res[0]) {
      throw new Error("No units found");
    }
    expect(res[0]).toHaveLength(1);
    expect(res[0][0]?.title).toEqual("unit-title");
  });
  test("getUnitsForProgramme groups optionality units", async () => {
    mockBatched
      .mockResolvedValueOnce(
        Promise.resolve([
          {
            data: {
              threads: [
                {
                  threads: [{ theme_slug: "theme1", theme_title: "Theme 1" }],
                  unit_id: 1,
                },
              ],
            },
          },
        ]),
      )
      .mockResolvedValueOnce(
        Promise.resolve([
          {
            data: {
              lessonCount: {
                aggregate: { count: 2 },
                nodes: [{ unit_data: 1 }, { unit_slug: "unit-slug" }],
              },
              expiredLessonCount: {
                aggregate: { count: 1 },
                nodes: [{ unit_data: 1 }, { unit_slug: "unit-slug-2" }],
              },
            },
          },
        ]),
      );
    const programmeFixture = syntheticUnitvariantLessonsFixture();
    const res = await getUnitsForProgramme([
      syntheticUnitvariantLessonsFixture({
        overrides: {
          programme_fields: {
            ...programmeFixture.programme_fields,
            optionality: "Optional 1",
          },
          unit_data: {
            ...programmeFixture.unit_data,
            unit_id: 1,
          },
        },
      }),
      syntheticUnitvariantLessonsFixture({
        overrides: {
          programme_fields: {
            ...programmeFixture.programme_fields,
            optionality: "Optional 2",
          },
          unit_data: {
            ...programmeFixture.unit_data,
            unit_id: 1,
          },
        },
      }),
    ]);

    expect(res).toHaveLength(1);
    expect(res[0]).toHaveLength(2);
    if (!res[0]) {
      throw new Error("No units found");
    }
    expect(res[0][0]?.title).toEqual("Optional 1");
    expect(res[0][1]?.title).toEqual("Optional 2");
  });
  test("getUnitsForProgrammes removes null variant", async () => {
    mockBatched
      .mockResolvedValueOnce(
        Promise.resolve([
          {
            data: {
              threads: [
                {
                  threads: [{ theme_slug: "theme1", theme_title: "Theme 1" }],
                  unit_id: 1,
                },
              ],
            },
          },
        ]),
      )
      .mockResolvedValueOnce(
        Promise.resolve([
          {
            data: {
              lessonCount: {
                aggregate: { count: 2 },
                nodes: [{ unit_data: 1 }, { unit_slug: "unit-slug" }],
              },
              expiredLessonCount: {
                aggregate: { count: 1 },
                nodes: [{ unit_data: 1 }, { unit_slug: "unit-slug-2" }],
              },
            },
          },
          {
            data: {
              lessonCount: {
                aggregate: { count: 2 },
                nodes: [{ unit_data: 1 }, { unit_slug: "unit-slug-1" }],
              },
              expiredLessonCount: {
                aggregate: { count: 1 },
                nodes: [{ unit_data: 1 }, { unit_slug: "unit-slug-2" }],
              },
            },
          },
        ]),
      );
    const programmeFixture = syntheticUnitvariantLessonsFixture();
    const res = await getUnitsForProgramme([
      syntheticUnitvariantLessonsFixture({
        overrides: {
          programme_fields: {
            ...programmeFixture.programme_fields,
            optionality: "Optional 1",
          },
          unit_data: {
            ...programmeFixture.unit_data,
            unit_id: 1,
          },
        },
      }),
      syntheticUnitvariantLessonsFixture({
        overrides: {
          unit_data: {
            ...programmeFixture.unit_data,
            unit_id: 1,
          },
        },
      }),
    ]);

    expect(res).toHaveLength(1);
    expect(res[0]).toHaveLength(1);
    if (!res[0]) {
      throw new Error("No units found");
    }
    expect(res[0][0]?.title).toEqual("Optional 1");
  });
});
