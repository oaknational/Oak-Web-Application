// eslint-disable-next-line import/named
import { describe, expect, it } from "vitest";

import getDeploymentTestUrls from "./getDeploymentTestUrls";

describe("getDeploymentTestUrls", () => {
  it("return an array of urls", () => {
    const urls = getDeploymentTestUrls();
    expect(Array.isArray(urls)).toBe(true);
    expect(urls.length).toBeGreaterThan(0);
  });
});
