import getDownloadResourcesExistence from "./getDownloadResourcesExistence";

const data = {
  resources: {
    "exit-quiz-answers": true,
    "worksheet-pdf": true,
  },
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
      "teachers",
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
        "teachers",
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
        "teachers",
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
      await getDownloadResourcesExistence(
        "lesson-slug",
        "exit-quiz-answers,worksheet-pdf",
        "teachers",
      );
    } catch (error) {
      expect((error as Error).message).toEqual("API error");
    }
  });
  it("should fetch from legacy vercel legacy vercel api if viewType is teachers", async () => {
    downloadResourcesExist = await getDownloadResourcesExistence(
      "lesson-slug",
      "exit-quiz-answers,worksheet-pdf",
      "teachers",
    );

    expect(global.fetch).toBeCalledWith(
      "https://api.thenational.academy/api/downloads/lesson/lesson-slug/check-files?selection=exit-quiz-answers,worksheet-pdf",
    );
  });
  it("should fetch from download api if viewType is teachers-2023", async () => {
    downloadResourcesExist = await getDownloadResourcesExistence(
      "lesson-slug",
      "exit-quiz-answers,worksheet-pdf",
      "teachers-2023",
    );

    expect(global.fetch).toBeCalledWith(
      "https://downloads-api.thenational.academy/api/lesson/lesson-slug/check-files?selection=exit-quiz-answers,worksheet-pdf",
    );
  });
  it("should throw an error when NEXT_PUBLIC_DOWNLOAD_API_URL is not defined", async () => {
    const originalEnv = process.env;
    delete process.env.NEXT_PUBLIC_DOWNLOAD_API_URL;

    try {
      await getDownloadResourcesExistence(
        "lesson-slug",
        "exit-quiz-answers,worksheet-pdf",
        "teachers-2023",
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
      await getDownloadResourcesExistence(
        "lesson-slug",
        "exit-quiz-answers,worksheet-pdf",
        "teachers-2023",
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
