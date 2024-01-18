import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";

import "../__tests__/__helpers__/LocalStorageMock";

import useUtmParams from "./useUtmParams";

describe("useUtmParams()", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  vi.mock("next/dist/client/router", () => require("next-router-mock"));

  it("defaults to empty object", () => {
    mockRouter.setCurrentUrl("/some-page");

    const { result } = renderHook(() => useUtmParams());
    expect(result.current).toMatchObject({});
  });
  it("returns utm params", () => {
    mockRouter.setCurrentUrl("/some-page?utm_source=twitter&bar=baz");
    const { result } = renderHook(() => useUtmParams());
    expect(result.current).toMatchObject({ utm_source: "twitter" });
  });
  it("gets params from local storage if available", async () => {
    mockRouter.setCurrentUrl("/some-page");
    window.localStorage.setItem(
      "oak-utm-params",
      JSON.stringify({ utm_campaign: "tests rule", utm_term: "hella yeah" }),
    );
    const { result } = renderHook(() => useUtmParams());
    expect(result.current).toMatchObject({
      utm_campaign: "tests rule",
      utm_term: "hella yeah",
    });
  });
  it("utm params local storage gets updated when they change in the query", () => {
    mockRouter.setCurrentUrl(
      "/some-page?utm_campaign=tests rule&utm_term=hella yeah",
    );
    const { result, rerender } = renderHook(() => useUtmParams());
    expect(result.current).toMatchObject({
      utm_campaign: "tests rule",
      utm_term: "hella yeah",
    });
    mockRouter.setCurrentUrl("/some-page?utm_source=twitter&bar=baz");
    rerender();
    expect(window.localStorage.getItem("oak-utm-params")).toMatch(
      JSON.stringify({
        utm_source: "twitter",
      }),
    );
  });
});
