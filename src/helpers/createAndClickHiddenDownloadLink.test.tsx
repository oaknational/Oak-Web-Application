import createAndClickHiddenDownloadLink from "./createAndClickHiddenDownloadLink";

describe("createAndClickHiddenDownloadLink()", () => {
  it("should return passed url", () => {
    global.URL.revokeObjectURL = jest.fn();

    expect(createAndClickHiddenDownloadLink("testUrl")).toEqual({
      url: "testUrl",
    });
  });
});
