import { getWorksheetInfo } from "./getWorksheetInfo";

import { getLessonDownloadResourcesExistence } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
import OakError from "@/errors/OakError";

// Mock the dependencies
jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence",
);
jest.mock("@/errors/OakError", () => {
  return jest.fn();
});

// Mock the reportError function if it's imported
const mockReportError = jest.fn();
global.reportError = mockReportError;

describe("getWorksheetInfo", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should successfully process and filter worksheet data", async () => {
    // Mock the response from getLessonDownloadResourcesExistence
    const mockResourceData = {
      resources: [
        ["resource1", { exists: true, fileSize: "1MB", ext: "pdf" }],
        ["resource2", { exists: false, fileSize: undefined, ext: undefined }],
        ["resource3", { exists: true, fileSize: "2MB", ext: "pdf" }],
      ],
    };

    (getLessonDownloadResourcesExistence as jest.Mock).mockResolvedValue(
      mockResourceData,
    );

    const result = await getWorksheetInfo("test-lesson");

    // Verify the function was called with correct parameters
    expect(getLessonDownloadResourcesExistence).toHaveBeenCalledWith({
      lessonSlug: "test-lesson",
      resourceTypesString: "worksheet-pdf-questions",
      isLegacyDownload: false,
    });

    // Check the result contains only existing resources
    expect(result).toEqual([
      { item: "resource1", exists: true, fileSize: "1MB", ext: "pdf" },
      { item: "resource3", exists: true, fileSize: "2MB", ext: "pdf" },
    ]);

    // Verify error wasn't reported
    expect(mockReportError).not.toHaveBeenCalled();
  });

  it("should handle empty resource list", async () => {
    const mockEmptyResourceData = {
      resources: [],
    };

    (getLessonDownloadResourcesExistence as jest.Mock).mockResolvedValue(
      mockEmptyResourceData,
    );

    const result = await getWorksheetInfo("test-lesson");

    expect(result).toEqual([]);
    expect(mockReportError).not.toHaveBeenCalled();
  });

  it("should handle case where all resources do not exist", async () => {
    const mockNonExistentResourceData = {
      resources: [
        ["resource1", { exists: false, fileSize: undefined, ext: undefined }],
        ["resource2", { exists: false, fileSize: undefined, ext: undefined }],
      ],
    };

    (getLessonDownloadResourcesExistence as jest.Mock).mockResolvedValue(
      mockNonExistentResourceData,
    );

    const result = await getWorksheetInfo("test-lesson");

    expect(result).toEqual([]);
    expect(mockReportError).not.toHaveBeenCalled();
  });

  it("should handle error and report it correctly", async () => {
    const mockError = new Error("Network error");
    (getLessonDownloadResourcesExistence as jest.Mock).mockRejectedValue(
      mockError,
    );

    const mockOakError = new OakError({
      code: "downloads/failed-to-fetch",
      originalError: mockError,
    });

    const result = await getWorksheetInfo("test-lesson");

    // Verify error handling
    expect(OakError).toHaveBeenCalledWith({
      code: "downloads/failed-to-fetch",
      originalError: mockError,
    });
    expect(mockReportError).toHaveBeenCalledWith(mockOakError);
    expect(result).toBeUndefined();
  });
});
