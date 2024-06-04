import { syntheticUnitvariantLessonsFixture } from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import lessonDownloads from "./lessonDownloads.query";

const downloadAssets = {
  has_slide_deck_asset_object: true,
  starter_quiz: null,
  exit_quiz: null,
  has_worksheet_asset_object: true,
  has_worksheet_answers_asset_object: true,
  has_worksheet_google_drive_downloadable_version: true,
  has_supplementary_asset_object: true,
  is_legacy: true,
};

describe("lessonDownloads()", () => {
  test("throws a not found error if no download_assets is found", async () => {
    await expect(async () => {
      await lessonDownloads({
        ...sdk,
        lessonDownloads: jest.fn(() =>
          Promise.resolve({
            download_assets: [],
            unit_lessons: [],
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  test("throws a not found error if no unit_lessons are found", async () => {
    await expect(async () => {
      await lessonDownloads({
        ...sdk,
        lessonDownloads: jest.fn(() =>
          Promise.resolve({
            download_assets: [downloadAssets],
            unit_lessons: [],
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  test("first downloads is returned if multiple lessons in response", async () => {
    const unit = await lessonDownloads({
      ...sdk,
      lessonDownloads: jest.fn(() =>
        Promise.resolve({
          download_assets: [downloadAssets],
          unit_lessons: [syntheticUnitvariantLessonsFixture()],
        }),
      ),
    })({
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
      lessonSlug: "lesson-slug",
    });

    expect(unit.programmeSlug).toEqual("programme-slug");
  });
});
