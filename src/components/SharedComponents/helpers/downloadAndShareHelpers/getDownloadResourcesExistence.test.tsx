import {
  getLessonDownloadResourcesExistence,
  DownloadsApiCheckFilesResponseSchema,
  LegacyDownloadsApiCheckFilesResponseSchema,
} from "./getDownloadResourcesExistence";

import OakError from "@/errors/OakError";

const data: DownloadsApiCheckFilesResponseSchema["data"] = {
  resources: [
    ["exit-quiz-answers", { exists: true, errors: [] }],
    ["worksheet-pdf", { exists: true, errors: [] }],
  ],
};

const legacyData: LegacyDownloadsApiCheckFilesResponseSchema["data"] = {
  resources: { "exit-quiz-answers": true, "worksheet-pdf": true },
};

const successResponse = {
  json: () =>
    Promise.resolve({
      data,
    }),
  ok: true,
};

describe("checkIfDownloadResourcesExist()", () => {
  let downloadResourcesExist;

  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (
        url ===
        "https://mockdownloads.com/api/lesson/lesson-slug/check-files?selection=exit-quiz-answers,worksheet-pdf"
      ) {
        return Promise.resolve(successResponse);
      } else {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: legacyData,
            }),
          ok: true,
        });
      }
    }) as jest.Mock;
  });

  it("should return correct data if fetch is successful", async () => {
    downloadResourcesExist = await getLessonDownloadResourcesExistence({
      lessonSlug: "lesson-slug",
      resourceTypesString: "exit-quiz-answers,worksheet-pdf",
      isLegacyDownload: false,
    });
    expect(downloadResourcesExist).toEqual(data);
  });

  it("should throw error if fetch throws", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject("bad thing"),
    );

    try {
      await getLessonDownloadResourcesExistence({
        lessonSlug: "lesson-slug",
        resourceTypesString: "exit-quiz-answers,worksheet-pdf",
        isLegacyDownload: true,
      });
    } catch (error) {
      expect(error).toEqual("bad thing");
    }
  });

  it("should throw error if API returns a bad response with a specific error", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            error: "specific error",
          }),
        ok: false,
      }),
    );

    try {
      await getLessonDownloadResourcesExistence({
        lessonSlug: "lesson-slug",
        resourceTypesString: "exit-quiz-answers,worksheet-pdf",
        isLegacyDownload: true,
      });
    } catch (error) {
      expect((error as OakError).message).toEqual(
        "Failed to check file existence",
      );
      expect((error as OakError).meta).toEqual({
        isLegacyDownload: true,
        lessonSlug: "lesson-slug",
        resourceTypesString: "exit-quiz-answers,worksheet-pdf",
        errorSource: "getDownloadExistence",
      });
    }
  });

  it("should throw error if API returns a bad response without a specific error", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data,
          }),
        ok: false,
      }),
    );

    try {
      await getLessonDownloadResourcesExistence({
        lessonSlug: "lesson-slug",
        resourceTypesString: "exit-quiz-answers,worksheet-pdf",
        isLegacyDownload: true,
      });
    } catch (error) {
      expect((error as OakError).message).toEqual(
        "Failed to check file existence",
      );
      expect((error as OakError).meta).toEqual({
        isLegacyDownload: true,
        lessonSlug: "lesson-slug",
        resourceTypesString: "exit-quiz-answers,worksheet-pdf",
        errorSource: "getDownloadExistence",
      });
    }
  });

  it("should fetch from new api if isLegacyDownload = true", async () => {
    downloadResourcesExist = await getLessonDownloadResourcesExistence({
      lessonSlug: "lesson-slug",
      resourceTypesString: "exit-quiz-answers,worksheet-pdf",
      isLegacyDownload: true,
    });

    expect(global.fetch).toBeCalledWith(
      "https://mockdownloads.com/api/lesson/lesson-slug/check-files?selection=exit-quiz-answers,worksheet-pdf",
    );
  });
  it("should fetch from download api if isLegacyDownload = false", async () => {
    downloadResourcesExist = await getLessonDownloadResourcesExistence({
      lessonSlug: "lesson-slug",
      resourceTypesString: "exit-quiz-answers,worksheet-pdf",
      isLegacyDownload: false,
    });

    expect(global.fetch).toBeCalledWith(
      "https://mockdownloads.com/api/lesson/lesson-slug/check-files?selection=exit-quiz-answers,worksheet-pdf",
    );
  });
});
