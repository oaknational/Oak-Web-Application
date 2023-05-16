import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import Pagination from "./Pagination";

export const mockPaginationProps = {
  totalPages: 25,
  currentPage: 1,
  pageSize: 20,
  nextPageHref: "/prev",
  prevPageHref: "/next",
  totalResults: 10,
};

describe("Pagination", () => {
  test("it renders", () => {
    const totalPages = 25;
    const currentPage = 1;
    const nextPageUrlObject = "prev";
    const prevPageUrlObject = "next";

    const { getByRole } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        prevPageUrlObject={prevPageUrlObject}
        nextPageUrlObject={nextPageUrlObject}
      />
    );

    getByRole("navigation");
  });
  test("displays the correct text", () => {
    const totalPages = 17;
    const currentPage = 15;
    const nextPageUrlObject = "next-page";
    const prevPageUrlObject = "prev-page";

    const { getByText } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        prevPageUrlObject={prevPageUrlObject}
        nextPageUrlObject={nextPageUrlObject}
      />
    );

    getByText("page 15 / 17");
  });
  test("next arrow has correct href", () => {
    const totalPages = 25;
    const currentPage = 6;
    const nextPageUrlObject = {
      pathname: "/blog/[categorySlug]",
      query: { categorySlug: "updates", page: 2 },
    };
    const prevPageUrlObject = "prev-page";
    const { getByRole } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        prevPageUrlObject={prevPageUrlObject}
        nextPageUrlObject={nextPageUrlObject}
      />
    );

    const link = getByRole("link", { name: "next page" });
    expect(link).toHaveAttribute("href", "/blog/updates?page=2");
  });
  test("previous arrow has correct href", () => {
    const totalPages = 25;
    const currentPage = 6;
    const prevPageUrlObject = {
      pathname: "/blog/[categorySlug]",
      query: { categorySlug: "updates", page: 1 },
    };
    const nextPageUrlObject = "next-page";
    const { getByRole } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        prevPageUrlObject={prevPageUrlObject}
        nextPageUrlObject={nextPageUrlObject}
      />
    );

    const link = getByRole("link", { name: "previous page" });
    expect(link).toHaveAttribute("href", "/blog/updates?page=1");
  });

  test("the next arrow is disabled when there are no more pages", () => {
    const totalPages = 25;
    const currentPage = 25;
    const nextPageUrlObject = "next-page";
    const prevPageUrlObject = "prev-page";
    const { getByText, getByLabelText } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        nextPageUrlObject={nextPageUrlObject}
        prevPageUrlObject={prevPageUrlObject}
      />
    );

    const nextLink = getByLabelText("next page");

    getByText("page 25 / 25");

    expect(nextLink).toHaveAttribute("aria-disabled", "true");
    expect(nextLink).toHaveAttribute("href", "");
  });
  test("previous button is disabled on page 1", () => {
    const totalPages = 25;
    const currentPage = 1;
    const nextPageUrlObject = "next-page";
    const prevPageUrlObject = "prev-page";
    const { getByText, getByLabelText } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        nextPageUrlObject={nextPageUrlObject}
        prevPageUrlObject={prevPageUrlObject}
      />
    );
    const previousLink = getByLabelText("previous page");

    getByText("page 1 / 25");

    expect(previousLink).toHaveAttribute("aria-disabled", "true");
    expect(previousLink).toHaveAttribute("href", "");
  });
  test("nothing is displayed if there is only one page", () => {
    const totalPages = 1;
    const currentPage = 1;
    const nextPageUrlObject = "next-page";
    const prevPageUrlObject = "prev-page";
    const { queryByRole } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        nextPageUrlObject={nextPageUrlObject}
        prevPageUrlObject={prevPageUrlObject}
      />
    );

    expect(queryByRole("navigation")).toBeNull();
  });
});
