import { ZodError } from "zod";

import sdk from "../../sdk";

import teachersPreviewLessonDownloadQuery, {
  TeacherPreviewLessonDownloadsQuery,
} from "./teacherPreviewLessonDownload.query";

import {
  syntheticUnitvariantLessonsFixture,
  lessonDataFixture,
  additionalFilesFixture,
} from "@oaknational/oak-curriculum-schema";
import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";

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
  geo_restricted: false,
  login_required: false,
  downloadable_files: additionalFilesFixture({}).downloadable_files,
};

const downloadAssetsWithEmptyAdditionalFiles = {
  ...downloadAssets,
  downloadable_files: [],
};

describe("teachersPreviewLessonDownloadQuery()", () => {
  test("throws a not found error if no download_assets is found", async () => {
    await expect(async () => {
      await teachersPreviewLessonDownloadQuery({
        ...sdk,
        teacherPreviewLessonDownload: jest.fn(() =>
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
      await teachersPreviewLessonDownloadQuery({
        ...sdk,
        teacherPreviewLessonDownload: jest.fn(() =>
          Promise.resolve({
            download_assets: [downloadAssets],
            additional_files: [],
            browse_data: [],
          }),
        ) as TeacherPreviewLessonDownloadsQuery,
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  test("first downloads is returned if multiple lessons in response", async () => {
    const unit = (await teachersPreviewLessonDownloadQuery({
      ...sdk,
      teacherPreviewLessonDownload: jest.fn(() =>
        Promise.resolve({
          download_assets: [downloadAssets],
          browse_data: [syntheticUnitvariantLessonsFixture()],
        }),
      ) as TeacherPreviewLessonDownloadsQuery,
    })({
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
      lessonSlug: "lesson-slug",
    })) as LessonDownloadsPageData;

    expect(unit.programmeSlug).toEqual("programme-slug");
  });
  test("returns additional files if present in the response", async () => {
    const unit = (await teachersPreviewLessonDownloadQuery({
      ...sdk,
      teacherPreviewLessonDownload: jest.fn(() =>
        Promise.resolve({
          download_assets: [downloadAssets],
          browse_data: [syntheticUnitvariantLessonsFixture()],
        }),
      ) as TeacherPreviewLessonDownloadsQuery,
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
    const unit = (await teachersPreviewLessonDownloadQuery({
      ...sdk,
      teacherPreviewLessonDownload: jest.fn(() =>
        Promise.resolve({
          download_assets: [downloadAssetsWithEmptyAdditionalFiles],
          browse_data: [syntheticUnitvariantLessonsFixture()],
        }),
      ) as TeacherPreviewLessonDownloadsQuery,
    })({
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
      lessonSlug: "lesson-slug",
    })) as LessonDownloadsPageData;

    expect(unit.additionalFiles).toEqual([]);
  });
  test("throws a Zod error if the response is invalid", async () => {
    try {
      await teachersPreviewLessonDownloadQuery({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        teacherPreviewLessonDownload: jest.fn(() =>
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
            browse_data: [syntheticUnitvariantLessonsFixture()],
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        lessonSlug: "lesson-slug",
      });
    } catch (error: unknown) {
      const err = error as ZodError;
      expect(err).toEqual({
        code: "invalid_type",
        expected: "boolean",
        message: "Required",
        path: ["has_slide_deck_asset_object"],
        received: "undefined",
      });
    }
  });
});

const downloadAssetsFixture = {
  has_slide_deck_asset_object: true,
  has_worksheet_asset_object: true,
  has_supplementary_asset_object: true,
  has_worksheet_answers_asset_object: true,
  has_worksheet_google_drive_downloadable_version: true,
  starter_quiz: [],
  exit_quiz: [],
  is_legacy: true,
};

// CANONICAL TESTS
describe("lessonDownloadsCanonical()", () => {
  test("throws a not found error if no download assets are found", async () => {
    await expect(async () => {
      await teachersPreviewLessonDownloadQuery({
        ...sdk,
        teacherPreviewLessonDownload: jest.fn(() =>
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
      await teachersPreviewLessonDownloadQuery({
        ...sdk,
        teacherPreviewLessonDownload: jest.fn(() =>
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
      await teachersPreviewLessonDownloadQuery({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        teacherPreviewLessonDownload: jest.fn(() =>
          Promise.resolve({
            download_assets: [
              {
                has_worksheet_asset_object: true,
                has_supplementary_asset_object: true,
                has_worksheet_answers_asset_object: true,
                has_worksheet_google_drive_downloadable_version: true,
                has_lesson_guide_object: true,
                starter_quiz: [],
                exit_quiz: [],
                is_legacy: true,
                geo_restricted: false,
                login_required: false,
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
      expect(typedError).toEqual({
        code: "invalid_type",
        expected: "boolean",
        message: "Required",
        path: ["has_slide_deck_asset_object"],
        received: "undefined",
      });
    }
  });

  describe("teachersPreviewLessonDownloadQuery() - Copyright Content", () => {
    test("returns copyright content if present in the response", async () => {
      const mockCopyrightContent = [
        {
          copyrightInfo: "info about copyright",
        },
      ];

      const unit = (await teachersPreviewLessonDownloadQuery({
        ...sdk,
        teacherPreviewLessonDownload: jest.fn(() =>
          Promise.resolve({
            download_assets: [downloadAssets],
            browse_data: [
              syntheticUnitvariantLessonsFixture({
                overrides: {
                  lesson_data: lessonDataFixture({
                    overrides: {
                      copyright_content: mockCopyrightContent,
                    },
                  }),
                },
              }),
            ],
          }),
        ) as TeacherPreviewLessonDownloadsQuery,
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        lessonSlug: "lesson-slug",
      })) as LessonDownloadsPageData;

      expect(unit.copyrightContent).toEqual(mockCopyrightContent);
    });

    test("returns null for copyright content if not present in the response", async () => {
      const unit = (await teachersPreviewLessonDownloadQuery({
        ...sdk,
        teacherPreviewLessonDownload: jest.fn(() =>
          Promise.resolve({
            download_assets: [downloadAssets],
            browse_data: [
              syntheticUnitvariantLessonsFixture({
                overrides: {
                  lesson_data: lessonDataFixture({
                    overrides: {
                      copyright_content: null,
                    },
                  }),
                },
              }),
            ],
          }),
        ) as TeacherPreviewLessonDownloadsQuery,
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        lessonSlug: "lesson-slug",
      })) as LessonDownloadsPageData;

      expect(unit.copyrightContent).toBeNull();
    });
  });
});
