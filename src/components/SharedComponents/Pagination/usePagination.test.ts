import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { createRef } from "react";
import mockRouter from "next-router-mock";

import usePagination from "./usePagination";

// Default test values
const pathname = "/blogs";
const totalResults = 41;
const pageSize = 10;
const items = Array(30);

describe("usePagination()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calculates correct totalPages", () => {
    mockRouter.setCurrentUrl(pathname);

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current.totalPages).toBe(5);
  });
  it("defaults to page 1", () => {
    mockRouter.setCurrentUrl(pathname);

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current.currentPage).toBe(1);
  });
  it("correct hrefs on first page", () => {
    mockRouter.setCurrentUrl(pathname + "?page=1");

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      prevPageUrlObject: { pathname: mockRouter.asPath },
      nextPageUrlObject: { pathname, query: { page: "2" } },
    });
  });
  it("correct hrefs on last page", () => {
    mockRouter.setCurrentUrl(pathname + "?page=5");

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      prevPageUrlObject: { pathname, query: { page: "4" } },
      nextPageUrlObject: { pathname: mockRouter.asPath },
    });
  });
  it("if page < 1, default to page=1 ", () => {
    mockRouter.setCurrentUrl(pathname + "?page=-5");

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      currentPage: 1,
      prevPageUrlObject: { pathname: mockRouter.asPath },
      nextPageUrlObject: { pathname, query: { page: "2" } },
    });
  });
  it("if page > totalPages, default to page=1 ", () => {
    mockRouter.setCurrentUrl(pathname + "?page=500");

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      currentPage: 5,
      prevPageUrlObject: { pathname, query: { page: "4" } },
      nextPageUrlObject: { pathname: mockRouter.asPath },
    });
  });
  it("works if current route has dynamic slug in pathname", () => {
    mockRouter.setCurrentUrl("/blog/updates?page=1");
    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      pageSize: 10,
      currentPage: 1,
      totalPages: 5,
      totalResults: 41,
      nextPageUrlObject: {
        pathname: "/blog/updates",
        query: { page: "2" },
      },
      prevPageUrlObject: { pathname: mockRouter.asPath },
    });
  });
  it("it returns the correct number of currentPageItems", () => {
    mockRouter.setCurrentUrl(pathname + "?page=1");

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      currentPageItems: items.slice(0, pageSize),
    });
  });
  it("returns firstItemRef with a valid ref", () => {
    mockRouter.setCurrentUrl(pathname);
    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toHaveProperty("firstItemRef");
    expect(result.current.firstItemRef).toBeInstanceOf(Object);

    const ref = createRef();
    expect(result.current.firstItemRef).toMatchObject(ref);
  });
});
