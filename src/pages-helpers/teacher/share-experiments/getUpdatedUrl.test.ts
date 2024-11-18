import { getUpdatedUrl } from "./getUpdatedUrl";

describe("getUpdatedUrl", () => {
  it("should return an updated url with the share id in the cookie if available", () => {
    const url = "http://example.com";
    const cookieShareId = "1234";
    const unhashedKey = "lesson-1";
    const result = getUpdatedUrl({ url, cookieShareId, unhashedKey });
    expect(result.url).toEqual("http://example.com?sid-c2d05c=1234&sm=0");
    expect(result.shareIdKey).toEqual("sid-c2d05c");
    expect(result.shareId).toEqual("1234");
  });

  it("should override the url with the share id in the cookie if available", () => {
    const url = "http://example.com?sid-c2d05c=xxxxxxxx&sm=0";
    const cookieShareId = "1234";
    const unhashedKey = "lesson-1";
    const result = getUpdatedUrl({ url, cookieShareId, unhashedKey });
    expect(result.url).toEqual("http://example.com?sid-c2d05c=1234&sm=0");
    expect(result.shareIdKey).toEqual("sid-c2d05c");
    expect(result.shareId).toEqual("1234");
  });

  it("should generate a new share id and store it in a cookie if no cookieId provided", () => {
    const url = "http://example.com";
    const unhashedKey = "lesson-1";
    const result = getUpdatedUrl({
      url,
      cookieShareId: undefined,
      unhashedKey,
    });
    expect(result.url).toEqual("http://example.com?sid-c2d05c=xxxxxxxxxx&sm=0");
    expect(result.shareIdKey).toEqual("sid-c2d05c");
    expect(result.shareId).toEqual("xxxxxxxxxx");
    expect(document.cookie).toContain("sid-c2d05c=xxxxxxxxxx");
  });
});
