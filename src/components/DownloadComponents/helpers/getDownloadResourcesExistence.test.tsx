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
      );
    } catch (error) {
      expect((error as Error).message).toEqual("API error");
    }
  });
});
