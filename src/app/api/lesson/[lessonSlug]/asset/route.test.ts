/**
 * @jest-environment node
 */
import { GET } from "./route";
import assetHandler from "./asset.handler";

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
  const actualOakError = jest.requireActual("@/errors/OakError").default;
  return {
    AssetSearchParamsSchema: {
      parse: jest.fn((params) => params),
    },
    parseAssetParams: jest.fn((searchParams) => ({
      resource: searchParams.get("resource") ?? undefined,
      assetId: searchParams.get("assetId") ?? undefined,
    })),
    getGCSHelpers: jest.fn(() => ({
      checkFileExistsInBucket: jest.fn().mockResolvedValue(true),
      getFileSize: jest.fn().mockResolvedValue("10MB"),
      getSignedUrl: jest.fn().mockResolvedValue("https://signed-url.com"),
    })),
    storage: {},
    createDownloadsErrorReporter: jest.fn(() => reporterMock),
    checkDownloadAuthorization: jest
      .fn()
      .mockResolvedValue({ authorized: true, user: null }),
    isOakError: (error: unknown) => error instanceof actualOakError,
    oakErrorToResponse: (error: InstanceType<typeof actualOakError>) => {
      return mockNextResponseJson(
        { error: { message: error.message } },
        { status: error.config.responseStatusCode ?? 500 },
      );
    },
    __mockReportError: reporterMock,
  };
});

jest.mock("./asset.handler");

const mockAssetHandler = assetHandler as jest.Mock;

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
    tpc_downloadablefiles: [
      {
        asset_id: 123,
        media_object: { display_name: "Test Document" },
      },
    ],
  },
  isGeoRestricted: false,
  isLoginRequired: false,
};

describe("GET /api/lesson/[lessonSlug]/asset", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLessonAssets.mockResolvedValue(mockLessonData);
    mockAdditionalAssets.mockResolvedValue([]);
    mockAssetHandler.mockResolvedValue({
      url: "https://signed-url.com/asset.pptx",
      filename: "presentation.pptx",
      fileSize: "10MB",
      contentType:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    });
  });

  it("should return 200 with asset data on success", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/asset?resource=presentation",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith({
      data: {
        url: "https://signed-url.com/asset.pptx",
        filename: "presentation.pptx",
        fileSize: "10MB",
        contentType:
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      },
    });
  });

  it("should return 404 when lesson is not found", async () => {
    mockLessonAssets.mockResolvedValueOnce(null);

    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/nonexistent-lesson/asset?resource=presentation",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "nonexistent-lesson" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: { message: "Requested lesson not found" } },
      { status: 404 },
    );
  });

  it("should return 400 validation error when resource is missing", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/asset",
    );

    const { AssetSearchParamsSchema } = jest.requireMock(
      "@/node-lib/curriculum-resources-downloads",
    );
    const { ZodError } = await import("zod");
    AssetSearchParamsSchema.parse.mockImplementationOnce(() => {
      throw new ZodError([
        {
          code: "custom",
          message: "Query parameter 'resource' is required",
          path: ["resource"],
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
      "http://localhost:3000/api/lesson/test-lesson/asset?resource=presentation",
    );

    const result = await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(result).toBe(mockUnauthorizedResponse);
  });

  it("should fetch additional asset when resource is additional-files", async () => {
    const mockAdditionalAsset = {
      asset_id: 123,
      asset_object: {
        pdf: { bucket_name: "bucket", bucket_path: "files/doc.pdf" },
      },
    };
    mockAdditionalAssets.mockResolvedValueOnce([mockAdditionalAsset]);

    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/asset?resource=additional-files&assetId=123",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(mockAdditionalAssets).toHaveBeenCalledWith({
      assetIds: [123],
    });
    expect(mockAssetHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        lesson: mockLessonData.lesson,
        resource: "additional-files",
        additionalAsset: mockAdditionalAsset,
      }),
      expect.objectContaining({
        gcsHelpers: expect.any(Object),
      }),
    );
  });

  it("should call assetHandler with correct params for standard resource", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/asset?resource=presentation",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(mockAssetHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        lesson: mockLessonData.lesson,
        resource: "presentation",
        additionalAsset: null,
      }),
      expect.objectContaining({
        gcsHelpers: expect.any(Object),
      }),
    );
  });

  it("should return OakError with correct status code", async () => {
    const OakError = (await import("@/errors/OakError")).default;
    mockAssetHandler.mockRejectedValueOnce(
      new OakError({ code: "downloads/resource-not-found" }),
    );

    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/asset?resource=presentation",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: { message: "Requested download resources not found" } },
      { status: 404 },
    );
    expect(mockReportError).toHaveBeenCalled();
  });

  it("should return 500 on unexpected errors", async () => {
    const unexpectedError = new Error("Unexpected error");
    mockAssetHandler.mockRejectedValueOnce(unexpectedError);

    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/asset?resource=presentation",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: { message: "Internal server error" } },
      { status: 500 },
    );
    expect(mockReportError).toHaveBeenCalled();
  });
});
