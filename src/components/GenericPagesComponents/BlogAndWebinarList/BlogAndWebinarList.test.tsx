import { BlogAndWebinarListProps } from "./BlogAndWebinarList";

import BlogAndWebinarList from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const blogAndWebinarListData: BlogAndWebinarListProps = {
  blogListPosts: {
    currentPageItems: [],
    upcomingItem: undefined,
    paginationProps: {
      prevHref: "",
      nextHref: "",
      paginationTitle: "",
      currentPage: 1,
      totalPages: 0,
      nextPageUrlObject: { pathname: "", query: { page: "2" } },
      prevPageUrlObject: { pathname: "" },
      firstItemRef: {
        current: null,
      },
    },
  },
  backgroundColor: "white",
  displayOnPhone: true,
  showImageOnTablet: true,
  title: "Stay up to date",
};

describe("components/BlogAndWebinarList", () => {
  test("renders correct headings", () => {
    const { getByRole } = renderWithTheme(
      <BlogAndWebinarList {...blogAndWebinarListData} />,
    );

    expect(getByRole("heading", { level: 2 }).textContent).toBe(
      "Stay up to date",
    );
  });
});
