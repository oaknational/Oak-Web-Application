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
      );
    } catch (error) {
      expect((error as Error).message).toEqual("API error");
    }
  });
});
