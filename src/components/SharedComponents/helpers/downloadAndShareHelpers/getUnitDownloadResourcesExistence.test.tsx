import getUnitDownloadResourcesExistence from "./getUnitDownloadResourcesExistence";

const data = {
  exists: true,
  fileSize: "1 MB",
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
    global.fetch = jest.fn(() => {
      return Promise.resolve(successResponse);
    }) as jest.Mock;
  });

  it("should return correct data if fetch is successful", async () => {
    downloadResourcesExist = await getUnitDownloadResourcesExistence(
      "unit-programme-slug",
    );
    expect(downloadResourcesExist).toEqual(data);
  });

  it("should throw error if fetch throws", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject("bad thing"),
    );

    try {
      await getUnitDownloadResourcesExistence("unit-programme-slug");
    } catch (error) {
      expect(error).toEqual("bad thing");
    }
  });
});
