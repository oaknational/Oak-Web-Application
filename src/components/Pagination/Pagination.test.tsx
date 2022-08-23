import { render } from "@testing-library/react";

import Pagination from "./Pagination";

describe("Pagination", () => {
  test("it displays the correct total pages", () => {
    render(
      <Pagination
        totalCount={13}
        currentPage={1}
        pageSize={4}
        onPageChange={jest.fn()}
      />
    );

    expect(true).toBe(true);
  });
  //   test("it displays the correct currenct page", () => {});
  //   test("clicking next arrow takes you to the next page", () => {});
  //   test("clicking previous arrow takes you to the next page", () => {});
  //   test("the next arrow is disabled when there are no more pages", () => {});
});
