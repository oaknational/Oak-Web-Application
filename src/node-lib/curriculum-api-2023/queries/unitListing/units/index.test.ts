import {
  programmeFieldsFixture,
  syntheticUnitvariantLessonsFixture,
} from "@oaknational/oak-curriculum-schema";

import { getBatchedRequests } from "../../../sdk";

import { getUnitsForProgramme } from "./getUnitsForProgramme";
import { getLessonCountsForUnit } from "./getLessonCountsForUnits";

const mockBatched = getBatchedRequests as jest.Mock;

jest.mock("../../../sdk", () => {
  return {
    ...jest.requireActual("../../../sdk"),
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
  };
});
describe("unit listing units", () => {
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
