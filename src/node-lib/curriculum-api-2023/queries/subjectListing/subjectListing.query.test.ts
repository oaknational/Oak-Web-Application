import { describe, expect, it } from "vitest";

import sdk from "../../sdk";

import subjectListing from "./subjectListing.query";

describe("subjectListing()", () => {
  it("throws a not found error if no subjects are found", async () => {
    await expect(async () => {
      await subjectListing({
        ...sdk,
        subjectListing: vi.fn(() =>
          Promise.resolve({
            keyStageSubjects: [],
            keyStages: [{ keyStages: [] }],
          }),
        ),
      })({
        keyStageSlug: "key-stage-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  it("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await subjectListing({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        subjectListing: vi.fn(() =>
          Promise.resolve({
            keyStages: [{ keyStages: [] }],
            keyStageSubjects: [
              {
                keyStageSlug: "ks4",
                // keyStageTitle: "Key stage 4", // missing from response
                subjects: [
                  {
                    subjectSlug: "biology",
                    subjectTitle: "Biology",
                    unitCount: 1,
                    lessonCount: 18,
                    programmeSlug: "biology-secondary-ks4",
                  },
                ],
                subjectsUnavailable: null,
              },
            ],
          }),
        ),
      })({
        keyStageSlug: "slug",
      });
    }).rejects.toThrow(`keyStageTitle`);
  });
});
