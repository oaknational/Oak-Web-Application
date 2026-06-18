import { renderHook } from "@testing-library/react";
import { createRef } from "react";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import usePagination from "./usePagination";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockUsePathname = jest.mocked(usePathname);
const mockUseRouter = jest.mocked(useRouter);
const mockUseSearchParams = jest.mocked(useSearchParams);

// Default test values
const pathname = "/blogs";
const totalResults = 41;
const pageSize = 10;
const items = Array(30);

describe("usePagination()", () => {
  const push = jest.fn();

  const mockNavigation = ({
    path = pathname,
    query = {},
  }: {
    path?: string | null;
    query?: Record<string, string | number>;
  } = {}) => {
    mockUsePathname.mockReturnValue(path);
    mockUseRouter.mockReturnValue({
      push,
      replace: jest.fn(),
      prefetch: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    });

    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    mockUseSearchParams.mockReturnValue(
      params as unknown as ReadonlyURLSearchParams, //NOSONAR typescript:S4325
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calculates correct totalPages", () => {
    mockNavigation();
    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current.totalPages).toBe(5);
  });
  test("defaults to page 1", () => {
    mockNavigation();
    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current.currentPage).toBe(1);
  });
  test("correct hrefs on first page", () => {
    mockNavigation({ query: { page: 1 } });
    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      prevPageUrlObject: { pathname },
      nextPageUrlObject: { pathname, query: { page: "2" } },
    });
  });
  test("correct hrefs on last page", () => {
    mockNavigation({ query: { page: 5 } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      prevPageUrlObject: { pathname, query: { page: "4" } },
      nextPageUrlObject: { pathname },
    });
  });
  test("if page < 1, default to page=1 ", () => {
    mockNavigation({ query: { page: -5 } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      currentPage: 1,
      prevPageUrlObject: { pathname },
      nextPageUrlObject: { pathname, query: { page: "2" } },
    });
  });
  test("if page > totalPages, default to page=1 ", () => {
    mockNavigation({ query: { page: 500 } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      currentPage: 5,
      prevPageUrlObject: { pathname, query: { page: "4" } },
      nextPageUrlObject: { pathname },
    });
  });
  test("works if current route has dynamic slug in pathname", () => {
    mockNavigation({
      path: "/blog/[categorySlug]",
      query: { categorySlug: "updates", page: 1 },
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
      prevPageUrlObject: {
        pathname: "/blog/[categorySlug]",
        query: { categorySlug: "updates" },
      },
    });
  });
  test("it returns the correct number of currentPageItems", () => {
    mockNavigation({ query: { page: 1 } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      currentPageItems: items.slice(0, pageSize),
    });
  });

  test("returns firstItemRef with a valid ref", () => {
    mockNavigation();
    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toHaveProperty("firstItemRef");
    expect(result.current.firstItemRef).toBeInstanceOf(Object);

    const ref = createRef();
    expect(result.current.firstItemRef).toMatchObject(ref);
  });

  test("falls back to '/' when pathname is null", () => {
    mockNavigation({ path: null, query: { page: 2 } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current.paginationRoute).toBe("/");
    expect(result.current.prevHref).toBe("/");
    expect(result.current.nextHref).toBe("/?page=3");
  });

  test("falls back to '/' when pathname is empty", () => {
    mockNavigation({ path: "", query: { page: 2 } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current.paginationRoute).toBe("/");
    expect(result.current.prevHref).toBe("/");
    expect(result.current.nextHref).toBe("/?page=3");
  });
});
