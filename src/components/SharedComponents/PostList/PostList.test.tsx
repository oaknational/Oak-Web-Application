import { useRouter } from "next/router";
import { fireEvent } from "@testing-library/react";

import PostList from ".";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockPaginationProps } from "@/__tests__/__helpers__/mockPaginationProps";

const render = renderWithProviders();
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("components/PostList", () => {
  let pushMock: jest.Mock;
  let scrollToMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn().mockResolvedValue(true);
    scrollToMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      asPath: "/current-path",
    });
    window.scrollTo = scrollToMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the list items", () => {
    const { getByRole } = render(
      <PostList
        paginationProps={mockPaginationProps}
        currentPageItems={[
          {
            title: "Item title",
            titleTag: "h3",
            summary: "Item summary",
            slug: "item-slug",
            contentType: "blog-post",
            category: {
              title: "Curriculum Planning",
              slug: "curriculum-planning",
            },
            date: new Date(2022, 8, 22).toISOString(),
          },
        ]}
      />,
    );

    const listHeading = getByRole("heading", { level: 3 });

    expect(listHeading).toBeInTheDocument();
  });

  test("formats the date correctly", () => {
    const { getByText } = render(
      <PostList
        paginationProps={mockPaginationProps}
        currentPageItems={[
          {
            title: "Item title",
            titleTag: "h3",
            summary: "Item summary",
            slug: "item-slug",
            contentType: "blog-post",
            category: {
              title: "Curriculum Planning",
              slug: "curriculum-planning",
            },
            date: new Date(2022, 7, 22, 14).toISOString(),
          },
        ]}
      />,
    );

    const formattedDate = getByText("22 August 2022");

    expect(formattedDate).toBeInTheDocument();
  });

  describe("withPagination", () => {
    test("calls router.push and window.scrollTo on page change", async () => {
      const { getByAltText } = render(
        <PostList
          paginationProps={mockPaginationProps}
          currentPageItems={[
            {
              title: "Test title",
              titleTag: "h3",
              summary: "Test lesson summary",
              slug: "test-slug",
              contentType: "blog-post",
              category: {
                title: "Curriculum Planning",
                slug: "curriculum-planning",
              },
              date: new Date(2022, 8, 22).toISOString(),
            },
          ]}
          withPagination={true}
        />,
      );

      const paginationButton = getByAltText("chevron-right");
      fireEvent.click(paginationButton);

      expect(pushMock).toHaveBeenCalledWith(
        {
          pathname: "/current-path",
          query: { page: 2 },
        },
        undefined,
        { shallow: true, scroll: false },
      );

      await pushMock();

      expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });
  });
});
