import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import ActiveFilters from "./ActiveFilters";

jest.mock("../../context/Search/SearchContext", () => ({
  __esModule: true,
  ...jest.requireActual("../../context/Search/SearchContext"),
  useSearchQuery: () => ({
    keyStages: new Set(["1", "2", "4"]),
    setKeyStages: jest.fn(),
  }),
}));
jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("ActiveFilters", () => {
  test("should render an array of active filters buttons based on the selected keystages", () => {
    const { getAllByRole, queryByText } = renderWithTheme(<ActiveFilters />);
    const activeFilterButtons = getAllByRole("button");

    expect(activeFilterButtons).toHaveLength(3);
    expect(activeFilterButtons[0]).toContainElement(queryByText("KS1"));
    expect(activeFilterButtons[1]).toContainElement(queryByText("KS2"));
    expect(activeFilterButtons[2]).toContainElement(queryByText("KS4"));
  });
});
