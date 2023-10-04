import getDownloadResourcesExistence, {
  DownloadsApiCheckFilesResponseSchema,
} from "./getDownloadResourcesExistence";

import OakError from "@/errors/OakError";

const data: DownloadsApiCheckFilesResponseSchema["data"] = {
  resources: [
    ["exit-quiz-answers", { exists: true }],
    ["worksheet-pdf", { exists: true }],
  ],
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
    global.fetch = jest.fn(() => Promise.resolve(successResponse)) as jest.Mock;
  });

  it("should return correct data if fetch is successful", async () => {
    downloadResourcesExist = await getDownloadResourcesExistence(
      "lesson-slug",
      "exit-quiz-answers,worksheet-pdf",
      true,
    );

    expect(downloadResourcesExist).toEqual(data);
  });

  it("should throw error if fetch throws", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject("bad thing"),
    );

    try {
      await getDownloadResourcesExistence(
        "lesson-slug",
        "exit-quiz-answers,worksheet-pdf",
        true,
      );
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
      await getDownloadResourcesExistence(
        "lesson-slug",
        "exit-quiz-answers,worksheet-pdf",

        true,
      );
    } catch (error) {
      expect((error as OakError).message).toEqual("Failed to fetch downloads");
      expect((error as OakError).meta).toEqual({
        isLegacyDownload: true,
        lessonSlug: "lesson-slug",
        resourceTypesString: "exit-quiz-answers,worksheet-pdf",
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
      await getDownloadResourcesExistence(
        "lesson-slug",
        "exit-quiz-answers,worksheet-pdf",
        true,
      );
    } catch (error) {
      expect((error as OakError).message).toEqual("Failed to fetch downloads");
      expect((error as OakError).meta).toEqual({
        isLegacyDownload: true,
        lessonSlug: "lesson-slug",
        resourceTypesString: "exit-quiz-answers,worksheet-pdf",
      });
    }
  });
  it("should fetch from legacy vercel legacy vercel api if isLegacyDownload = true", async () => {
    downloadResourcesExist = await getDownloadResourcesExistence(
      "lesson-slug",
      "exit-quiz-answers,worksheet-pdf",
      true,
    );

    expect(global.fetch).toBeCalledWith(
      "https://api.thenational.academy/api/downloads/lesson/lesson-slug/check-files?selection=exit-quiz-answers,worksheet-pdf",
    );
  });
  it("should fetch from download api if isLegacyDownload = false", async () => {
    downloadResourcesExist = await getDownloadResourcesExistence(
      "lesson-slug",
      "exit-quiz-answers,worksheet-pdf",

      false,
    );

    expect(global.fetch).toBeCalledWith(
      "https://downloads-api.thenational.academy/api/lesson/lesson-slug/check-files?selection=exit-quiz-answers,worksheet-pdf",
    );
  });
});
