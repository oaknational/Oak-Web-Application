import createDownloadResourcesLink from "./createDownloadResourcesLink";

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
    downloadResourcesLink = await createDownloadResourcesLink(
      "lesson-slug",
      "exit-quiz-answers,worksheet-pdf",
      true,
    );

    expect(downloadResourcesLink).toEqual(data.url);
  });

  it("should throw error if fetch throws", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject("bad thing"),
    );

    try {
      await createDownloadResourcesLink(
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
      await createDownloadResourcesLink(
        "lesson-slug",
        "exit-quiz-answers,worksheet-pdf",

        true,
      );
    } catch (error) {
      expect((error as Error).message).toEqual("specific error");
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
      await createDownloadResourcesLink(
        "lesson-slug",
        "exit-quiz-answers,worksheet-pdf",
        true,
      );
    } catch (error) {
      expect((error as Error).message).toEqual("API error");
    }
  });
  it("should fetch from legacy vercel legacy vercel api if isLegacyDownloads = true", async () => {
    await createDownloadResourcesLink(
      "lesson-slug",
      "exit-quiz-answers,worksheet-pdf",
      true,
    );

    expect(global.fetch).toBeCalledWith(
      "https://api.thenational.academy/api/downloads/lesson/lesson-slug?selection=exit-quiz-answers,worksheet-pdf",
    );
  });
  it("should fetch from download api if isLegacyDownloads = false", async () => {
    await createDownloadResourcesLink(
      "lesson-slug",
      "exit-quiz-answers,worksheet-pdf",
      false,
    );

    expect(global.fetch).toBeCalledWith(
      "https://downloads-api.thenational.academy/api/lesson/lesson-slug/download?selection=exit-quiz-answers,worksheet-pdf",
    );
  });
  it("should throw an error when NEXT_PUBLIC_DOWNLOAD_API_URL is not defined", async () => {
    const originalEnv = process.env;
    delete process.env.NEXT_PUBLIC_DOWNLOAD_API_URL;

    try {
      await createDownloadResourcesLink(
        "lesson-slug",
        "exit-quiz-answers,worksheet-pdf",

        false,
      );
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
  it("should throw an error when NEXT_PUBLIC_VERCEL_API_URL is not defined", async () => {
    const originalEnv = process.env;
    delete process.env.NEXT_PUBLIC_VERCEL_API_URL;

    try {
      await createDownloadResourcesLink(
        "lesson-slug",
        "exit-quiz-answers,worksheet-pdf",
        false,
      );
    } catch (error) {
      expect(error).toEqual(
        new TypeError("process.env.NEXT_PUBLIC_VERCEL_API_URL must be defined"),
      );
    } finally {
      process.env = originalEnv;
    }
  });
});
