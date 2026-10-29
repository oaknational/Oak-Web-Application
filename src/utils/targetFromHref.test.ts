import { targetFromHref } from "./targetFromHref";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";

describe("targetFromHref", () => {
  it("should return '_blank' for external URLs", () => {
    const url = "https://external.com";
    const result = targetFromHref(url);
    expect(result).toBe("_blank");
  });

  it("should return undefined for internal URLs", () => {
    const url = getBrowserConfig("clientAppBaseUrl") + "/some-path";
    const result = targetFromHref(url);
    expect(result).toBeUndefined();
  });

  it("should return undefined for relative URLs", () => {
    const url = "/some-path";
    const result = targetFromHref(url);
    expect(result).toBeUndefined();
  });

  it("should return null for invalid URLs", () => {
    const url = "https://";
    const result = targetFromHref(url);
    expect(result).toBeUndefined();
  });
});
