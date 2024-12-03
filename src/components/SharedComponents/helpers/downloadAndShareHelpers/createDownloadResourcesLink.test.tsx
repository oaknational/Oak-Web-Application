import { createLessonDownloadLink } from "./createDownloadResourcesLink";

import OakError from "@/errors/OakError";

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

describe("createDownloadResourcesLink()", () => {
  let downloadResourcesLink;

  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve(successResponse)) as jest.Mock;
  });

  it("should return correct data if fetch is successful", async () => {
    downloadResourcesLink = await createLessonDownloadLink({
      lessonSlug: "lesson-slug",
      isLegacyDownload: true,
      selection: "exit-quiz-answers,worksheet-pdf",
    });

    expect(downloadResourcesLink).toEqual(data.url);
  });

  it("should throw error if fetch throws", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject("bad thing"),
    );

    try {
      await createLessonDownloadLink({
        lessonSlug: "lesson-slug",
        selection: "exit-quiz-answers,worksheet-pdf",
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
      await createLessonDownloadLink({
        lessonSlug: "lesson-slug",
        selection: "exit-quiz-answers,worksheet-pdf",
        isLegacyDownload: true,
      });
    } catch (error) {
      expect((error as OakError).message).toEqual("Failed to fetch downloads");
      expect((error as OakError).meta).toEqual({
        isLegacyDownload: true,
        downloadSlug: "lesson-slug",
        selection: "exit-quiz-answers,worksheet-pdf",
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
      await createLessonDownloadLink({
        lessonSlug: "lesson-slug",
        selection: "exit-quiz-answers,worksheet-pdf",
        isLegacyDownload: true,
      });
    } catch (error) {
      expect((error as OakError).message).toEqual("Failed to fetch downloads");
      expect((error as OakError).meta).toEqual({
        isLegacyDownload: true,
        downloadSlug: "lesson-slug",
        selection: "exit-quiz-answers,worksheet-pdf",
      });
    }
  });
  it("should fetch from new api if isLegacyDownloads = true", async () => {
    await createLessonDownloadLink({
      lessonSlug: "lesson-slug",
      selection: "exit-quiz-answers,worksheet-pdf",
      isLegacyDownload: true,
    });

    expect(global.fetch).toBeCalledWith(
      "https://mockdownloads.com/api/lesson/lesson-slug/download?selection=exit-quiz-answers,worksheet-pdf",
      { headers: { "X-Should-Authenticate-Download": "false" } },
    );
  });
  it("should fetch from download api if isLegacyDownloads = false", async () => {
    await createLessonDownloadLink({
      lessonSlug: "lesson-slug",
      selection: "exit-quiz-answers,worksheet-pdf",
      isLegacyDownload: false,
    });

    expect(global.fetch).toBeCalledWith(
      "https://mockdownloads.com/api/lesson/lesson-slug/download?selection=exit-quiz-answers,worksheet-pdf",
      { headers: { "X-Should-Authenticate-Download": "false" } },
    );
  });
  it("should throw an error when NEXT_PUBLIC_DOWNLOAD_API_URL is not defined", async () => {
    const originalEnv = process.env;
    delete process.env.NEXT_PUBLIC_DOWNLOAD_API_URL;

    try {
      await createLessonDownloadLink({
        lessonSlug: "lesson-slug",
        selection: "exit-quiz-answers,worksheet-pdf",
        isLegacyDownload: false,
      });
    } catch (error) {
      expect(error).toEqual(
        new TypeError(
          "process.env.NEXT_PUBLIC_DOWNLOAD_API_URL must be defined",
        ),
      );
    } finally {
      process.env = originalEnv;
    }
  });
  it("should fetch with correct headers including Authorization when authToken is provided", async () => {
    const authToken = "testToken";
    await createLessonDownloadLink({
      lessonSlug: "lesson-slug",
      selection: "exit-quiz-answers,worksheet-pdf",
      isLegacyDownload: true,
      authToken,
      authFlagEnabled: true,
    });

    expect(global.fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          Authorization: `Bearer ${authToken}`,
          "X-Should-Authenticate-Download": "true",
        },
      }),
    );
  });

  it("should fetch with X-Should-Authenticate-Download set to false when authFlagEnabled is false", async () => {
    await createLessonDownloadLink({
      lessonSlug: "lesson-slug",
      selection: "exit-quiz-answers,worksheet-pdf",
      isLegacyDownload: true,
      authFlagEnabled: false,
    });

    expect(global.fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          "X-Should-Authenticate-Download": "false",
        },
      }),
    );
  });
});
