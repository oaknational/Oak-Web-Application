import { dateStringIsValid, getResourceHelpers } from "./getResourceHelpers";

import curriculumResourceLessonDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumResourceLessonDownloads.fixture";
import curriculumResourceAdditionalAssetFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumResourceAdditionalAsset.fixture";
import curriculumApi from "@/node-lib/curriculum-api-2023";

describe("dateStringIsValid()", () => {
  test("returns true for valid iso date string", () => {
    expect(dateStringIsValid("2021-08-01T00:00:00.000Z")).toBe(true);
  });
  test("returns false for invalid date string", () => {
    expect(dateStringIsValid("")).toBe(false);
  });
});

const resourceHelpers = getResourceHelpers();
const lesson = curriculumResourceLessonDownloadsFixture();
const additionalAssets = [curriculumResourceAdditionalAssetFixture()];

describe("resourceHelpers::getResourceList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should add errors if can't get GCS file paths for asset", () => {
    const result = resourceHelpers.getSelectedResourceList({
      lesson: {
        ...curriculumResourceLessonDownloadsFixture({
          asset_slidedeck: {
            asset_type: "slidedeck",
            asset_uid: "slidedeck-123",
            updated_at: "2024-01-01T00:00:00.000Z",
            asset_object: null,
          },
        }),
      },
      selection: ["presentation"],
      additionalFilesAssets: [],
    });
    if (result[0]) {
      expect(result[0].errors).toEqual([
        { message: "resource has no file path" },
      ]);
    }
  });

  test("should add errors if updatedAt is not valid", () => {
    const result = resourceHelpers.getSelectedResourceList({
      lesson: {
        ...curriculumResourceLessonDownloadsFixture({}),
        // @ts-expect-error test data
        asset_worksheet: {
          ...lesson.asset_worksheet,
          updated_at: "not a date",
        },
        // @ts-expect-error test data
        quiz_exit: {
          ...lesson.quiz_exit,
          updated_at: "not a date",
        },
        // @ts-expect-error test data
        quiz_starter: {
          ...lesson.quiz_starter,
          updated_at: "",
        },
      },
      selection: ["worksheet-pdf", "exit-quiz-questions", "intro-quiz-answers"],
      additionalFilesAssets: [],
    });

    // worksheet
    expect(result[0]?.errors).toEqual([
      {
        message: "resource has invalid updatedAt",
      },
    ]);

    // worksheet answers
    expect(result[1]?.errors).toEqual([]);
    // exit quiz
    expect(result[2]?.errors).toEqual([
      {
        message: "resource has invalid updatedAt",
      },
    ]);
    // intro quiz
    expect(result[3]?.errors).toEqual([
      {
        message: "resource has no updatedAt",
      },
    ]);
  });

  test("should filter out resources not in the selection", () => {
    const result = resourceHelpers.getSelectedResourceList({
      lesson,
      selection: ["presentation"],
      additionalFilesAssets: [],
    });
    expect(result).toEqual([
      {
        isValid: true,
        errors: [],
        lesson,
        gcsFilePath: "slidedecks/presentation.pptx",
        gcsBucketName: "bucket--ingested-assets",
        isPublished: true,
        updatedAt: "2024-01-01T00:00:00.000Z",
        ext: "pptx",
        fileSize: "1 MB",
        pathInZip: "slide-deck.pptx",
        type: "slidedeck--pptx",
      },
    ]);
  });

  test("should return the expected list", () => {
    const result = resourceHelpers.getSelectedResourceList({
      lesson,
      selection: ["presentation", "worksheet-pdf"],
      additionalFilesAssets: [],
    });
    expect(result).toEqual([
      {
        isValid: true,
        isPublished: true,
        errors: [],
        lesson,
        gcsFilePath: "slidedecks/presentation.pptx",
        gcsBucketName: "bucket--ingested-assets",
        updatedAt: "2024-01-01T00:00:00.000Z",
        ext: "pptx",
        fileSize: "1 MB",
        pathInZip: "slide-deck.pptx",
        type: "slidedeck--pptx",
      },
      {
        isValid: true,
        isPublished: true,
        errors: [],
        lesson,
        gcsFilePath: "worksheets/worksheet.pdf",
        gcsBucketName: "bucket--ingested-assets",
        updatedAt: "2024-01-01T00:00:00.000Z",
        pathInZip: "worksheet-questions.pdf",
        ext: "pdf",
        fileSize: "1 MB",
        type: "worksheet-questions--pdf",
      },
      {
        isValid: true,
        isPublished: true,
        errors: [],
        lesson,
        gcsFilePath: "worksheets/worksheet-answers.pdf",
        gcsBucketName: "bucket--ingested-assets",
        updatedAt: "2024-01-01T00:00:00.000Z",
        pathInZip: "worksheet-answers.pdf",
        ext: "pdf",
        fileSize: "1 MB",
        type: "worksheet-answers--pdf",
      },
    ]);
  });

  test("lesson guides should be downloadable pdf and docx format", () => {
    const result = resourceHelpers.getSelectedResourceList({
      lesson,
      selection: ["lesson-guide-pdf", "lesson-guide-docx"],
      additionalFilesAssets: [],
    });

    expect(result).toEqual([
      {
        isValid: true,
        isPublished: true,
        errors: [],
        lesson,
        gcsFilePath: "lesson-guide/lesson-guide.pdf",
        gcsBucketName: "bucket--ingested-assets",
        updatedAt: "2023-01-01T00:00:00.000Z",
        ext: "pdf",
        fileSize: "1 MB",
        pathInZip: "lesson-guide.pdf",
        type: "lesson-guide--pdf",
      },
      {
        isValid: true,
        isPublished: true,
        errors: [],
        lesson,
        gcsFilePath: "lesson-guide/lesson-guide.docx",
        gcsBucketName: "bucket--ingested-assets",
        updatedAt: "2023-01-01T00:00:00.000Z",
        pathInZip: "lesson-guide.docx",
        ext: "docx",
        fileSize: "1 MB",
        type: "lesson-guide--docx",
      },
    ]);
  });

  test("additional files should be downoadable and have a correct pathInZip", () => {
    jest
      .spyOn(curriculumApi, "additionalAssets")
      .mockResolvedValue(additionalAssets);

    const result = resourceHelpers.getSelectedResourceList({
      lesson,
      selection: ["additional-files"],
      additionalFilesAssets: additionalAssets,
    });

    expect(result).toEqual([
      {
        isValid: true,
        isPublished: true,
        errors: [],
        lesson,
        gcsFilePath: "sample-additional-file.pdf",
        gcsBucketName: "bucket--ingested-assets",
        updatedAt: "2023-01-01T00:00:00.000Z",
        ext: "mp3",
        fileSize: "1 MB",
        pathInZip: "Sample Additional File.mp3",
        type: "additional-files",
      },
    ]);
  });
});
