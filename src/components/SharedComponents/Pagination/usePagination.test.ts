import { renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { createRef } from "react";

import usePagination from "./usePagination";

// Default test values
const pathname = "/blogs";
const totalResults = 41;
const pageSize = 10;
const items = Array(30);

describe("usePagination()", () => {
  beforeEach(() => {
    // Reset the mock router before each test
    mockRouter.setCurrentUrl("/");
  });

  test("calculates correct totalPages", () => {
    mockRouter.push({ pathname, query: {} });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current.totalPages).toBe(5);
  });

  test("defaults to page 1", () => {
    mockRouter.push({ pathname, query: {} });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current.currentPage).toBe(1);
  });

  test("correct hrefs on first page", () => {
    mockRouter.push({ pathname, query: { page: "1" } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      prevPageUrlObject: { pathname: "/blogs?page=1" },
      nextPageUrlObject: { pathname, query: { page: "2" } },
    });
  });

  test("correct hrefs on last page", () => {
    mockRouter.push({ pathname, query: { page: "5" } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      prevPageUrlObject: { pathname, query: { page: "4" } },
      nextPageUrlObject: { pathname: "/blogs?page=5" },
    });
  });

  test("if page < 1, default to page=1", () => {
    mockRouter.push({ pathname, query: { page: "-5" } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      currentPage: 1,
      prevPageUrlObject: { pathname: "/blogs?page=-5" },
      nextPageUrlObject: { pathname, query: { page: "2" } },
    });
  });

  test("if page > totalPages, default to page=1", () => {
    mockRouter.push({ pathname, query: { page: "500" } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      currentPage: 5,
      prevPageUrlObject: { pathname, query: { page: "4" } },
      nextPageUrlObject: { pathname: "/blogs?page=500" },
    });
  });

  test("works if current route has dynamic slug in pathname", () => {
    mockRouter.push({
      pathname: "/blog/[categorySlug]",
      query: { categorySlug: "updates", page: "1" },
    });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      pageSize: 10,
      currentPage: 1,
      totalPages: 5,
      totalResults: 41,
      nextPageUrlObject: {
        pathname: "/blog/[categorySlug]",
        query: { categorySlug: "updates", page: "2" },
      },
      prevPageUrlObject: { pathname: "/blog/updates?page=1" },
    });
  });

  test("it returns the correct number of currentPageItems", () => {
    mockRouter.push({ pathname, query: { page: "1" } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      currentPageItems: items.slice(0, pageSize),
    });
  });

  test("returns firstItemRef with a valid ref", () => {
    mockRouter.push({ pathname, query: {} });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toHaveProperty("firstItemRef");
    expect(result.current.firstItemRef).toBeInstanceOf(Object);

    const ref = createRef();
    expect(result.current.firstItemRef).toMatchObject(ref);
  });
});
