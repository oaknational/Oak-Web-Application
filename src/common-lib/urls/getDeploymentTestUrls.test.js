import getDeploymentTestUrls from "./getDeploymentTestUrls";

describe("getDeploymentTestUrls", () => {
  test("return an array of urls", () => {
    const urls = getDeploymentTestUrls();
    expect(Array.isArray(urls)).toBe(true);
    expect(urls.length).toBeGreaterThan(0);
  });

  test("includes representative insights routes", () => {
    expect(getDeploymentTestUrls()).toContain(
      "/teachers/national-curriculum-insights/science/primary",
    );
    expect(getDeploymentTestUrls()).toContain(
      "/teachers/national-curriculum-insights/science/primary/key-stage-1",
    );
  });
});
