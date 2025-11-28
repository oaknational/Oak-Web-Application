import { validateDownloadsInGcsBucket } from "./validateDownloadsInGcsBucket";

import { getLessonDownloadResourcesExistence } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
import OakError from "@/errors/OakError";

// Mock the dependencies
jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence",
);
jest.mock("@/errors/OakError", () => {
  return jest.fn();
});

const mockReportError = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      mockReportError(...args),
}));

describe("validateDownloadsInGcsBucket", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return downloads unchanged if no downloads exist", async () => {
    const downloads = [
      { exists: false, type: "worksheet-pdf" },
      { exists: null, type: "presentation" },
    ];

    const result = await validateDownloadsInGcsBucket(downloads, "test-lesson");

    expect(result).toEqual(downloads);
    expect(getLessonDownloadResourcesExistence).not.toHaveBeenCalled();
  });

  it("should enrich downloads with inGcsBucket property when resources exist", async () => {
    const downloads = [
      { exists: true, type: "worksheet-pdf" },
      { exists: true, type: "presentation" },
      { exists: false, type: "slide-deck" },
    ];

    const mockResourceData = {
      resources: [
        ["worksheet-pdf", { exists: true }],
        ["presentation", { exists: false }],
      ],
    };

    (getLessonDownloadResourcesExistence as jest.Mock).mockResolvedValue(
      mockResourceData,
    );

    const result = await validateDownloadsInGcsBucket(downloads, "test-lesson");

    expect(getLessonDownloadResourcesExistence).toHaveBeenCalledWith({
      lessonSlug: "test-lesson",
      resourceTypesString: "worksheet-pdf,presentation",
      additionalFilesIdsString: "",
      isLegacyDownload: false,
    });

    expect(result).toEqual([
      { exists: true, type: "worksheet-pdf", inGcsBucket: true },
      { exists: true, type: "presentation", inGcsBucket: false },
      { exists: false, type: "slide-deck", inGcsBucket: false },
    ]);

    expect(mockReportError).not.toHaveBeenCalled();
  });

  it("should handle errors and return original downloads", async () => {
    const downloads = [{ exists: true, type: "worksheet-pdf" }];

    const mockError = new Error("Network error");
    (getLessonDownloadResourcesExistence as jest.Mock).mockRejectedValue(
      mockError,
    );

    const result = await validateDownloadsInGcsBucket(
      downloads,
      "test-lesson",
      "testContext",
    );

    expect(result).toEqual(downloads);
    expect(OakError).toHaveBeenCalledWith({
      code: "downloads/failed-to-fetch",
      originalError: mockError,
    });
    expect(mockReportError).toHaveBeenCalled();
  });

  it("should only check downloads where exists is true", async () => {
    const downloads = [
      { exists: true, type: "worksheet-pdf" },
      { exists: false, type: "presentation" },
      { exists: null, type: "slide-deck" },
    ];

    const mockResourceData = {
      resources: [["worksheet-pdf", { exists: true }]],
    };

    (getLessonDownloadResourcesExistence as jest.Mock).mockResolvedValue(
      mockResourceData,
    );

    await validateDownloadsInGcsBucket(downloads, "test-lesson");

    expect(getLessonDownloadResourcesExistence).toHaveBeenCalledWith({
      lessonSlug: "test-lesson",
      resourceTypesString: "worksheet-pdf",
      additionalFilesIdsString: "",
      isLegacyDownload: false,
    });
  });

  it("should preserve additional properties on downloads", async () => {
    const downloads = [
      { exists: true, type: "worksheet-pdf", label: "Worksheet", id: 123 },
    ];

    const mockResourceData = {
      resources: [["worksheet-pdf", { exists: true }]],
    };

    (getLessonDownloadResourcesExistence as jest.Mock).mockResolvedValue(
      mockResourceData,
    );

    const result = await validateDownloadsInGcsBucket(downloads, "test-lesson");

    expect(result).toEqual([
      {
        exists: true,
        type: "worksheet-pdf",
        label: "Worksheet",
        id: 123,
        inGcsBucket: true,
      },
    ]);
  });
});
