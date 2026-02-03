/**
 * @jest-environment node
 */
import assetHandler from "./asset.handler";

import curriculumResourceLessonDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumResourceLessonDownloads.fixture";
import curriculumResourceAdditionalAssetFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumResourceAdditionalAsset.fixture";

const mockCheckFileExistsInBucket = jest.fn();
const mockGetFileSize = jest.fn();
const mockCheckFileExistsAndGetSize = jest.fn();
const mockGetSignedUrl = jest.fn();
const mockFetchResourceFromGCS = jest.fn();
const mockGetFileWriteStream = jest.fn();

const mockGcsHelpers = {
  fetchResourceFromGCS: mockFetchResourceFromGCS,
  getFileWriteStream: mockGetFileWriteStream,
  checkFileExistsInBucket: mockCheckFileExistsInBucket,
  getFileSize: mockGetFileSize,
  checkFileExistsAndGetSize: mockCheckFileExistsAndGetSize,
  getSignedUrl: mockGetSignedUrl,
};

const mockGetResourceInfoByFileType = jest.fn();
const mockGetAvailableResourceOptions = jest.fn();

jest.mock("@/node-lib/curriculum-resources-downloads", () => ({
  SINGLE_FILE_SELECTION_MAP: {
    presentation: {
      fileType: "slidedeck--pptx",
      filename: "slide-deck.pptx",
      ext: "pptx",
    },
    "worksheet-pdf-questions": {
      fileType: "worksheet-questions--pdf",
      filename: "worksheet-questions.pdf",
      ext: "pdf",
    },
  },
  getResourceHelpers: jest.fn(() => ({
    getResourceInfoByFileType: mockGetResourceInfoByFileType,
    getAvailableResourceOptions: mockGetAvailableResourceOptions,
  })),
}));

const mockLesson = curriculumResourceLessonDownloadsFixture();

