import { renderHook } from "@testing-library/react";

import { mockWebinar } from "../../../__tests__/pages/webinars/webinar.fixtures";
import { webinarToBlogListItem } from "../../pages/WebinarsIndex.page";

import useBlogList from "./useBlogList";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("useBlogList.ts", () => {
  test("handles no posts", () => {
    const { result } = renderHook(() => useBlogList({ items: [] }));
    expect(result.current).toEqual({
      currentPageItems: [],
      paginationProps: {
        pageSize: 4,
        currentPage: 1,
        totalPages: 0,
        totalResults: 0,
        nextPageHref: { pathname: "", query: { page: "2" } },
        prevPageUrlObject: { pathname: "" },
      },
    });
  });
  test("handles only past posts", () => {
    const pastPost = webinarToBlogListItem(mockWebinar());
    const { result } = renderHook(() => useBlogList({ items: [pastPost] }));

    expect(result.current).toEqual({
      currentPageItems: [pastPost],
      paginationProps: {
        pageSize: 4,
        currentPage: 1,
        totalPages: 1,
        totalResults: 1,
        nextPageHref: { pathname: "" },
        prevPageUrlObject: { pathname: "" },
        upcomingItem: undefined,
      },
    });
  });
  test("handles single upcoming post", () => {
    const upcomingPost = webinarToBlogListItem(
      mockWebinar({ date: "2052-04-14" })
    );
    const pastPost = webinarToBlogListItem(mockWebinar());
    const { result } = renderHook(() =>
      useBlogList({ items: [pastPost, upcomingPost] })
    );

    expect(result.current).toEqual({
      upcomingItem: upcomingPost,
      currentPageItems: [pastPost],
      paginationProps: {
        pageSize: 4,
        currentPage: 1,
        totalPages: 1,
        totalResults: 1,
        nextPageHref: { pathname: "" },
        prevPageUrlObject: { pathname: "" },
      },
    });
  });
  test("handles multiple upcoming posts (returning the soonest)", () => {
    const firstUpcomingPost = webinarToBlogListItem(
      mockWebinar({ date: "2033-04-14" })
    );
    const secondUpcomingPost = webinarToBlogListItem(
      mockWebinar({ date: "2052-04-14" })
    );
    const pastPost = webinarToBlogListItem(mockWebinar());
    const items = [secondUpcomingPost, firstUpcomingPost, pastPost];
    const { result } = renderHook(() => useBlogList({ items }));

    expect(result.current).toEqual({
      upcomingItem: firstUpcomingPost,
      currentPageItems: [pastPost],
      paginationProps: {
        pageSize: 4,
        currentPage: 1,
        totalPages: 1,
        totalResults: 1,
        nextPageHref: { pathname: "" },
        prevPageUrlObject: { pathname: "" },
      },
    });
  });
  test("pagination: returns correct 'paginationProps'", () => {
    const upcomingPost = webinarToBlogListItem(
      mockWebinar({ date: "2033-04-14" })
    );
    const pastPosts = new Array(30)
      .fill(null)
      .map(() => webinarToBlogListItem(mockWebinar()));
    const items = [upcomingPost, ...pastPosts];
    const { result } = renderHook(() => useBlogList({ items }));

    expect(result.current).toEqual({
      upcomingItem: upcomingPost,
      currentPageItems: pastPosts.slice(0, 4),
      paginationProps: {
        pageSize: 4,
        currentPage: 1,
        totalPages: 8,
        totalResults: 30,
        nextPageHref: { pathname: "", query: { page: "2" } },
        prevPageUrlObject: { pathname: "" },
      },
    });
  });
});
