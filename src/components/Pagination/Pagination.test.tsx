import { ResolveOakHrefProps } from "../../common-lib/urls";
import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import Pagination from "./Pagination";

const nextPageLinkProps: ResolveOakHrefProps = {
  page: "blog-index",
  category: "updates",
  search: {
    page: "2",
  },
};
const prevPageLinkProps: ResolveOakHrefProps = {
  page: "blog-index",
  category: "updates",
  search: {
    page: "1",
  },
};

describe("Pagination", () => {
  test("it renders", () => {
    const totalPages = 25;
    const currentPage = 1;

    const { getByRole } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        prevPageLinkProps={prevPageLinkProps}
        nextPageLinkProps={nextPageLinkProps}
      />
    );

    getByRole("navigation");
  });
  test("displays the correct text", () => {
    const totalPages = 17;
    const currentPage = 15;

    const { getByText } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        prevPageLinkProps={prevPageLinkProps}
        nextPageLinkProps={nextPageLinkProps}
      />
    );

    getByText("page 15 / 17");
  });
  test("next arrow has correct href", () => {
    const totalPages = 25;
    const currentPage = 6;

    const { getByRole } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        prevPageLinkProps={prevPageLinkProps}
        nextPageLinkProps={nextPageLinkProps}
      />
    );

    const link = getByRole("link", { name: "next page" });
    expect(link).toHaveAttribute("href", "/blog/categories/updates?page=2");
  });
  test("previous arrow has correct href", () => {
    const totalPages = 25;
    const currentPage = 6;

    const { getByRole } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        prevPageLinkProps={prevPageLinkProps}
        nextPageLinkProps={nextPageLinkProps}
      />
    );

    const link = getByRole("link", { name: "previous page" });
    expect(link).toHaveAttribute("href", "/blog/categories/updates?page=1");
  });

  test("the next arrow is disabled when there are no more pages", () => {
    const totalPages = 25;
    const currentPage = 25;

    const { getByText, getByLabelText } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        nextPageLinkProps={nextPageLinkProps}
        prevPageLinkProps={prevPageLinkProps}
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

    const { getByText, getByLabelText } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        nextPageLinkProps={nextPageLinkProps}
        prevPageLinkProps={prevPageLinkProps}
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

    const { queryByRole } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        nextPageLinkProps={nextPageLinkProps}
        prevPageLinkProps={prevPageLinkProps}
      />
    );

    expect(queryByRole("navigation")).toBeNull();
  });
});
