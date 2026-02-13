import checkFilesHandler, {
  CheckFilesDependencies,
  CheckFilesParams,
} from "./check-files.handler";

import OakError from "@/errors/OakError";
import type { LessonAssets } from "@/node-lib/curriculum-api-2023/queries/curriculumResourcesDownloads/lessonAssets.schema";
import type { AdditionalAsset } from "@/node-lib/curriculum-api-2023/queries/curriculumResourcesDownloads/additionalAssets.schema";
import { createMockGcsHelpers } from "@/node-lib/curriculum-resources-downloads/gcs/gcsHelpers.mocks";

const lesson: LessonAssets = {
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
  asset_worksheet: {
    asset_type: "worksheet",
    asset_uid: "worksheet-123",
    updated_at: "2024-01-01T00:00:00.000Z",
    asset_object: {
      pdf: {
        bucket_name: "bucket--ingested-assets",
        bucket_path: "worksheets/worksheet.pdf",
      },
    },
  },
  tpc_downloadablefiles: [
    { asset_id: 123, media_object: { display_name: "test-file" } },
  ],
};

// Mock additional assets fixture
const additionalAssets: AdditionalAsset[] = [
  {
    asset_id: 123,
    asset_type: "downloadable_file",
    asset_uid: "additional-123",
    updated_at: "2024-01-01T00:00:00.000Z",
    asset_object: {
      mp3: {
        bucket_name: "bucket--ingested-assets",
        bucket_path: "additional/file.mp3",
      },
    },
    title: "test-audio",
  },
];

const mockGcsHelpers = createMockGcsHelpers({
  checkFileExistsInBucket: jest.fn().mockResolvedValue(true),
  checkFileExistsAndGetSize: jest.fn().mockResolvedValue({
    exists: true,
    fileSize: "10MB",
  }),
  getFileSize: jest.fn().mockResolvedValue("10MB"),
  getSignedUrl: jest.fn().mockResolvedValue("https://signed-url.com/file"),
  fetchResourceFromGCS: jest.fn().mockResolvedValue(Buffer.from("test")),
  getFileWriteStream: jest.fn().mockResolvedValue(Buffer.from("test")),
});

const createParams = (
  overrides: Partial<CheckFilesParams> = {},
): CheckFilesParams => ({
  lesson,
  selection: ["presentation"],
  additionalFiles: undefined,
  additionalFilesAssets: [],
  ...overrides,
});

const deps: CheckFilesDependencies = {
  gcsHelpers: mockGcsHelpers,
};

describe("/api/lesson/{lessonSlug}/check-files", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("throws OakError if lesson is null (not found)", async () => {
    await expect(
      checkFilesHandler(
        createParams({ lesson: null as unknown as LessonAssets }),
        deps,
      ),
    ).rejects.toThrow(OakError);
  });

  test("returns {exists:false,errors:[...]} when requested resource has invalid updatedAt", async () => {
    const lessonWithInvalidDate: LessonAssets = {
      ...lesson,
      asset_slidedeck: {
        ...lesson.asset_slidedeck!,
        updated_at: "not a valid date",
      },
    };

    const existence = await checkFilesHandler(
      createParams({
        lesson: lessonWithInvalidDate,
        selection: ["presentation"],
      }),
      deps,
    );

    expect(existence).toEqual([
      [
        "presentation",
        {
          errors: [
            {
              message: "resource has invalid updatedAt",
              resourceType: "slidedeck--pptx",
            },
          ],
          exists: false,
        },
      ],
    ]);
  });

  test("returns correct format for asset existence check", async () => {
    const existence = await checkFilesHandler(
      createParams({ selection: ["presentation"] }),
      deps,
    );

    expect(existence).toEqual([
      [
        "presentation",
        {
          exists: true,
          errors: [],
          ext: "pptx",
          fileSize: "10MB",
        },
      ],
    ]);
  });

  test("throws ZodError when selection includes unavailable resources", async () => {
    const lessonWithoutSlidedeck: LessonAssets = {
      ...lesson,
      asset_slidedeck: undefined,
    };

    await expect(
      checkFilesHandler(
        createParams({
          lesson: lessonWithoutSlidedeck,
          selection: ["presentation"],
        }),
        deps,
      ),
    ).rejects.toThrow();
  });

  test("returns additional files correctly when they are in selections and assets are passed", async () => {
    const existence = await checkFilesHandler(
      createParams({
        selection: ["additional-files"],
        additionalFiles: ["123"],
        additionalFilesAssets: additionalAssets,
      }),
      deps,
    );

    expect(existence).toEqual([
      [
        "additional-files",
        {
          exists: true,
          errors: [],
          ext: "mp3",
          fileSize: "10MB",
        },
      ],
    ]);
  });

  test("calls gcsHelpers.checkFileExistsInBucket for each resource", async () => {
    await checkFilesHandler(
      createParams({ selection: ["presentation"] }),
      deps,
    );

    expect(mockGcsHelpers.checkFileExistsInBucket).toHaveBeenCalledWith({
      gcsFilePath: "slidedecks/presentation.pptx",
      gcsBucketName: "bucket--ingested-assets",
    });
  });

  test("calls gcsHelpers.getFileSize for each resource", async () => {
    await checkFilesHandler(
      createParams({ selection: ["presentation"] }),
      deps,
    );

    expect(mockGcsHelpers.getFileSize).toHaveBeenCalledWith({
      gcsFilePath: "slidedecks/presentation.pptx",
      gcsBucketName: "bucket--ingested-assets",
    });
  });
});
