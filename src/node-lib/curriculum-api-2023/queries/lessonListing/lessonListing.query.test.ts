import { describe, expect, it } from "vitest";

import sdk from "../../sdk";

import lessonListing from "./lessonListing.query";

describe("lessonListing()", () => {
  it("throws a not found error if no unit is found", async () => {
    await expect(async () => {
      await lessonListing({
        ...sdk,
        lessonListing: vi.fn(() => Promise.resolve({ unit: [] })),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  it("first unit is returned if multiple units in response", async () => {
    const unit = await lessonListing({
      ...sdk,
      lessonListing: vi.fn(() =>
        Promise.resolve({
          unit: [
            {
              programmeSlug: "programme-slug-0",
              unitSlug: "unit-slug",
              unitTitle: "unit-title",
              subjectSlug: "subject-slug",
              subjectTitle: "subject-title",
              keyStageSlug: "key-stage-slug",
              keyStageTitle: "key-stage-title",
              lessons: [],
            },
            {
              programmeSlug: "programme-slug-1",
              unitSlug: "unit-slug",
              unitTitle: "unit-title",
              subjectSlug: "subject-slug",
              subjectTitle: "subject-title",
              keyStageSlug: "key-stage-slug",
              keyStageTitle: "key-stage-title",
              lessons: [],
            },
          ],
        }),
      ),
    })({
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
    });
    expect(unit.programmeSlug).toEqual("programme-slug-0");
  });
  it("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await lessonListing({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lessonListing: vi.fn(() =>
          Promise.resolve({
            unit: [
              {
                programmeSlug: "programme-slug",
                unitTitle: "unit-title",
                subjectSlug: "subject-slug",
                subjectTitle: "subject-title",
                keyStageSlug: "key-stage-slug",
                keyStageTitle: "key-stage-title",
                lessons: [],
              },
            ],
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });
    }).rejects.toThrow(`unitSlug`);
  });
});
