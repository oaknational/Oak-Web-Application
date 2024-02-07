import sdk from "../../sdk";

import unitListing from "./unitListing.query";

describe("unitListing()", () => {
  test("throws a not found error if no unit is found", async () => {
    await expect(async () => {
      await unitListing({
        ...sdk,
        unitListing: jest.fn(() => Promise.resolve({ programme: [] })),
      })({
        programmeSlug: "programme-slug",
        isLegacy: false,
      });
    }).rejects.toThrow(`Resource not found`);
  });
  test("first programme is returned if multiple programmes in response", async () => {
    const programme = await unitListing({
      ...sdk,
      unitListing: jest.fn(() =>
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
      isLegacy: false,
    });
    expect(programme.programmeSlug).toEqual("programme-slug-0");
  });
  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await unitListing({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        unitListing: jest.fn(() =>
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
        isLegacy: false,
      });
    }).rejects.toThrow(`programmeSlug`);
  });
});
