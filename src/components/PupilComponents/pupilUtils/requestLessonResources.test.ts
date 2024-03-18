import { requestLessonResources } from "./requestLessonResources";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { pupilLessonOverviewFixture } from "@/node-lib/curriculum-api-2023/fixtures/pupilLessonOverview.fixture";

jest.mock("@/utils/handleTranscript");

describe("requestLessonResources", () => {
  const lessonDownloadsCanonicalResponse = {
    downloads: [],
    isLegacy: false,
    lessonSlug: "lessonSlug",
    lessonTitle: "lessonTitle",
    hasDownloadableResources: false,
    expired: false,
    pathways: [],
  };

  let getDownloadResourcesExistenceSpy: jest.SpyInstance;
  beforeEach(() => {
    getDownloadResourcesExistenceSpy = jest
      .spyOn(curriculumApi2023, "lessonDownloadsCanonical")
      .mockResolvedValue(lessonDownloadsCanonicalResponse);
  });
  afterEach(() => {
    getDownloadResourcesExistenceSpy.mockRestore();
  });

  it("sets `hasWorksheet` to `true` when a worksheet exists", async () => {
    getDownloadResourcesExistenceSpy.mockResolvedValue({
      downloads: [{ type: "worksheet-pdf", exists: true }],
    });

    const res = await requestLessonResources({
      curriculumData: {
        ...pupilLessonOverviewFixture(),
      },
    });

    expect(res.hasWorksheet).toBe(true);
  });

  it("sets `hasWorksheet` to `false` when a worksheet does not exist", async () => {
    getDownloadResourcesExistenceSpy.mockResolvedValue({
      ...lessonDownloadsCanonicalResponse,
      downloads: [["worksheet-pdf", { exists: false }]],
    });

    const res = await requestLessonResources({
      curriculumData: {
        ...pupilLessonOverviewFixture(),
      },
    });

    expect(res.hasWorksheet).toBe(false);
  });

  // refactored into helper file
  it("tests for the presence of a worksheet", async () => {
    await requestLessonResources({
      curriculumData: {
        ...pupilLessonOverviewFixture({
          lessonSlug: "lessonSlug",
          isLegacy: false,
        }),
      },
    });

    expect(getDownloadResourcesExistenceSpy).toHaveBeenCalledWith({
      lessonSlug: "lessonSlug",
    });
  });
});
