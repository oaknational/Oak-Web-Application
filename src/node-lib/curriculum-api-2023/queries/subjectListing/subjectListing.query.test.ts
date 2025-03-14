import sdk from "../../sdk";

import subjectListing from "./subjectListing.query";

describe("subjectListing()", () => {
  test("throws a not found error if no subjects are found", async () => {
    await expect(async () => {
      await subjectListing({
        ...sdk,
        subjectListing: jest.fn(() =>
          Promise.resolve({
            subjectUnits: [],
            key_stages: [],
            subjectFeatures: [],
          }),
        ),
      })({
        keyStageSlug: "key-stage-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await subjectListing({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        subjectListing: jest.fn(() =>
          Promise.resolve({
            key_stages: [
              {
                // slug: "slug",
                description: "description",
                keystage: "ks4",
                display_order: 1,
              },
            ],
            subjectLessons: [
              {
                programme_fields: {
                  subject: "subject",
                  subject_slug: "subject-slug",
                  tier_slug: null,
                  year_slug: null,
                  keystage_slug: "ks4",
                  keystage_description: "Key Stage 4",
                  phase_slug: null,
                  examboard_slug: null,
                },
                unit_slug: "unit-slug",
                programme_slug: "programme-slug",
                lesson_slug: "lesson-slug",
                is_legacy: false,
              },
            ],
          }),
        ),
      })({
        keyStageSlug: "slug",
      });
    }).rejects.toThrow();
  });
});
