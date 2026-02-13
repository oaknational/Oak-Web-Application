import { GET } from "./route";

const mockNextResponseJson = jest.fn().mockImplementation((data, init) => ({
  status: init?.status ?? 200,
  json: async () => data,
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: (...args: unknown[]) => mockNextResponseJson(...args),
  },
}));

const mockCheckFileExistsInBucket = jest.fn();
const mockGetFileSize = jest.fn();

jest.mock("@/node-lib/curriculum-resources-downloads", () => {
  const reporterMock = jest.fn();
  return {
    getGCSHelpers: jest.fn(() => ({
      checkFileExistsInBucket: (...args: unknown[]) =>
        mockCheckFileExistsInBucket(...args),
      getFileSize: (...args: unknown[]) => mockGetFileSize(...args),
      getSignedUrl: jest.fn().mockResolvedValue("https://signed-url.com"),
    })),
    storage: {},
    createDownloadsErrorReporter: jest.fn(() => reporterMock),
    checkDownloadAuthorization: jest
      .fn()
      .mockResolvedValue({ authorized: true, user: null }),
    __mockReportError: reporterMock,
  };
});

describe("GET /api/unit/[unitProgrammeSlug]/check-files", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckFileExistsInBucket.mockResolvedValue(true);
    mockGetFileSize.mockResolvedValue("10MB");
  });

  it("should return JSON response with correct values on success", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/unit/test-unit-slug/check-files",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ unitProgrammeSlug: "test-unit-slug" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith({
      data: { exists: true, fileSize: "10MB" },
    });
  });

  it("should return correct data when unit does not exist", async () => {
    mockCheckFileExistsInBucket.mockResolvedValueOnce(false);

    const mockRequest = new Request(
      "http://localhost:3000/api/unit/test-unit-slug/check-files",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ unitProgrammeSlug: "test-unit-slug" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith({
      data: { exists: false },
    });
  });
});
