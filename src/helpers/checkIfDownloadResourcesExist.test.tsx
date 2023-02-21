import checkIfDownloadResourcesExist from "./checkIfDownloadResourcesExist";

const response = {
  resources: {
    "exit-quiz-answers": true,
    "worksheet-pdf": true,
  },
};

describe("checkIfDownloadResourcesExist()", () => {
  let downloadResourcesExist;

  it("should return correct data if fetch is successful", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(response),
      })
    ) as jest.Mock;

    downloadResourcesExist = await checkIfDownloadResourcesExist(
      "lesson-slug",
      "exit-quiz-answers,worksheet-pdf"
    );

    expect(downloadResourcesExist).toEqual(response);
  });

  it("should return null if fetch is not successful", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(),
      })
    ) as jest.Mock;

    downloadResourcesExist = await checkIfDownloadResourcesExist(
      "lesson-slug",
      "exit-quiz-answers,worksheet-pdf"
    );

    expect(downloadResourcesExist).toEqual(null);
  });
});
