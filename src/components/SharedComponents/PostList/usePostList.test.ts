import { renderHook } from "@testing-library/react";

import usePostList from "./usePostList";

import { mockWebinar } from "@/__tests__/pages/webinars/webinar.fixtures";
import { webinarToPostListItem } from "@/components/GenericPagesViews/WebinarsIndex.view";

describe("usePostList.ts", () => {
  test("handles no posts", () => {
    const { result } = renderHook(() => usePostList({ items: [] }));
    expect(result.current).toEqual({
      currentPageItems: [],
      upcomingItem: undefined,
      paginationProps: {
        onPageChange: expect.any(Function),
        currentPageItems: [],
        pageSize: 4,
        paginationTitle: "",
        paginationRoute: "/",
        currentPage: 1,
        isFirstPage: true,
        isLastPage: false,
        prevHref: "/",
        nextHref: "/?page=2",
        totalPages: 0,
        totalResults: 0,
        nextPageUrlObject: { pathname: "/", query: { page: "2" } },
        prevPageUrlObject: { pathname: "/" },
        firstItemRef: {
          current: null,
        },
      },
    });
  });
  test("handles only past posts", () => {
    const pastPost = webinarToPostListItem(mockWebinar());
    const { result } = renderHook(() => usePostList({ items: [pastPost] }));

    expect(result.current).toEqual({
      currentPageItems: [pastPost],
      upcomingItem: undefined,
      paginationProps: {
        currentPageItems: [pastPost],
        pageSize: 4,
        paginationTitle: "",
        currentPage: 1,
        isFirstPage: true,
        paginationRoute: "/",
        onPageChange: expect.any(Function),
        isLastPage: true,
        totalPages: 1,
        totalResults: 1,
        prevHref: "/",
        nextHref: "/",
        nextPageUrlObject: { pathname: "/" },
        prevPageUrlObject: { pathname: "/" },
        firstItemRef: {
          current: null,
        },
      },
    });
  });
  test("handles single upcoming post", () => {
    const upcomingPost = webinarToPostListItem(
      mockWebinar({ date: "2052-04-14" }),
    );
    const pastPost = webinarToPostListItem(mockWebinar());
    const { result } = renderHook(() =>
      usePostList({ items: [pastPost, upcomingPost] }),
    );

    expect(result.current).toEqual({
      upcomingItem: upcomingPost,
      currentPageItems: [pastPost],
      paginationProps: {
        currentPageItems: [pastPost],
        pageSize: 4,
        paginationTitle: "",
        paginationRoute: "/",
        onPageChange: expect.any(Function),
        isFirstPage: true,
        isLastPage: true,
        currentPage: 1,
        totalPages: 1,
        totalResults: 1,
        nextHref: "/",
        prevHref: "/",
        nextPageUrlObject: { pathname: "/" },
        prevPageUrlObject: { pathname: "/" },
        firstItemRef: {
          current: null,
        },
      },
    });
  });
  test("handles multiple upcoming posts (returning the soonest)", () => {
    const firstUpcomingPost = webinarToPostListItem(
      mockWebinar({ date: "2033-04-14" }),
    );
    const secondUpcomingPost = webinarToPostListItem(
      mockWebinar({ date: "2052-04-14" }),
    );
    const pastPost = webinarToPostListItem(mockWebinar());
    const items = [secondUpcomingPost, firstUpcomingPost, pastPost];
    const { result } = renderHook(() => usePostList({ items }));

    expect(result.current).toEqual({
      upcomingItem: firstUpcomingPost,
      currentPageItems: [pastPost],
      paginationProps: {
        currentPageItems: [pastPost],
        pageSize: 4,
        onPageChange: expect.any(Function),
        paginationTitle: "",
        paginationRoute: "/",
        currentPage: 1,
        isFirstPage: true,
        isLastPage: true,
        totalPages: 1,
        totalResults: 1,
        nextHref: "/",
        prevHref: "/",
        nextPageUrlObject: { pathname: "/" },
        prevPageUrlObject: { pathname: "/" },
        firstItemRef: {
          current: null,
        },
      },
    });
  });
  test("pagination: returns correct 'paginationProps'", () => {
    const upcomingPost = webinarToPostListItem(
      mockWebinar({ date: "2033-04-14" }),
    );
    const pastPosts = new Array(30)
      .fill(null)
      .map(() => webinarToPostListItem(mockWebinar()));
    const items = [upcomingPost, ...pastPosts];
    const { result } = renderHook(() => usePostList({ items }));

    expect(result.current).toEqual({
      upcomingItem: upcomingPost,
      currentPageItems: pastPosts.slice(0, 4),
      paginationProps: {
        currentPageItems: pastPosts.slice(0, 4),
        pageSize: 4,
        paginationTitle: " | Page 1 of 8",
        isFirstPage: true,
        isLastPage: false,
        currentPage: 1,
        onPageChange: expect.any(Function),
        totalPages: 8,
        totalResults: 30,
        paginationRoute: "/",
        prevHref: "/",
        nextHref: "/?page=2",
        nextPageUrlObject: { pathname: "/", query: { page: "2" } },
        prevPageUrlObject: { pathname: "/" },
        firstItemRef: {
          current: null,
        },
      },
    });
  });
});
