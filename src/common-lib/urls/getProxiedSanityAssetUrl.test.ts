import getProxiedSanityAssetUrl from "./getProxiedSanityAssetUrl";

describe("getProxiedSanityAssetUrl", () => {
  it("should return url with proxied cdn host", () => {
    expect(
      getProxiedSanityAssetUrl(
        "https://cdn.sanity.io/files/cuvjke51/production/becc1901c9dbacb8889f5952605672be926d5386.pdf",
      ),
    ).toEqual(
      "https://NEXT_PUBLIC_SANITY_ASSET_CDN_HOST/files/cuvjke51/production/becc1901c9dbacb8889f5952605672be926d5386.pdf",
    );
  });
  it("should return original url if not valid sanity cdn url", () => {
    expect(
      getProxiedSanityAssetUrl(
        "https://www.thenational.academy/something-else",
      ),
    ).toEqual("https://www.thenational.academy/something-else");
  });
  it("should return null if null passed", () => {
    expect(getProxiedSanityAssetUrl(null)).toEqual(null);
  });
  it("should return undefined if undefined passed", () => {
    expect(getProxiedSanityAssetUrl(undefined)).toEqual(undefined);
  });
});
