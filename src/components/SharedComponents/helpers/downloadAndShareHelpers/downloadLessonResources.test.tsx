import { createLessonDownloadLink } from "./createDownloadLink";
import downloadLessonResources from "./downloadLessonResources";

import { isInIframe } from "@/utils/iframe";
import type { ResourcesToDownloadArrayType } from "@/components/TeacherComponents/types/downloadAndShare.types";

jest.mock("./createDownloadLink", () => ({
  createLessonDownloadLink: jest.fn(),
}));
jest.mock("./createAndClickHiddenDownloadLink", () => ({
  __esModule: true,
  default: jest.fn(),
  isInIframe: jest.fn(),
  createLink: jest.fn(),
  hideAndClickDownloadLink: jest.fn(),
}));
jest.mock("@/utils/iframe", () => ({
  isInIframe: jest.fn(),
}));

const mockIsInIframe = isInIframe as jest.MockedFunction<typeof isInIframe>;

const data = {
  url: "downloadUrl",
};

const successResponse = {
  json: () =>
    Promise.resolve({
      data,
    }),
  ok: true,
};

const resourcesToDownload: ResourcesToDownloadArrayType = [
  "exit-quiz-answers",
  "worksheet-pdf",
];

describe("downloadLessonResources", () => {
  let windowOpenSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() => Promise.resolve(successResponse)) as jest.Mock;
    mockIsInIframe.mockReturnValue(false);
    windowOpenSpy = jest
      .spyOn(globalThis, "open")
      .mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  it("should return when no resource types are passed", async () => {
    console.log = jest.fn();
    await downloadLessonResources({
      lessonSlug: "lesson-slug",
      selectedResourceTypes: [],
      isLegacyDownload: true,
    });

    expect(console.log).toHaveBeenCalledWith("no resources to download");
  });

  it("should call createDownloadResourcesLink with correct parameters", async () => {
    await downloadLessonResources({
      lessonSlug: "lesson-slug",
      selectedResourceTypes: resourcesToDownload,
      isLegacyDownload: true,
    });

    expect(createLessonDownloadLink).toHaveBeenCalledWith({
      lessonSlug: "lesson-slug",
      selection: "exit-quiz-answers,worksheet-pdf",
      isLegacyDownload: true,
    });
  });

  describe("when in an iframe", () => {
    beforeEach(() => {
      mockIsInIframe.mockReturnValue(true);
    });

    it("should open the download page URL instead of fetching the signed URL", async () => {
      await downloadLessonResources({
        lessonSlug: "lesson-slug",
        selectedResourceTypes: resourcesToDownload,
        isLegacyDownload: true,
      });

      expect(windowOpenSpy).toHaveBeenCalledWith(
        "/classroom/download/lesson-slug?selection=exit-quiz-answers%2Cworksheet-pdf",
        "_blank",
        "noopener,noreferrer",
      );
      expect(createLessonDownloadLink).not.toHaveBeenCalled();
    });

    it("should include additionalFiles in the download page URL when present", async () => {
      await downloadLessonResources({
        lessonSlug: "lesson-slug",
        selectedResourceTypes: resourcesToDownload,
        selectedAdditionalFilesIds: [1, 2, 3],
        isLegacyDownload: true,
      });

      expect(windowOpenSpy).toHaveBeenCalledWith(
        "/classroom/download/lesson-slug?selection=exit-quiz-answers%2Cworksheet-pdf&additionalFiles=1%2C2%2C3",
        "_blank",
        "noopener,noreferrer",
      );
    });

    it("should not include additionalFiles param when not provided", async () => {
      await downloadLessonResources({
        lessonSlug: "lesson-slug",
        selectedResourceTypes: resourcesToDownload,
        isLegacyDownload: true,
      });

      const url = windowOpenSpy.mock.calls[0]?.[0] as string;
      expect(url).not.toContain("additionalFiles");
    });
  });
});
