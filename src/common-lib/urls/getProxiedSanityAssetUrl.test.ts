import getProxiedSanityAssetUrl from "./getProxiedSanityAssetUrl";

describe("getProxiedSanityAssetUrl", () => {
  test("should return url with proxied cdn host", () => {
    expect(
      getProxiedSanityAssetUrl(
        "https://cdn.sanity.io/files/cuvjke51/production/becc1901c9dbacb8889f5952605672be926d5386.pdf",
      ),
    ).toEqual(
      "https://NEXT_PUBLIC_SANITY_ASSET_CDN_HOST/files/cuvjke51/production/becc1901c9dbacb8889f5952605672be926d5386.pdf",
    );
  });
  test("should return original url if not valid sanity cdn url", () => {
    expect(
      getProxiedSanityAssetUrl(
        "https://www.thenational.academy/something-else",
      ),
    ).toEqual("https://www.thenational.academy/something-else");
  });
  test("should return null if null passed", () => {
    expect(getProxiedSanityAssetUrl(null)).toEqual(null);
  });
  test("should return undefined if undefined passed", () => {
    expect(getProxiedSanityAssetUrl(undefined)).toEqual(undefined);
  });
});

describe("Sanity asset URL suffixes", () => {
  const path =
    "/files/cuvjke51/production/06043df8db8bc29c6a2b71adb2808425ba12aab5.pdf";

  it.each(["?dl=report.pdf", "#page=3", "?dl=report%20name.pdf#page=3"])(
    "preserves %s when proxying",
    (suffix) => {
      expect(
        getProxiedSanityAssetUrl(`https://cdn.sanity.io${path}${suffix}`),
      ).toBe(`https://NEXT_PUBLIC_SANITY_ASSET_CDN_HOST${path}${suffix}`);
    },
  );

  it.each(["sanity-asset-cdn.thenational.academy", "example.com"])(
    "leaves URLs on %s unchanged",
    (host) => {
      const url = `https://${host}${path}?dl=report.pdf#page=3`;
      expect(getProxiedSanityAssetUrl(url)).toBe(url);
    },
  );
});
