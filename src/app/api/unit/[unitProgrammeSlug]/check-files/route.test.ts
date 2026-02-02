import { GET } from "./route";

jest.mock("next/server", () => ({
  NextResponse: {
    json: (...args: unknown[]) => mockNextResponseJson(...args),
  },
}));

jest.mock("@/node-lib/curriculum-resources-downloads", () => {
  const reporterMock = jest.fn();
  return {
    getGCSHelpers: jest.fn(() => ({
      checkFileExistsInBucket: jest.fn().mockResolvedValue(true),
      getFileSize: jest.fn().mockResolvedValue("10MB"),
      getSignedUrl: jest.fn().mockResolvedValue("https://signed-url.com"),
      fetchResourceAsBuffer: jest.fn().mockResolvedValue(Buffer.from("test")),
      uploadBuffer: jest.fn().mockResolvedValue(undefined),
    })),
    storage: {},
    createDownloadsErrorReporter: jest.fn(() => reporterMock),
    checkDownloadAuthorization: jest
      .fn()
      .mockResolvedValue({ authorized: true, user: null }),
    __mockReportError: reporterMock,
  };
});

const mockNextResponseJson = jest.fn().mockImplementation((data, init) => ({
  status: init?.status ?? 200,
  json: async () => data,
}));

describe("GET /api/unit/[unitProgrammeSlug]/check-files", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    const { getGCSHelpers } = jest.requireMock(
      "@/node-lib/curriculum-resources-downloads",
    ) as { getGCSHelpers: jest.Mock };

    getGCSHelpers.mockReturnValueOnce({
      checkFileExistsInBucket: jest.fn().mockResolvedValue(false),
      getFileSize: jest.fn(),
      getSignedUrl: jest.fn(),
      fetchResourceAsBuffer: jest.fn(),
      uploadBuffer: jest.fn(),
    });

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
