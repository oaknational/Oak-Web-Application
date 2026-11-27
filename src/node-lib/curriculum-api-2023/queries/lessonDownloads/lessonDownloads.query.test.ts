import {
  additionalFilesFixture,
  syntheticUnitvariantLessonsByKsFixture,
} from "@oaknational/oak-curriculum-schema";
import { ZodError } from "zod";

import sdk from "../../sdk";

import lessonDownloads from "./lessonDownloads.query";
import { LessonDownloadsPageData } from "./lessonDownloads.schema";

const downloadAssets = {
  has_slide_deck_asset_object: true,
  starter_quiz: null,
  exit_quiz: null,
  has_worksheet_asset_object: true,
  has_worksheet_answers_asset_object: true,
  has_worksheet_google_drive_downloadable_version: true,
  has_supplementary_asset_object: true,
  has_lesson_guide_object: true,
  is_legacy: true,
  expired: true,
  downloadable_files: additionalFilesFixture({}).downloadable_files,
};

const downloadAssetsWithEmptyAdditionalFiles = {
  ...downloadAssets,
  downloadable_files: [],
};

describe("lessonDownloads()", () => {
  test("throws a not found error if no download_assets is found", async () => {
    await expect(async () => {
      await lessonDownloads({
        ...sdk,
        lessonDownloads: jest.fn(() =>
          Promise.resolve({
            download_assets: [],
            additional_files: [],
            browse_data: [],
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
            additional_files: [],
            browse_data: [],
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
    const unit = (await lessonDownloads({
      ...sdk,
      lessonDownloads: jest.fn(() =>
        Promise.resolve({
          download_assets: [downloadAssets],
          browse_data: [syntheticUnitvariantLessonsByKsFixture()],
        }),
      ),
    })({
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
      lessonSlug: "lesson-slug",
    })) as LessonDownloadsPageData;

    expect(unit.programmeSlug).toEqual("programme-slug");
  });
  test("it returns no media clips when lesson has restricted download", async () => {
    const response = (await lessonDownloads({
      ...sdk,
      lessonDownloads: jest.fn(() =>
        Promise.resolve({
          download_assets: [downloadAssets],
          browse_data: [syntheticUnitvariantLessonsByKsFixture()],
          features: {
            agf__georestricted_download: true,
          },
        }),
      ),
    })({
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
      lessonSlug: "lesson-slug",
    })) as LessonDownloadsPageData;

    const mediaClips = response.downloads.filter(
      (d) => d.type.startsWith("cycle") || d.type === "intro",
    );
    mediaClips.forEach((clip) => expect(clip.exists).toBeFalsy());
  });
  test("returns additional files if present in the response", async () => {
    const unit = (await lessonDownloads({
      ...sdk,
      lessonDownloads: jest.fn(() =>
        Promise.resolve({
          download_assets: [downloadAssets],
          browse_data: [syntheticUnitvariantLessonsByKsFixture()],
        }),
      ),
    })({
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
      lessonSlug: "lesson-slug",
    })) as LessonDownloadsPageData;

    expect(unit.additionalFiles).toEqual([
      {
        exists: true,
        type: "additional-files",
        label: "File 1",
        ext: "pdf",
        size: 1000,
        forbidden: false,
        assetId: 456,
      },
      {
        exists: true,
        type: "additional-files",
        label: "File 2",
        ext: "pdf",
        size: 2000,
        forbidden: false,
        assetId: 932,
      },
    ]);
  });
  test("returns additional files as empty string if not present in the response", async () => {
    const unit = (await lessonDownloads({
      ...sdk,
      lessonDownloads: jest.fn(() =>
        Promise.resolve({
          download_assets: [downloadAssetsWithEmptyAdditionalFiles],
          browse_data: [syntheticUnitvariantLessonsByKsFixture()],
        }),
      ),
    })({
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
      lessonSlug: "lesson-slug",
    })) as LessonDownloadsPageData;

    expect(unit.additionalFiles).toEqual([]);
  });
  test("throws a Zod error if the response is invalid", async () => {
    try {
      await lessonDownloads({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lessonDownloads: jest.fn(() =>
          Promise.resolve({
            download_assets: [
              {
                starter_quiz: null,
                exit_quiz: null,
                has_worksheet_asset_object: true,
                has_worksheet_answers_asset_object: true,
                has_worksheet_google_drive_downloadable_version: true,
                has_supplementary_asset_object: true,
                has_lesson_guide_object: true,
                is_legacy: true,
                expired: true,
                geo_restricted: false,
                login_required: false,
              },
            ],
            browse_data: [syntheticUnitvariantLessonsByKsFixture()],
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        lessonSlug: "lesson-slug",
      });
    } catch (error: unknown) {
      const err = error as ZodError;
      expect(err.issues).toEqual([
        expect.objectContaining({
          code: "invalid_type",
          expected: "boolean",
          path: ["has_slide_deck_asset_object"],
        }),
      ]);
    }
  });
});
