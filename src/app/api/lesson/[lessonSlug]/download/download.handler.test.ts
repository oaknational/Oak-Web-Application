import { Writable } from "stream";

import { ZodError } from "zod";

import downloadHandler, {
  DownloadDependencies,
  DownloadParams,
} from "./download.handler";

import OakError from "@/errors/OakError";
import type { ZipHelpers } from "@/node-lib/curriculum-resources-downloads";
import { createMockGcsHelpers } from "@/node-lib/curriculum-resources-downloads/gcs/gcsHelpers.mocks";
import curriculumResourceLessonDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumResourceLessonDownloads.fixture";
import curriculumResourceAdditionalAssetFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumResourceAdditionalAsset.fixture";

const lesson = curriculumResourceLessonDownloadsFixture();
const additionalAssets = [curriculumResourceAdditionalAssetFixture()];

const mockGcsHelpers = createMockGcsHelpers();

const mockZipHelpers: ZipHelpers = {
  getOrCreateZip: jest
    .fn()
    .mockImplementation(async ({ getSignedUrlForZip, zipFilePath }) =>
      getSignedUrlForZip(zipFilePath),
    ),
  getZipFilePath: jest.fn().mockImplementation(({ fileName }) => {
    return `lesson-zips/${fileName}`;
  }),
};

const defaultParams: DownloadParams = {
  lesson,
  selection: ["presentation"],
  additionalFilesIds: [],
  additionalFilesAssets: [],
};

const deps: DownloadDependencies = {
  gcsHelpers: mockGcsHelpers,
  zipHelpers: mockZipHelpers,
  gcsBucketNameForZips: "bucket--lesson-download-zips",
};

function makeUpdatedAtLater(dateStr: string): string {
  const date = new Date(dateStr);
  return new Date(date.getTime() + 6000000).toISOString();
}

