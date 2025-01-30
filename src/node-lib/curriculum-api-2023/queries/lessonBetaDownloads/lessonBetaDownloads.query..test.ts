import {
  syntheticUnitvariantLessonsFixture,
  additionalFilesFixture,
} from "@oaknational/oak-curriculum-schema";
import { ZodError } from "zod";

import sdk from "../../sdk";

import lessonBetaDownloadsQuery from "./lessonBetaDownloads.query";

const downloadAssetsFixture = {
  has_slide_deck_asset_object: true,
  has_worksheet_asset_object: true,
  has_supplementary_asset_object: true,
  has_worksheet_answers_asset_object: true,
  has_worksheet_google_drive_downloadable_version: true,
  starter_quiz: [],
  exit_quiz: [],
  is_legacy: true,
  has_additional_files: false,
  additional_files: additionalFilesFixture(),
};

describe("betaLessonDownloads()", () => {
  test("throws a not found error if no download assets are found", async () => {
    await expect(async () => {
      await lessonBetaDownloadsQuery({
        ...sdk,
        lessonBetaDownloads: jest.fn(() =>
          Promise.resolve({
            download_assets: [],
            browse_data: [syntheticUnitvariantLessonsFixture()],
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  test("throws a not found error if no browse_data are found", async () => {
    await expect(async () => {
      await lessonBetaDownloadsQuery({
        ...sdk,
        lessonBetaDownloads: jest.fn(() =>
          Promise.resolve({
            download_assets: [downloadAssetsFixture],
            browse_data: [],
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("throws a Zod error if the response is invalid", async () => {
    try {
      await lessonBetaDownloadsQuery({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lessonBetaDownloads: jest.fn(() =>
          Promise.resolve({
            download_assets: [
              {
                has_worksheet_asset_object: true,
                has_supplementary_asset_object: true,
                has_worksheet_answers_asset_object: true,
                has_worksheet_google_drive_downloadable_version: true,
                starter_quiz: [],
                exit_quiz: [],
                is_legacy: true,
                geo_restricted: false,
                login_required: false,
                has_additional_files: true,
                additional_files: [additionalFilesFixture()],
              },
            ],
            browse_data: [syntheticUnitvariantLessonsFixture()],
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
      });
    } catch (error: unknown) {
      const typedError = error as ZodError;
      expect(typedError.errors).toEqual([
        {
          code: "invalid_type",
          expected: "boolean",
          message: "Required",
          path: ["has_slide_deck_asset_object"],
          received: "undefined",
        },
      ]);
    }
  });
});
