import { renderHook } from "@testing-library/react";

import { mockWebinar } from "../../../__tests__/pages/webinars/webinar.fixtures";
import { webinarToPostListItem } from "../../pages/WebinarsIndex.page";

import usePostList from "./usePostList";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("usePostList.ts", () => {
  test("handles no posts", () => {
    const { result } = renderHook(() => usePostList({ items: [] }));
    expect(result.current).toEqual({
      currentPageItems: [],
      upcomingItem: undefined,
      paginationProps: {
        currentPageItems: [],
        pageSize: 4,
        paginationTitle: "",
        currentPage: 1,
        totalPages: 0,
        totalResults: 0,
        nextPageUrlObject: { pathname: "", query: { page: "2" } },
        prevPageUrlObject: { pathname: "" },
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
        totalPages: 1,
        totalResults: 1,
        nextPageUrlObject: { pathname: "" },
        prevPageUrlObject: { pathname: "" },
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
        currentPage: 1,
        totalPages: 1,
        totalResults: 1,
        nextPageUrlObject: { pathname: "" },
        prevPageUrlObject: { pathname: "" },
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
        paginationTitle: "",
        currentPage: 1,
        totalPages: 1,
        totalResults: 1,
        nextPageUrlObject: { pathname: "" },
        prevPageUrlObject: { pathname: "" },
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
        currentPage: 1,
        totalPages: 8,
        totalResults: 30,
        nextPageUrlObject: { pathname: "", query: { page: "2" } },
        prevPageUrlObject: { pathname: "" },
        firstItemRef: {
          current: null,
        },
      },
    });
  });
});
