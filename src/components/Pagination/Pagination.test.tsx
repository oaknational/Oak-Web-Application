import { waitFor } from "@testing-library/react";
import { RefObject } from "react";

import Pagination from "./Pagination";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require("next/router"), "useRouter");

describe("Pagination", () => {
  jest.mock("next/dist/client/router", () => require("next-router-mock"));

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
        pageName={"test"}
      />,
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
        pageName={"test"}
      />,
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
        pageName={"blog"}
      />,
    );

    const link = getByRole("link", { name: "blog page 7" });
    expect(link).toHaveAttribute("href", "/blog/updates?page=2");
  });
  test("previous arrow has correct href", () => {
    const totalPages = 25;
    const currentPage = 6;
    const prevPageUrlObject = {
      pathname: "/blog/[categorySlug]",
      query: { categorySlug: "updates", page: 5 },
    };
    const nextPageUrlObject = "next-page";
    const { getByRole } = renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        prevPageUrlObject={prevPageUrlObject}
        nextPageUrlObject={nextPageUrlObject}
        pageName={"blog"}
      />,
    );

    const link = getByRole("link", { name: "blog page 5" });
    expect(link).toHaveAttribute("href", "/blog/updates?page=5");
  });

  test.only("the next arrow is disabled when there are no more pages", () => {
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
        pageName={"test"}
      />,
    );

    const nextLink = getByLabelText("No further pages");

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
        pageName={"test"}
      />,
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
        pageName={"test"}
      />,
    );

    expect(queryByRole("navigation")).toBeNull();
  });
  test("focus is set on ref when query has page and there is a ref passed to component", async () => {
    const useRouterMock = useRouter as jest.Mock;
    useRouterMock.mockReturnValueOnce({
      pathname: "/",
      query: { page: 2 },
      router: {
        query: { page: 2 },
      },
    });
    const totalPages = 40;
    const currentPage = 4;
    const nextPageUrlObject = "next-page";
    const prevPageUrlObject = "prev-page";

    const focusMock = jest.fn();
    const firstItemRef = {
      current: { focus: focusMock },
    } as unknown as RefObject<HTMLAnchorElement>;

    renderWithTheme(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        prevPageUrlObject={prevPageUrlObject}
        nextPageUrlObject={nextPageUrlObject}
        firstItemRef={firstItemRef}
        pageName={"test"}
      />,
    );

    await waitFor(() => {
      expect(focusMock).toHaveBeenCalled();
    });
  });
});
