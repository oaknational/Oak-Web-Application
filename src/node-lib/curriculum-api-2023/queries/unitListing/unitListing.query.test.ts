import {
  lessonDataFixture,
  programmeFieldsFixture,
  unitDataFixture,
  unitvariantFixture,
} from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import unitListing from "./unitListing.query";
import { getTiersForProgramme } from "./getTiersForProgramme";

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
    getBatchedRequests: jest.fn(() =>
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
    ),
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

  test("getTiersForProgramme generates tiers in correct schema", async () => {
    const res = await getTiersForProgramme(
      sdk,
      "subject-slug",
      "key-stage-slug",
      "exam-board-slug",
    );

    expect(res).toEqual([
      {
        tierTitle: "Foundation",
        tierSlug: "foundation",
        unitCount: 2,
        lessonCount: 3,
        tierProgrammeSlug: "subject-phase-ks-foundation",
      },
      {
        tierTitle: "Higher",
        tierSlug: "higher",
        unitCount: 1,
        lessonCount: 2,
        tierProgrammeSlug: "subject-phase-ks-higher",
      },
    ]);
  });
  test("returns empty tiers if no tiers are found", async () => {
    const res = await unitListing(sdk)({ programmeSlug: "programme-slug" });
    expect(res.tiers).toEqual([]);
  });
  test("returns correct tiers when available", async () => {
    const res = await unitListing({
      ...sdk,
      unitListing: jest.fn(() =>
        Promise.resolve({
          programme: [
            {
              is_legacy: false,
              lesson_data: lessonDataFixture(),
              lesson_slug: "lesson-slug",
              null_unitvariant: unitvariantFixture(),
              programme_fields: programmeFieldsFixture({
                overrides: {
                  tier_slug: "foundation",
                  tier_description: "Foundation",
                  tier: "foundation",
                },
              }),
              programme_slug: "programme-slug",
              supplementary_data: { unit_order: 1, order_in_unit: 1 },
              unit_data: unitDataFixture(),
              unit_slug: "unit-slug",
            },
            {
              is_legacy: false,
              lesson_data: lessonDataFixture(),
              lesson_slug: "lesson-slug",
              null_unitvariant: unitvariantFixture(),
              programme_fields: programmeFieldsFixture({
                overrides: {
                  tier_slug: "higher",
                  tier_description: "Higher",
                  tier: "higher",
                },
              }),
              programme_slug: "programme-slug",
              supplementary_data: { unit_order: 1, order_in_unit: 1 },
              unit_data: unitDataFixture(),
              unit_slug: "unit-slug",
            },
          ],
        }),
      ),
    })({ programmeSlug: "programme-slug" });

    expect(res.tiers).toHaveLength(2);
    expect(res.tiers[0]).toEqual({
      tierSlug: "foundation",
      tierTitle: "Foundation",
      tierProgrammeSlug: "subject-phase-ks-foundation",
      unitCount: 2,
      lessonCount: 3,
    });
  });
});
