import { renderHook } from "@testing-library/react";

import "../__tests__/__helpers__/LocalStorageMock";

import useUtmParams from "./useUtmParams";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require("next/router"), "useRouter");

describe("useUtmParams()", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  jest.mock("next/dist/client/router", () => require("next-router-mock"));

  test("defaults to empty object", () => {
    useRouter.mockReturnValue({ query: {} });

    const { result } = renderHook(() => useUtmParams());
    expect(result.current).toMatchObject({});
  });
  test("returns utm params", () => {
    useRouter.mockReturnValueOnce({
      query: { utm_source: "twitter", bar: "baz" },
    });
    const { result } = renderHook(() => useUtmParams());
    expect(result.current).toMatchObject({ utm_source: "twitter" });
  });
  test("gets params from local storage if available", async () => {
    window.localStorage.setItem(
      "oak-utm-params",
      JSON.stringify({ utm_campaign: "tests rule", utm_term: "hella yeah" })
    );
    const { result } = renderHook(() => useUtmParams());
    expect(result.current).toMatchObject({
      utm_campaign: "tests rule",
      utm_term: "hella yeah",
    });
    useRouter.mockReturnValueOnce({
      query: { utm_source: "twitter", bar: "baz" },
    });
  });
  test("utm params local storage gets updated when they change in the query", () => {
    useRouter.mockReturnValueOnce({
      query: {
        utm_campaign: "tests rule",
        utm_term: "hella yeah",
      },
    });
    const { result, rerender } = renderHook(() => useUtmParams());
    expect(result.current).toMatchObject({
      utm_campaign: "tests rule",
      utm_term: "hella yeah",
    });
    useRouter.mockReturnValueOnce({
      query: { utm_source: "twitter", bar: "baz" },
    });
    rerender();
    expect(window.localStorage.getItem("oak-utm-params")).toMatch(
      JSON.stringify({
        utm_source: "twitter",
      })
    );
  });
});
