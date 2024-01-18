import { describe, expect, it } from "vitest";

import sdk from "../../sdk";

import lessonDownloads from "./lessonDownloads.query";

import lessonListingFixture from "@/node-lib/curriculum-api/fixtures/lessonListing.fixture";

const downloads = [
  {
    programmeSlug: "programme-slug-0",
    unitSlug: "unit-slug",
    lessonSlug: "lesson-slug",
    lessonTitle: "lesson-title",
    unitTitle: "unit-title",
    subjectSlug: "subject-slug",
    subjectTitle: "subject-title",
    keyStageSlug: "key-stage-slug",
    keyStageTitle: "key-stage-title",
    downloads: [],
  },
  {
    programmeSlug: "programme-slug-1",
    lessonSlug: "lesson-slug",
    lessonTitle: "lesson-title",
    unitSlug: "unit-slug",
    unitTitle: "unit-title",
    subjectSlug: "subject-slug",
    subjectTitle: "subject-title",
    keyStageSlug: "key-stage-slug",
    keyStageTitle: "key-stage-title",
    downloads: [],
  },
];

describe("lessonDownloads()", () => {
  it("throws a not found error if no download is found", async () => {
    await expect(async () => {
      await lessonDownloads({
        ...sdk,
        lessonDownloads: vi.fn(() =>
          Promise.resolve({
            downloads: [],
            unit: [
              {
                __typename: "published_mv_lesson_listing_3_0_0",
                lessons: lessonListingFixture().lessons,
              },
            ],
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  it("throws a not found error if no unit is found", async () => {
    await expect(async () => {
      await lessonDownloads({
        ...sdk,
        lessonDownloads: vi.fn(() =>
          Promise.resolve({
            downloads: downloads,
            unit: [],
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  it("first downloads is returned if multiple lessons in response", async () => {
    const unit = await lessonDownloads({
      ...sdk,
      lessonDownloads: vi.fn(() =>
        Promise.resolve({
          downloads: downloads,
          unit: [
            {
              __typename: "published_mv_lesson_listing_3_0_0",
              lessons: lessonListingFixture().lessons,
            },
          ],
        }),
      ),
    })({
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
      lessonSlug: "lesson-slug",
    });
    expect(unit.programmeSlug).toEqual("programme-slug-0");
  });
  it("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await lessonDownloads({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lessonDownloads: vi.fn(() =>
          Promise.resolve({
            downloads: [
              {
                programmeSlug: "programme-slug",
                unitTitle: "unit-title",
                subjectSlug: "subject-slug",
                subjectTitle: "subject-title",
                keyStageSlug: "key-stage-slug",
                keyStageTitle: "key-stage-title",
                downloads: [],
              },
            ],
            unit: [
              {
                __typename: "published_mv_lesson_listing_3_0_0",
                lessons: lessonListingFixture().lessons,
              },
            ],
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`unitSlug`);
  });
});
