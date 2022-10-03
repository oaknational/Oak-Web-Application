import { renderHook } from "@testing-library/react-hooks";

import usePagination from "./usePagination";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require("next/router"), "useRouter");

// Default test values
const pathname = "/blogs";
const totalResults = 41;
const pageSize = 10;

describe("usePagination()", () => {
  jest.mock("next/dist/client/router", () => require("next-router-mock"));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calculates correct totalPages", () => {
    useRouter.mockReturnValueOnce({ pathname, query: {} });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize })
    );

    expect(result.current.totalPages).toBe(5);
  });
  test("defaults to page 1", () => {
    useRouter.mockReturnValueOnce({ pathname, query: {} });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize })
    );

    expect(result.current.currentPage).toBe(1);
  });
  test("correct hrefs on first page", () => {
    useRouter.mockReturnValueOnce({ pathname, query: { page: 1 } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize })
    );

    expect(result.current).toMatchObject({
      prevPageHref: { pathname: undefined },
      nextPageHref: { pathname, query: { page: "2" } },
    });
  });
  test("correct hrefs on last page", () => {
    useRouter.mockReturnValueOnce({ pathname, query: { page: 5 } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize })
    );

    expect(result.current).toMatchObject({
      prevPageHref: { pathname, query: { page: "4" } },
      nextPageHref: { pathname: undefined },
    });
  });
  test("if page < 1, default to page=1 ", () => {
    useRouter.mockReturnValueOnce({ pathname, query: { page: -5 } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize })
    );

    expect(result.current).toMatchObject({
      currentPage: 1,
      prevPageHref: { pathname: undefined },
      nextPageHref: { pathname, query: { page: "2" } },
    });
  });
  test("if page > totalPages, default to page=1 ", () => {
    useRouter.mockReturnValueOnce({ pathname, query: { page: 500 } });

    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize })
    );

    expect(result.current).toMatchObject({
      currentPage: 5,
      prevPageHref: { pathname, query: { page: "4" } },
      nextPageHref: { pathname: undefined },
    });
  });
  test("works if current route has dynamic slug in pathname", () => {
    useRouter.mockReturnValueOnce({
      pathname: "/blog/[categorySlug]",
      query: { categorySlug: "updates", page: 1 },
    });
    const { result } = renderHook(() =>
      usePagination({ totalResults, pageSize })
    );

    expect(result.current).toMatchObject({
      pageSize: 10,
      currentPage: 1,
      totalPages: 5,
      totalResults: 41,
      nextPageHref: {
        pathname: "/blog/[categorySlug]",
        query: { categorySlug: "updates", page: "2" },
      },
      prevPageHref: { pathname: undefined },
    });
  });
});
