import { renderHook } from "@testing-library/react";
import { createRef } from "react";
import { useRouter } from "next/compat/router";

import usePagination from "./usePagination";

jest.mock("next/compat/router", () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = jest.mocked(useRouter);

const pathname = "/blogs";
const totalResults = 41;
const pageSize = 10;
const items = new Array(30);

describe("usePagination()", () => {
  const push = jest.fn();

  const mockNavigation = ({
    asPath = pathname,
  }: {
    asPath?: string | null;
  } = {}) => {
    mockUseRouter.mockReturnValue({
      asPath: asPath ?? "/",
      push,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      reload: jest.fn(),
      beforePopState: jest.fn(),
      pathname: asPath?.split("?")[0] ?? "/",
      query: {},
      route: asPath?.split("?")[0] ?? "/",
      basePath: "",
      isReady: true,
      isFallback: false,
      isLocaleDomain: false,
      isPreview: false,
      events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
      forward: jest.fn(),
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "scrollTo").mockImplementation(() => {});
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

  test("correct urlObjects on first page", () => {
    mockNavigation({ asPath: `${pathname}?page=1` });
    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      prevPageUrlObject: { pathname },
      nextPageUrlObject: { pathname, query: { page: "2" } },
    });
  });

  test("correct urlObjects on last page", () => {
    mockNavigation({ asPath: `${pathname}?page=5` });
    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      prevPageUrlObject: { pathname, query: { page: "4" } },
      nextPageUrlObject: { pathname },
    });
  });

  test("if page < 1, default to page=1", () => {
    mockNavigation({ asPath: `${pathname}?page=-5` });
    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      currentPage: 1,
      prevPageUrlObject: { pathname },
      nextPageUrlObject: { pathname, query: { page: "2" } },
    });
  });

  test("if page > totalPages, clamp to totalPages", () => {
    mockNavigation({ asPath: `${pathname}?page=500` });
    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      currentPage: 5,
      prevPageUrlObject: { pathname, query: { page: "4" } },
      nextPageUrlObject: { pathname },
    });
  });

  test("works with additional query params", () => {
    mockNavigation({ asPath: "/blog/updates?page=1" });
    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current).toMatchObject({
      pageSize: 10,
      currentPage: 1,
      totalPages: 5,
      totalResults: 41,
      nextPageUrlObject: { pathname: "/blog/updates", query: { page: "2" } },
      prevPageUrlObject: { pathname: "/blog/updates" },
    });
  });

  test("it returns the correct number of currentPageItems", () => {
    mockNavigation({ asPath: `${pathname}?page=1` });
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

  test("falls back to '/' when router returns null asPath", () => {
    mockUseRouter.mockReturnValue(null);
    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current.paginationRoute).toBe("/");
  });

  test("falls back to '/' when asPath has no pathname segment", () => {
    mockNavigation({ asPath: "?page=2" });
    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize, items }),
    );

    expect(result.current.paginationRoute).toBe("/");
    expect(result.current.prevHref).toBe("/");
    expect(result.current.nextHref).toBe("/?page=3");
  });

  test("uses injected navigation adapter when provided", () => {
    mockUseRouter.mockReturnValue(null);
    const adapterPush = jest.fn();

    const { result } = renderHook(() =>
      usePagination({
        totalResults,
        pageSize,
        items,
        navigation: {
          route: "/teachers/search",
          searchParams: new URLSearchParams("term=test"),
          push: adapterPush,
        },
      }),
    );

    result.current.onPageChange(2);

    expect(adapterPush).toHaveBeenCalledWith(
      "/teachers/search?term=test&page=2",
    );
  });
});
