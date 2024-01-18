import { describe, expect, it } from "vitest";

import sdk from "../../sdk";

import unitListing from "./unitListing.query";

describe("unitListing()", () => {
  it("throws a not found error if no unit is found", async () => {
    await expect(async () => {
      await unitListing({
        ...sdk,
        unitListing: vi.fn(() => Promise.resolve({ programme: [] })),
      })({
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  it("first programme is returned if multiple programmes in response", async () => {
    const programme = await unitListing({
      ...sdk,
      unitListing: vi.fn(() =>
        Promise.resolve({
          programme: [
            {
              programmeSlug: "programme-slug-0",
              subjectSlug: "subject-slug",
              subjectTitle: "subject-title",
              keyStageSlug: "key-stage-slug",
              keyStageTitle: "key-stage-title",
              units: [],
              tierSlug: "tier-slug",
              tierTitle: "tier-title",
              examBoardSlug: "examBoard-slug",
              examBoardTitle: "examBoard-title",
              totalUnitCount: 0,
              tiers: [],
              learningThemes: [],
            },
            {
              programmeSlug: "programme-slug-1",
              subjectSlug: "subject-slug",
              subjectTitle: "subject-title",
              keyStageSlug: "key-stage-slug",
              keyStageTitle: "key-stage-title",
              examBoardSlug: "examBoard-slug",
              examBoardTitle: "examBoard-title",
              tierSlug: "tier-slug",
              tierTitle: "tier-title",
              units: [],
              totalUnitCount: 0,
              tiers: [],
              learningThemes: [],
            },
          ],
        }),
      ),
    })({
      programmeSlug: "programme-slug",
    });
    expect(programme.programmeSlug).toEqual("programme-slug-0");
  });
  it("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await unitListing({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        unitListing: vi.fn(() =>
          Promise.resolve({
            programme: [
              {
                subjectSlug: "subject-slug",
                subjectTitle: "subject-title",
                keyStageSlug: "key-stage-slug",
                keyStageTitle: "key-stage-title",
                units: [],
              },
            ],
          }),
        ),
      })({
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`programmeSlug`);
  });
});
