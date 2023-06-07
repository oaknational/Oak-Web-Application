import getRelativeConfigURLs from "./getRelativeConfigURLs";

describe("getRelativeConfigURLs", () => {
  test("return an array of urls", () => {
    const urls = getRelativeConfigURLs();
    expect(Array.isArray(urls)).toBe(true);
    expect(urls.length).toBe(27);
  });
});
