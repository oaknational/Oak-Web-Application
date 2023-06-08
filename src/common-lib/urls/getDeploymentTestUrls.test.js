import getDeploymentTestUrls from "./getDeploymentTestUrls";

describe("getDeploymentTestUrls", () => {
  test("return an array of urls", () => {
    const urls = getDeploymentTestUrls();
    expect(Array.isArray(urls)).toBe(true);
    expect(urls.length).toBeGreaterThan(0);
  });
});
