/**
 * @jest-environment node
 */
import { GET } from "./route";
import downloadHandler from "./download.handler";

const mockNextResponseJson = jest.fn().mockImplementation((data, init) => ({
  status: init?.status ?? 200,
  json: async () => data,
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: (...args: unknown[]) => mockNextResponseJson(...args),
  },
}));

const mockLessonAssets = jest.fn();
const mockAdditionalAssets = jest.fn();

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    lessonAssets: (...args: unknown[]) => mockLessonAssets(...args),
    additionalAssets: (...args: unknown[]) => mockAdditionalAssets(...args),
  },
}));

jest.mock("@/node-lib/curriculum-resources-downloads", () => {
  const reporterMock = jest.fn();
  const OakError = jest.requireActual("@/errors/OakError").default;
  return {
    DownloadSearchParamsSchema: {
      parse: jest.fn((params) => params),
    },
    parseDownloadParams: jest.fn((searchParams) => ({
      selection: searchParams.get("selection")?.split(",") ?? undefined,
      additionalFiles:
        searchParams.get("additionalFiles")?.split(",") ?? undefined,
    })),
    getGCSHelpers: jest.fn(() => ({
      checkFileExistsInBucket: jest.fn().mockResolvedValue(true),
      getFileSize: jest.fn().mockResolvedValue("10MB"),
      getSignedUrl: jest.fn().mockResolvedValue("https://signed-url.com"),
    })),
    getZipHelpers: jest.fn(() => ({
      createZipFromFiles: jest.fn().mockResolvedValue(Buffer.from("zip")),
    })),
    storage: {},
    createDownloadsErrorReporter: jest.fn(() => reporterMock),
    checkDownloadAuthorization: jest
      .fn()
      .mockResolvedValue({ authorized: true, user: null }),
    isOakError: (error: unknown) => error instanceof OakError,
    oakErrorToResponse: (error: InstanceType<typeof OakError>) => {
      return mockNextResponseJson(
        { error: { message: error.message } },
        { status: error.config.responseStatusCode ?? 500 },
      );
    },
    __mockReportError: reporterMock,
  };
});

jest.mock("@/node-lib/getServerConfig", () => ({
  __esModule: true,
  default: jest.fn((key: string) => {
    const config: Record<string, string> = {
      gcsBucketNameForZips: "test-bucket",
      gcsDirForLessonZips: "lesson-zips",
    };
    return config[key];
  }),
}));

jest.mock("./download.handler");

const mockDownloadHandler = downloadHandler as jest.Mock;

const { __mockReportError: mockReportError } = jest.requireMock(
  "@/node-lib/curriculum-resources-downloads",
) as { __mockReportError: jest.Mock };

const mockLessonData = {
  lesson: {
    slug: "test-lesson",
    asset_slidedeck: {
      asset_type: "slidedeck",
      asset_uid: "slidedeck-123",
      updated_at: "2024-01-01T00:00:00.000Z",
      asset_object: {
        powerpoint: {
          bucket_name: "bucket--ingested-assets",
          bucket_path: "slidedecks/presentation.pptx",
        },
      },
    },
    tpc_downloadablefiles: [],
  },
  isGeoRestricted: false,
  isLoginRequired: false,
};

describe("GET /api/lesson/[lessonSlug]/download", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLessonAssets.mockResolvedValue(mockLessonData);
    mockAdditionalAssets.mockResolvedValue([]);
    mockDownloadHandler.mockResolvedValue({
      url: "https://signed-url.com/lesson.zip",
      invalidResources: [],
    });
  });

  it("should return 200 with signed URL on success", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/download?selection=presentation",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith({
      data: { url: "https://signed-url.com/lesson.zip" },
    });
  });

  it("should return 404 when lesson is not found", async () => {
    mockLessonAssets.mockResolvedValueOnce(null);

    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/nonexistent-lesson/download?selection=presentation",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "nonexistent-lesson" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: { message: "Lesson not found" } },
      { status: 404 },
    );
  });

  it("should return 400 validation error when selection is missing", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/download",
    );

    const { DownloadSearchParamsSchema } = jest.requireMock(
      "@/node-lib/curriculum-resources-downloads",
    );
    const { ZodError } = await import("zod");
    DownloadSearchParamsSchema.parse.mockImplementationOnce(() => {
      throw new ZodError([
        {
          code: "custom",
          message: "Query parameter 'selection' is required",
          path: ["selection"],
        },
      ]);
    });

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          message: "Validation error",
        }),
      }),
      { status: 400 },
    );
    expect(mockReportError).toHaveBeenCalled();
  });

  it("should return authorization error when not authorized", async () => {
    const { checkDownloadAuthorization } = jest.requireMock(
      "@/node-lib/curriculum-resources-downloads",
    );
    const mockUnauthorizedResponse = {
      status: 401,
      json: async () => ({ error: { message: "Authentication required" } }),
    };
    checkDownloadAuthorization.mockResolvedValueOnce({
      authorized: false,
      response: mockUnauthorizedResponse,
    });

    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/download?selection=presentation",
    );

    const result = await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(result).toBe(mockUnauthorizedResponse);
  });

  it("should call downloadHandler with correct params", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/download?selection=presentation",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(mockDownloadHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        lesson: mockLessonData.lesson,
        selection: ["presentation"],
        additionalFilesIds: [],
        additionalFilesAssets: [],
      }),
      expect.objectContaining({
        gcsHelpers: expect.any(Object),
        zipHelpers: expect.any(Object),
        gcsBucketNameForZips: "test-bucket",
      }),
    );
  });

  it("should fetch additional assets when selection includes additional-files", async () => {
    const mockAdditionalAssetsData = [
      {
        asset_id: 123,
        asset_object: { file: { bucket_path: "files/doc.pdf" } },
      },
    ];
    mockAdditionalAssets.mockResolvedValueOnce(mockAdditionalAssetsData);

    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/download?selection=additional-files&additionalFiles=123",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(mockAdditionalAssets).toHaveBeenCalledWith({
      assetIds: [123],
    });
  });

  it("should return 500 when bucket config is missing", async () => {
    const getServerConfig = jest.requireMock(
      "@/node-lib/getServerConfig",
    ).default;
    getServerConfig.mockImplementationOnce(() => undefined);

    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/download?selection=presentation",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: { message: "Download service not configured" } },
      { status: 500 },
    );
  });

  it("should return 500 on unexpected errors", async () => {
    const unexpectedError = new Error("Unexpected error");
    mockDownloadHandler.mockRejectedValueOnce(unexpectedError);

    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/download?selection=presentation",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: { message: "Internal server error" } },
      { status: 500 },
    );
  });
});
