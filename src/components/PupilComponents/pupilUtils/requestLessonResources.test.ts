import { requestLessonResources } from "./requestLessonResources";

import * as getDownloadResourcesExistence from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
import { pupilLessonOverviewFixture } from "@/node-lib/curriculum-api-2023/fixtures/pupilLessonOverview.fixture";

jest.mock("@/utils/handleTranscript");
jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence",
);

describe("requestLessonResources", () => {
  let getDownloadResourcesExistenceSpy: jest.SpyInstance;
  beforeEach(() => {
    getDownloadResourcesExistenceSpy = jest
      .spyOn(getDownloadResourcesExistence, "default")
      .mockResolvedValue({ resources: [] });
  });
  afterEach(() => {
    getDownloadResourcesExistenceSpy.mockRestore();
  });

  it("sets `hasWorksheet` to `true` when a worksheet exists", async () => {
    getDownloadResourcesExistenceSpy.mockResolvedValue({
      resources: [["worksheet-pdf", { exists: true }]],
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
      resources: [["worksheet-pdf", { exists: false }]],
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

    expect(getDownloadResourcesExistence.default).toHaveBeenCalledWith(
      "lessonSlug",
      "worksheet-pdf",
      false,
    );
  });

  it("does not blow up if the `getDownloadResourcesExistence` check fails", async () => {
    getDownloadResourcesExistenceSpy.mockRejectedValue(new Error("oh no!"));

    const res = await requestLessonResources({
      curriculumData: {
        ...pupilLessonOverviewFixture(),
      },
    });

    expect(res.hasWorksheet).toBe(false);
  });
});
