/**
 * @jest-environment node
 */
import { GET } from "./route";
import checkFilesHandler from "./check-files.handler";

const mockNextResponseJson = jest.fn().mockImplementation((data, init) => ({
  status: init?.status ?? 200,
  json: async () => data,
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: (...args: unknown[]) => mockNextResponseJson(...args),
  },
}));

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
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

jest.mock("./check-files.handler");

const mockCheckFilesHandler = checkFilesHandler as jest.Mock;

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

describe("GET /api/lesson/[lessonSlug]/check-files", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLessonAssets.mockResolvedValue(mockLessonData);
    mockAdditionalAssets.mockResolvedValue([]);
    mockCheckFilesHandler.mockResolvedValue([
      [
        "presentation",
        { exists: true, errors: [], fileSize: "10MB", ext: "pptx" },
      ],
    ]);
  });

  it("should return 200 with resources on success", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/check-files?selection=presentation",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith({
      data: {
        resources: [
          [
            "presentation",
            { exists: true, errors: [], fileSize: "10MB", ext: "pptx" },
          ],
        ],
      },
    });
  });

  it("should return 404 if lesson is not found", async () => {
    mockLessonAssets.mockResolvedValue(null);

    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/nonexistent-lesson/check-files?selection=presentation",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "nonexistent-lesson" }),
    });

    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: { message: "Lesson not found" } },
      { status: 404 },
    );
  });

  it("should return 400 validation error if selection is missing", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/check-files",
    );

    const { parseDownloadParams } = jest.requireMock(
      "@/node-lib/curriculum-resources-downloads",
    );
    parseDownloadParams.mockReturnValueOnce({
      selection: undefined,
      additionalFiles: undefined,
    });

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

  it("should call checkFilesHandler with correct params", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/check-files?selection=presentation",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
    });

    expect(mockCheckFilesHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        lesson: mockLessonData.lesson,
        selection: ["presentation"],
      }),
      expect.objectContaining({
        gcsHelpers: expect.any(Object),
      }),
    );
  });

  it("should report errors to error reporter on unexpected errors", async () => {
    const unexpectedError = new Error("Unexpected error");
    mockCheckFilesHandler.mockRejectedValueOnce(unexpectedError);

    const mockRequest = new Request(
      "http://localhost:3000/api/lesson/test-lesson/check-files?selection=presentation",
    );

    await GET(mockRequest, {
      params: Promise.resolve({ lessonSlug: "test-lesson" }),
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
