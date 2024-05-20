import { programmeFieldsFixture } from "@oaknational/oak-curriculum-schema";

import { getTiersForProgramme } from "./getTiersForProgramme";

import sdk, { getBatchedRequests } from "@/node-lib/curriculum-api-2023/sdk";

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

describe("unit listing tiers", () => {
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
});