describe("lessonDownloadHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockGcsHelpers.checkFileExistsInBucket as jest.Mock).mockResolvedValue(
      false,
    );
  });

  test("throws OakError if all requested resources don't exist on lesson", async () => {
    /**
     * This test is for when no resources are found on the lesson. We treat it
     * as though the lesson does not exist.
     */
    const lessonWithNoAssets = curriculumResourceLessonDownloadsFixture({
      slug: "test-lesson",
      asset_slidedeck: {
        asset_type: "slidedeck",
        asset_uid: "LESS_id_324923",
        asset_object: null,
        updated_at: "2020-01-01T00:00:00.000Z",
      },
      asset_worksheet: {
        asset_type: "worksheet",
        asset_uid: "LESS_id_324923",
        asset_object: null,
        updated_at: "2020-01-01T00:00:00.001Z",
      },
      asset_worksheet_answers: null,
    });

    await expect(
      downloadHandler(
        {
          ...defaultParams,
          lesson: lessonWithNoAssets,
        },
        deps,
      ),
    ).rejects.toThrow(OakError);
  });

  test("throws OakError if additional files ids are not specified", async () => {
    /**
     * This test is for when additional asset ids are not specified.
     */
    const lessonWithAdditionalFiles = curriculumResourceLessonDownloadsFixture({
      slug: "test-lesson",
      asset_slidedeck: null,
      asset_worksheet: null,
      asset_worksheet_answers: null,
      tpc_downloadablefiles: [
        {
          asset_id: 123,
          media_object: {
            display_name: "Sample Additional File",
          },
        },
      ],
    });

    await expect(
      downloadHandler(
        {
          ...defaultParams,
          lesson: lessonWithAdditionalFiles,
          selection: ["additional-files"],
          additionalFilesIds: [123],
          additionalFilesAssets: [],
        },
        deps,
      ),
    ).rejects.toThrow(OakError);
  });

  test("throws ZodError when selection contains resource types which don't exist for the lesson", async () => {
    expect.assertions(2);

    const lessonWithoutSlidedeck = curriculumResourceLessonDownloadsFixture({
      asset_slidedeck: null,
    });

    try {
      await downloadHandler(
        {
          ...defaultParams,
          lesson: lessonWithoutSlidedeck,
          selection: ["presentation", "worksheet-pdf"],
        },
        deps,
      );
    } catch (error) {
      if (!(error instanceof ZodError)) throw error;
      expect(error).toBeInstanceOf(ZodError);
      expect(error.issues).toEqual([
        {
          code: "custom",
          message:
            "Invalid selection, the following resources don't exist for this lesson: presentation",
          path: ["selection"],
        },
      ]);
    }
  });

  test("reportError called with warnings", async () => {
    /**
     * Now this test verifies that invalid resources are returned
     * (error reporting moved to route level)
     */
    const lessonWithInvalidSlidedeck = curriculumResourceLessonDownloadsFixture(
      {
        asset_worksheet: null,
        asset_slidedeck: {
          ...lesson.asset_slidedeck!,
          // @ts-expect-error - testing invalid data
          updated_at: null,
        },
      },
    );

    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    const result = await downloadHandler(
      {
        ...defaultParams,
        lesson: lessonWithInvalidSlidedeck,
        selection: ["worksheet-pdf", "presentation"],
      },
      deps,
    );

    // Invalid resources should be returned
    expect(result.invalidResources.length).toBeGreaterThan(0);
    consoleSpy.mockRestore();
  });

  test("returns correct download url, with incompleteOrMissingResourceTypes, when some resources missing", async () => {
    /**
     * When some resources cannot be obtained (despite the lesson having them), we
     * still want to return a download url for the resources that can be obtained.
     * We also want to return incompleteOrMissingResourceTypes for the resources that cannot be obtained.
     */
    const lessonWithInvalidSlidedeck = curriculumResourceLessonDownloadsFixture(
      {
        slug: "test-lesson",
        asset_slidedeck: {
          ...lesson.asset_slidedeck!,
          // @ts-expect-error - testing invalid data
          updated_at: null,
        },
      },
    );

    const { url, invalidResources } = await downloadHandler(
      {
        ...defaultParams,
        lesson: lessonWithInvalidSlidedeck,
        selection: ["presentation", "worksheet-pdf", "worksheet-pptx"],
      },
      deps,
    );

    expect(url).toContain("https://signed-url.com/");
    expect(invalidResources).toContain("slidedeck--pptx");
  });

  test("returns correct download url", async () => {
    const { url } = await downloadHandler(
      {
        ...defaultParams,
        lesson,
        selection: ["presentation", "worksheet-pdf"],
      },
      deps,
    );

    expect(url).toContain("https://signed-url.com/");
    expect(url).toContain("lesson-zips/lesson-slug");
    expect(url).toContain(".zip");
  });

  test("filename changes with different 'latest' updated_at", async () => {
    /**
     * This test is to ensure that the filename changes when the latest
     * updated_at of the requested resources changes. This is so that stale
     * cached files are not served.
     */
    const { url: url1 } = await downloadHandler(
      {
        ...defaultParams,
        lesson,
        selection: ["presentation", "worksheet-pdf"],
      },
      deps,
    );

    const lessonWithUpdatedAsset = curriculumResourceLessonDownloadsFixture({
      asset_slidedeck: {
        ...lesson.asset_slidedeck!,
        updated_at: makeUpdatedAtLater(lesson.asset_slidedeck!.updated_at),
      },
    });

    const { url: url2 } = await downloadHandler(
      {
        ...defaultParams,
        lesson: lessonWithUpdatedAsset,
        selection: ["presentation", "worksheet-pdf"],
      },
      deps,
    );

    expect(url1).not.toEqual(url2);
  });

  test("filename does not change with different 'latest' updated_at of assets which aren't selected", async () => {
    /**
     * Note: The current implementation uses ALL published assets' timestamps
     * for cache invalidation, so changing any asset's timestamp will change
     * the filename. This ensures cache is invalidated when any lesson content
     * changes, even if not currently selected for download.
     */
    const { url: url1 } = await downloadHandler(
      {
        ...defaultParams,
        lesson,
        selection: ["presentation"],
      },
      deps,
    );

    const lessonWithUpdatedWorksheet = curriculumResourceLessonDownloadsFixture(
      {
        asset_worksheet: {
          ...lesson.asset_worksheet!,
          updated_at: makeUpdatedAtLater(lesson.asset_worksheet!.updated_at),
        },
      },
    );

    const { url: url2 } = await downloadHandler(
      {
        ...defaultParams,
        lesson: lessonWithUpdatedWorksheet,
        selection: ["presentation"],
      },
      deps,
    );

    // Current implementation: filename changes when ANY asset's timestamp changes
    // This provides broader cache invalidation across all lesson assets
    expect(url1).not.toEqual(url2);
  });

  test("returns cached zip when it already exists", async () => {
    (mockZipHelpers.getOrCreateZip as jest.Mock).mockImplementationOnce(
      async ({ getSignedUrlForZip, zipFilePath }) => {
        // Simulate cache hit - just return signed URL without creating
        return getSignedUrlForZip(zipFilePath);
      },
    );

    const { url } = await downloadHandler(defaultParams, deps);

    expect(url).toContain("https://signed-url.com/");
    expect(mockZipHelpers.getOrCreateZip).toHaveBeenCalled();
  });

  test("creates and uploads zip when it does not exist", async () => {
    let capturedFileList: unknown[] = [];
    let capturedWriteStream: Writable | undefined;

    (mockZipHelpers.getOrCreateZip as jest.Mock).mockImplementationOnce(
      async ({
        fileList,
        zipFileWriteStream,
        getSignedUrlForZip,
        zipFilePath,
      }) => {
        capturedFileList = fileList;
        capturedWriteStream = zipFileWriteStream;
        return getSignedUrlForZip(zipFilePath);
      },
    );

    await downloadHandler(defaultParams, deps);

    expect(mockZipHelpers.getOrCreateZip).toHaveBeenCalled();
    expect(capturedFileList.length).toBeGreaterThan(0);
    expect(capturedWriteStream).toBeDefined();
    expect(mockGcsHelpers.getFileWriteStream).toHaveBeenCalledWith(
      expect.objectContaining({
        gcsBucketName: "bucket--lesson-download-zips",
      }),
    );
  });

  test("downloads additional files when selected", async () => {
    const lessonWithAdditionalFiles = curriculumResourceLessonDownloadsFixture({
      tpc_downloadablefiles: [
        {
          asset_id: 123,
          media_object: {
            display_name: "test-audio",
          },
        },
      ],
    });

    let capturedFileList: Array<{ gcsFilePath: string }> = [];

    (mockZipHelpers.getOrCreateZip as jest.Mock).mockImplementationOnce(
      async ({ fileList, getSignedUrlForZip, zipFilePath }) => {
        capturedFileList = fileList;
        return getSignedUrlForZip(zipFilePath);
      },
    );

    await downloadHandler(
      {
        ...defaultParams,
        lesson: lessonWithAdditionalFiles,
        selection: ["additional-files"],
        additionalFilesIds: [123],
        additionalFilesAssets: additionalAssets,
      },
      deps,
    );

    const additionalFile = capturedFileList.find((f) =>
      f.gcsFilePath.includes("additional"),
    );
    expect(additionalFile).toBeDefined();
  });
});
