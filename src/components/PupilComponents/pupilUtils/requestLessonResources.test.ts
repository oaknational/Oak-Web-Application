import { requestLessonResources } from "./requestLessonResources";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";

jest.mock("@/utils/handleTranscript", () => {
  return {
    ...jest.requireActual("@/utils/handleTranscript"),
    getCaptionsFromFile: jest.fn().mockResolvedValue([]),
  };
});

describe("requestLessonResources", () => {
  const lessonDownloadsCanonicalResponse = {
    downloads: [],
    isLegacy: false,
    lessonSlug: "lessonSlug",
    lessonTitle: "lessonTitle",
    hasDownloadableResources: false,
    expired: false,
    pathways: [],
    updatedAt: "2021-01-01T00:00:00.000Z",
  };

  let getDownloadResourcesExistenceSpy: jest.SpyInstance;
  beforeEach(() => {
    getDownloadResourcesExistenceSpy = jest
      .spyOn(curriculumApi2023, "lessonDownloadsCanonical")
      .mockResolvedValue({
        ...lessonDownloadsCanonicalResponse,
        isSpecialist: false,
      });
  });
  afterEach(() => {
    getDownloadResourcesExistenceSpy.mockRestore();
  });

  it("sets `hasWorksheet` to `true` when a worksheet exists", async () => {
    getDownloadResourcesExistenceSpy.mockResolvedValue({
      downloads: [{ type: "worksheet-pdf", exists: true }],
    });

    const res = await requestLessonResources({
      lessonContent: lessonContentFixture({}),
    });

    expect(res.hasWorksheet).toBe(true);
  });

  it("sets `hasWorksheet` to `false` when a worksheet does not exist", async () => {
    getDownloadResourcesExistenceSpy.mockResolvedValue({
      ...lessonDownloadsCanonicalResponse,
      downloads: [["worksheet-pdf", { exists: false }]],
    });

    const res = await requestLessonResources({
      lessonContent: lessonContentFixture({}),
    });

    expect(res.hasWorksheet).toBe(false);
  });

  // refactored into helper file
  it("tests for the presence of a worksheet", async () => {
    await requestLessonResources({
      lessonContent: lessonContentFixture({
        lessonSlug: "lessonSlug",
        isLegacy: false,
      }),
    });

    expect(getDownloadResourcesExistenceSpy).toHaveBeenCalledWith({
      lessonSlug: "lessonSlug",
    });
  });

  it("for legacy lessons it splits the transcript into sentences", async () => {
    const transcriptSentences = [
      "This is a sentence. This is another sentence.",
    ];

    const res = await requestLessonResources({
      lessonContent: lessonContentFixture({
        isLegacy: true,
        transcriptSentences,
      }),
    });

    expect(res.transcriptSentences).toEqual([
      "This is a sentence.",
      "This is another sentence.",
    ]);
  });
});
