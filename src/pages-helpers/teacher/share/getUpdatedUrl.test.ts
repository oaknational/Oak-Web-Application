import { getUpdatedUrl } from "./getUpdatedUrl";

describe("getUpdatedUrl", () => {
  it("should return an updated url with the share id in the storage if available", () => {
    const url = "http://example.com";
    const storageShareId = "1234";
    const unhashedKey = "lesson-1";
    const result = getUpdatedUrl({
      url,
      storageShareId,
      unhashedKey,
      source: "lesson-canonical",
    });
    expect(result.url).toEqual("http://example.com?sid-c2d05c=1234&sm=0&src=1");
    expect(result.shareIdKey).toEqual("sid-c2d05c");
    expect(result.shareId).toEqual("1234");
  });

  it("should override the url with the share id in the storage if available", () => {
    const url = "http://example.com?sid-c2d05c=xxxxxxxx&sm=0&src=1";
    const storageShareId = "1234";
    const unhashedKey = "lesson-1";
    const result = getUpdatedUrl({
      url,
      storageShareId,
      unhashedKey,
      source: "lesson-canonical",
    });
    expect(result.url).toEqual("http://example.com?sid-c2d05c=1234&sm=0&src=1");
    expect(result.shareIdKey).toEqual("sid-c2d05c");
    expect(result.shareId).toEqual("1234");
  });

  it("should generate a new share id and store it in a storage if no storageId provided", () => {
    const url = "http://example.com";
    const unhashedKey = "lesson-1";
    const fn = jest.spyOn(Storage.prototype, "setItem");
    const result = getUpdatedUrl({
      url,
      storageShareId: undefined,
      unhashedKey,
      source: "lesson-canonical",
    });
    expect(result.url).toEqual(
      "http://example.com?sid-c2d05c=xxxxxxxxxx&sm=0&src=1",
    );

    expect(result.shareIdKey).toEqual("sid-c2d05c");
    expect(result.shareId).toEqual("xxxxxxxxxx");
    expect(fn).toHaveBeenCalledWith("sid-c2d05c", JSON.stringify("xxxxxxxxxx"));
  });
});
