/**
 * @jest-environment node
 */
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

const mockCurrentUser = jest.fn();

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: () => mockCurrentUser(),
}));

const mockGetIsUnitvariantGeorestrictedQuery = jest.fn();

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    getIsUnitvariantGeorestrictedQuery: (...args: unknown[]) =>
      mockGetIsUnitvariantGeorestrictedQuery(...args),
  },
}));

const mockCheckFileExistsInBucket = jest.fn();
const mockGetSignedUrl = jest.fn();

jest.mock("@/node-lib/curriculum-resources-downloads", () => {
  const reporterMock = jest.fn();
  return {
    getGCSHelpers: jest.fn(() => ({
      checkFileExistsInBucket: (...args: unknown[]) =>
        mockCheckFileExistsInBucket(...args),
      getSignedUrl: (...args: unknown[]) => mockGetSignedUrl(...args),
    })),
    storage: {},
    createDownloadsErrorReporter: jest.fn(() => reporterMock),
    __mockReportError: reporterMock,
  };
});

jest.mock("@/node-lib/getServerConfig", () => ({
  __esModule: true,
  default: jest.fn((key: string) => {
    const config: Record<string, string> = {
      gcsBucketNameForZips: "test-bucket",
      gcsDirForUnitZips: "unit-zips",
    };
    return config[key];
  }),
}));

const { __mockReportError: mockReportError } = jest.requireMock(
  "@/node-lib/curriculum-resources-downloads",
) as { __mockReportError: jest.Mock };

describe("GET /api/unit/[unitProgrammeSlug]/download", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckFileExistsInBucket.mockResolvedValue(true);
    mockGetSignedUrl.mockResolvedValue("https://signed-url.com/unit.zip");
    mockCurrentUser.mockResolvedValue({
      id: "user-123",
      privateMetadata: { region: "uk" },
    });
    mockGetIsUnitvariantGeorestrictedQuery.mockResolvedValue(false);
  });

  it("should return 200 with signed URL on success", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/unit/test-unit-slug/download",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ unitProgrammeSlug: "test-unit-slug" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith({
      data: { url: "https://signed-url.com/unit.zip" },
    });
  });

  it("should return 404 when unit ZIP does not exist", async () => {
    mockCheckFileExistsInBucket.mockResolvedValueOnce(false);

    const mockRequest = new Request(
      "http://localhost:3000/api/unit/test-unit-slug/download",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ unitProgrammeSlug: "test-unit-slug" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: { message: "No file found" } },
      { status: 404 },
    );
  });

  it("should return 401 when user is not authenticated", async () => {
    mockCurrentUser.mockResolvedValueOnce(null);

    const mockRequest = new Request(
      "http://localhost:3000/api/unit/test-unit-slug/download",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ unitProgrammeSlug: "test-unit-slug" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: { message: "Authentication required" } },
      { status: 401 },
    );
  });

  it("should return 403 when unit is geo restricted and user region is not allowed", async () => {
    mockGetIsUnitvariantGeorestrictedQuery.mockResolvedValueOnce(true);
    mockCurrentUser.mockResolvedValueOnce({
      id: "user-123",
      privateMetadata: { region: "us" },
    });

    const mockRequest = new Request(
      "http://localhost:3000/api/unit/test-unit-slug/download",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ unitProgrammeSlug: "test-unit-slug" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: { message: "Access restricted based on your location" } },
      { status: 403 },
    );
  });

  it("should return 200 when unit is geo restricted but user region is allowed", async () => {
    mockGetIsUnitvariantGeorestrictedQuery.mockResolvedValueOnce(true);
    mockCurrentUser.mockResolvedValueOnce({
      id: "user-123",
      privateMetadata: { region: "GB" },
    });

    const mockRequest = new Request(
      "http://localhost:3000/api/unit/test-unit-slug/download",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ unitProgrammeSlug: "test-unit-slug" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith({
      data: { url: "https://signed-url.com/unit.zip" },
    });
  });

  it("should report errors and return 500 on unexpected errors", async () => {
    const unexpectedError = new Error("Unexpected error");
    mockCheckFileExistsInBucket.mockRejectedValueOnce(unexpectedError);

    const mockRequest = new Request(
      "http://localhost:3000/api/unit/test-unit-slug/download",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ unitProgrammeSlug: "test-unit-slug" }),
    });

    expect(mockReportError).toHaveBeenCalledWith(unexpectedError, {
      severity: "error",
    });
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: { message: "Internal server error" } },
      { status: 500 },
    );
  });
});
