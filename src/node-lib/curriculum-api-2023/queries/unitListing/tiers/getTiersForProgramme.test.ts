import { programmeFieldsFixture } from "@oaknational/oak-curriculum-schema";

import { getTiersForProgramme } from "./getTiersForProgramme";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

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
  };
});

describe("unit listing tiers", () => {
  test("getTiersForProgramme generates tiers in correct schema", async () => {
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
        tierOrder: null,
        tierProgrammeSlug: "subject-phase-ks-foundation",
      },
      {
        tierTitle: "Higher",
        tierSlug: "higher",
        tierOrder: null,
        tierProgrammeSlug: "subject-phase-ks-higher",
      },
    ]);
  });
});
