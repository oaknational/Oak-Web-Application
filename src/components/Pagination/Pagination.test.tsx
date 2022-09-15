import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import Pagination from "./Pagination";

describe("Pagination", () => {
  test("it renders", () => {
    const totalCount = 100;
    const currentPage = 1;
    const pageSize = 6;
    const onPageChange = jest.fn();

    const { getByRole } = renderWithTheme(
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    );

    getByRole("navigation");
  });
  test("displays the correct total pages", () => {
    const totalCount = 100;
    const currentPage = 1;
    const pageSize = 6;
    const onPageChange = jest.fn();

    const { getByText } = renderWithTheme(
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    );

    getByText("page 1 / 17");
  });
  test("displays the correct current page", () => {
    const totalCount = 100;
    const currentPage = 3;
    const pageSize = 4;
    const onPageChange = jest.fn();

    const { getByText } = renderWithTheme(
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    );

    getByText("page 3 / 25");
  });
  test("clicking next arrow takes you to the next page", () => {
    const totalCount = 100;
    const currentPage = 6;
    const pageSize = 4;
    const onPageChange = jest.fn();
    const { getByText, rerender } = renderWithTheme(
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    );

    getByText("page 6 / 25");
    rerender(
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage + 1}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    );
    getByText("page 7 / 25");
  });
  test("clicking previous arrow takes you to the previous page", () => {
    const totalCount = 100;
    const currentPage = 6;
    const pageSize = 4;
    const onPageChange = jest.fn();
    const { getByText, rerender } = renderWithTheme(
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    );

    getByText("page 6 / 25");
    rerender(
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage - 1}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    );
    getByText("page 5 / 25");
  });
  test("the next arrow is disabled when there are no more pages", () => {
    const totalCount = 100;
    const currentPage = 25;
    const pageSize = 4;
    const onPageChange = jest.fn();
    const { getByText, getByLabelText } = renderWithTheme(
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    );
    const nextButton = getByLabelText("next page");

    getByText("page 25 / 25");

    expect(nextButton).toBeDisabled();
  });
  test("previous button is disabled on page 1", () => {
    const totalCount = 100;
    const currentPage = 1;
    const pageSize = 4;
    const onPageChange = jest.fn();
    const { getByText, getByLabelText } = renderWithTheme(
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    );
    const previousButton = getByLabelText("previous page");

    getByText("page 1 / 25");

    expect(previousButton).toBeDisabled();
  });
  test("nothing is displayed if there is only one page", () => {
    const totalCount = 3;
    const currentPage = 1;
    const pageSize = 4;
    const onPageChange = jest.fn();
    const { queryByRole } = renderWithTheme(
      <Pagination
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    );

    expect(queryByRole("navigation")).toBeNull();
  });
});
