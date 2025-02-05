import {
  generateURLFields,
  splitURLsInHalf,
  URLFields,
} from "@/utils/generateSitemapUrlFields";

describe("generateURLFields function", () => {
  it("should map each url.urls to loc and generate a lastmod date", () => {
    const urls = [
      { urls: "https://example.com" },
      { urls: "https://example.org" },
    ];
    const result = generateURLFields(urls);
    expect(result.length).toBe(urls.length);
    expect(result[0]).toEqual(
      expect.objectContaining({
        loc: "https://example.com",
        lastmod: expect.any(String),
      }),
    );
    expect(result[1]).toEqual(
      expect.objectContaining({
        loc: "https://example.org",
        lastmod: expect.any(String),
      }),
    );
  });

  it("should handle an empty array", () => {
    const urls = [] as URLFields;
    const result = generateURLFields(urls);
    expect(result).toEqual([]);
  });

  it("should generate an ISO date string for lastmod", () => {
    const urls = [{ urls: "https://example.com" }];
    const result = generateURLFields(urls);
    const dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
    expect(result[0]?.lastmod).toMatch(dateRegex);
  });

  it("should generate the same lastmod date for all URLs in a single call", () => {
    const urls = [
      { urls: "https://example.com" },
      { urls: "https://example.org" },
    ];
    const result = generateURLFields(urls);
    expect(result).toHaveLength(2);
    expect(result[0]?.lastmod).toBe(result[1]?.lastmod);
  });
});

describe("splitURLsInHalf", () => {
  const urls = [
    { urls: "url1" },
    { urls: "url2" },
    { urls: "url3" },
    { urls: "url4" },
  ];
  it("should return the first half of the array when firstHalf is true", () => {
    const result = splitURLsInHalf(urls, true);
    expect(result).toEqual([{ urls: "url1" }, { urls: "url2" }]);
  });

  it("should return the second half of the array when firstHalf is false", () => {
    const result = splitURLsInHalf(urls, false);
    expect(result).toEqual([{ urls: "url3" }, { urls: "url4" }]);
  });

  it("should handle odd-length arrays correctly", () => {
    const resultFirstHalf = splitURLsInHalf(urls.slice(0, 3), true);
    const resultSecondHalf = splitURLsInHalf(urls.slice(0, 3), false);
    expect(resultFirstHalf).toEqual([{ urls: "url1" }]);
    expect(resultSecondHalf).toEqual([{ urls: "url2" }, { urls: "url3" }]);
  });
});