describe("assetHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckFileExistsAndGetSize.mockResolvedValue({
      exists: true,
      fileSize: "10MB",
    });
    mockGetSignedUrl.mockResolvedValue("https://signed-url.com/asset.pptx");
    mockGetAvailableResourceOptions.mockReturnValue(["presentation"]);
    mockGetResourceInfoByFileType.mockReturnValue({
      isPublished: true,
      gcsFilePath: "slidedecks/presentation.pptx",
      gcsBucketName: "bucket--ingested-assets",
    });
  });

  describe("standard resources", () => {
    it("should return asset data for valid presentation resource", async () => {
      const result = await assetHandler(
        {
          lesson: mockLesson,
          resource: "presentation",
          additionalAsset: null,
        },
        { gcsHelpers: mockGcsHelpers },
      );

      expect(result).toEqual({
        url: "https://signed-url.com/asset.pptx",
        filename: "slide-deck.pptx",
        fileSize: "10MB",
        contentType:
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      });
    });

    it("should throw ZodError when resource is not available for lesson", async () => {
      mockGetAvailableResourceOptions.mockReturnValueOnce([]);

      await expect(
        assetHandler(
          {
            lesson: mockLesson,
            resource: "presentation",
            additionalAsset: null,
          },
          { gcsHelpers: mockGcsHelpers },
        ),
      ).rejects.toThrow("Resource 'presentation' is not available");
    });

    it("should throw notFound when resource info is not found", async () => {
      mockGetResourceInfoByFileType.mockReturnValueOnce(null);

      await expect(
        assetHandler(
          {
            lesson: mockLesson,
            resource: "presentation",
            additionalAsset: null,
          },
          { gcsHelpers: mockGcsHelpers },
        ),
      ).rejects.toThrow("Requested download resources not found");
    });

    it("should throw ZodError when resource is not published", async () => {
      mockGetResourceInfoByFileType.mockReturnValueOnce({
        isPublished: false,
        gcsFilePath: "slidedecks/presentation.pptx",
        gcsBucketName: "bucket--ingested-assets",
      });

      await expect(
        assetHandler(
          {
            lesson: mockLesson,
            resource: "presentation",
            additionalAsset: null,
          },
          { gcsHelpers: mockGcsHelpers },
        ),
      ).rejects.toThrow("Resource 'presentation' is not available");
    });

    it("should throw notFound when file does not exist in GCS", async () => {
      mockCheckFileExistsAndGetSize.mockResolvedValueOnce({ exists: false });

      await expect(
        assetHandler(
          {
            lesson: mockLesson,
            resource: "presentation",
            additionalAsset: null,
          },
          { gcsHelpers: mockGcsHelpers },
        ),
      ).rejects.toThrow("Requested file not found");
    });

    it("should return Unknown for file size when not available", async () => {
      mockCheckFileExistsAndGetSize.mockResolvedValueOnce({
        exists: true,
        fileSize: undefined,
      });

      const result = await assetHandler(
        {
          lesson: mockLesson,
          resource: "presentation",
          additionalAsset: null,
        },
        { gcsHelpers: mockGcsHelpers },
      );

      expect(result.fileSize).toBe("Unknown");
    });
  });

  describe("additional files", () => {
    const mockAdditionalAsset = curriculumResourceAdditionalAssetFixture();

    it("should return asset data for valid additional file", async () => {
      const result = await assetHandler(
        {
          lesson: mockLesson,
          resource: "additional-files",
          additionalAsset: mockAdditionalAsset,
        },
        { gcsHelpers: mockGcsHelpers },
      );

      expect(result).toEqual({
        url: "https://signed-url.com/asset.pptx",
        filename: "Sample Additional File.mp3",
        fileSize: "10MB",
        contentType: "audio/mpeg",
      });
    });

    it("should use asset_id as filename when title is not available", async () => {
      const assetWithoutTitle = curriculumResourceAdditionalAssetFixture({
        title: null,
      });

      const result = await assetHandler(
        {
          lesson: mockLesson,
          resource: "additional-files",
          additionalAsset: assetWithoutTitle,
        },
        { gcsHelpers: mockGcsHelpers },
      );

      expect(result.filename).toBe("123.mp3");
    });

    it("should throw notFound when additional asset is null", async () => {
      await expect(
        assetHandler(
          {
            lesson: mockLesson,
            resource: "additional-files",
            additionalAsset: null,
          },
          { gcsHelpers: mockGcsHelpers },
        ),
      ).rejects.toThrow("Additional file not found");
    });

    it("should throw notFound when additional file does not belong to lesson", async () => {
      const assetNotInLesson = {
        ...mockAdditionalAsset,
        asset_id: 999,
      };

      await expect(
        assetHandler(
          {
            lesson: mockLesson,
            resource: "additional-files",
            additionalAsset: assetNotInLesson,
          },
          { gcsHelpers: mockGcsHelpers },
        ),
      ).rejects.toThrow("Additional file not found");
    });

    it("should throw notFound when additional file has no valid file type", async () => {
      const assetWithEmptyObject = curriculumResourceAdditionalAssetFixture({
        asset_object: {},
      });

      await expect(
        assetHandler(
          {
            lesson: mockLesson,
            resource: "additional-files",
            additionalAsset: assetWithEmptyObject,
          },
          { gcsHelpers: mockGcsHelpers },
        ),
      ).rejects.toThrow("Additional file is invalid or missing required data");
    });

    it("should throw notFound when additional file has no valid location", async () => {
      const assetWithNoLocation = curriculumResourceAdditionalAssetFixture({
        asset_object: {
          pdf: {},
        },
      });

      await expect(
        assetHandler(
          {
            lesson: mockLesson,
            resource: "additional-files",
            additionalAsset: assetWithNoLocation,
          },
          { gcsHelpers: mockGcsHelpers },
        ),
      ).rejects.toThrow("Additional file is invalid or missing required data");
    });
  });

  describe("content type detection", () => {
    it("should return correct content type for pdf", async () => {
      mockGetAvailableResourceOptions.mockReturnValueOnce([
        "worksheet-pdf-questions",
      ]);
      mockGetResourceInfoByFileType.mockReturnValueOnce({
        isPublished: true,
        gcsFilePath: "worksheets/worksheet.pdf",
        gcsBucketName: "bucket--ingested-assets",
      });

      const result = await assetHandler(
        {
          lesson: mockLesson,
          resource: "worksheet-pdf-questions",
          additionalAsset: null,
        },
        { gcsHelpers: mockGcsHelpers },
      );

      expect(result.contentType).toBe("application/pdf");
    });

    it("should return octet-stream for unknown extension", async () => {
      const assetWithUnknownType = curriculumResourceAdditionalAssetFixture({
        asset_object: {
          xyz: {
            bucket_name: "bucket",
            bucket_path: "files/file.xyz",
          },
        },
      });

      const lessonWithUnknownFile = curriculumResourceLessonDownloadsFixture({
        tpc_downloadablefiles: [
          { asset_id: 123, media_object: { display_name: "Unknown" } },
        ],
      });

      const result = await assetHandler(
        {
          lesson: lessonWithUnknownFile,
          resource: "additional-files",
          additionalAsset: assetWithUnknownType,
        },
        { gcsHelpers: mockGcsHelpers },
      );

      expect(result.contentType).toBe("application/octet-stream");
    });
  });
});
