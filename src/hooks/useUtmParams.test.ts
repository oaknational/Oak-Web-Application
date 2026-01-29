import { renderHook } from "@testing-library/react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import "../__tests__/__helpers__/LocalStorageMock";

import useUtmParams from "./useUtmParams";

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: jest.fn(),
}));

const mockUseSearchParams = jest.mocked(useSearchParams);

describe("useUtmParams()", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("defaults to empty object", () => {
    mockUseSearchParams.mockReturnValue(new ReadonlyURLSearchParams());

    const { result } = renderHook(() => useUtmParams());
    expect(result.current).toMatchObject({});
  });
  test("returns utm params", () => {
    mockUseSearchParams.mockReturnValue(
      new ReadonlyURLSearchParams({ utm_source: "twitter", bar: "baz" }),
    );
    const { result } = renderHook(() => useUtmParams());
    expect(result.current).toMatchObject({ utm_source: "twitter" });
  });
  test("gets params from local storage if available", async () => {
    window.localStorage.setItem(
      "oak-utm-params",
      JSON.stringify({ utm_campaign: "tests rule", utm_term: "hella yeah" }),
    );
    mockUseSearchParams.mockReturnValue(new ReadonlyURLSearchParams());
    const { result } = renderHook(() => useUtmParams());
    expect(result.current).toMatchObject({
      utm_campaign: "tests rule",
      utm_term: "hella yeah",
    });
  });
  test("utm params local storage gets updated when they change in the query", () => {
    mockUseSearchParams.mockReturnValue(
      new ReadonlyURLSearchParams({
        utm_campaign: "tests rule",
        utm_term: "hella yeah",
      }),
    );
    const { result, rerender } = renderHook(() => useUtmParams());
    expect(result.current).toMatchObject({
      utm_campaign: "tests rule",
      utm_term: "hella yeah",
    });

    mockUseSearchParams.mockReturnValue(
      new ReadonlyURLSearchParams({ utm_source: "twitter", bar: "baz" }),
    );
    rerender();
    expect(window.localStorage.getItem("oak-utm-params")).toMatch(
      JSON.stringify({
        utm_source: "twitter",
      }),
    );
  });
});
