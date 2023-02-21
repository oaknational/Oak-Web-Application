import fetch from "jest-fetch-mock";

import checkIfDownloadResourcesExist from "./checkIfDownloadResourcesExist";

const response = {
  resources: {
    "exit-quiz-answers": true,
    "worksheet-pdf": true,
  },
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: response }),
  })
) as jest.Mock;

describe("checkIfDownloadResourcesExist()", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  let downloadResourcesExist;

  it("should return correct data if fetch is successful", async () => {
    downloadResourcesExist = await checkIfDownloadResourcesExist(
      "lesson-slug",
      "exit-quiz-answers,worksheet-pdf"
    );

    expect(downloadResourcesExist).toEqual(response);
  });
});
